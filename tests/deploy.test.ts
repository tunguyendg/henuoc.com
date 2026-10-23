import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, readdir, rm, utimes, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, beforeEach, expect, it } from "vitest";

let root: string;
const shaA = "a".repeat(40);
const shaB = "b".repeat(40);
const shaC = "c".repeat(40);
const shaD = "d".repeat(40);

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), "henuoc-deploy-"));
  await mkdir(join(root, "deploy/henuoc"), { recursive: true });
  for (const name of ["activate.sh", "rollback.sh"]) {
    const source = await readFile(resolve("scripts/deploy", name), "utf8");
    // Substitute only the host root; never change this machine's HOME or access a real host.
    await writeFile(join(root, "deploy", name), source.replaceAll("$HOME", "$DEPLOY_TEST_ROOT"));
  }
});
afterEach(async () => rm(root, { recursive: true, force: true }));

async function release(sha: string) {
  const directory = join(root, "deploy/henuoc", sha);
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, "server.js"), `// release ${sha}\n`);
  await writeFile(join(directory, "REVISION"), `${sha}\n`);
}

function hostScript(name: string, ...args: string[]) {
  return spawnSync("bash", [join(root, "deploy", name), ...args], {
    encoding: "utf8",
    env: { ...process.env, DEPLOY_TEST_ROOT: root },
  });
}

it("activates, restarts Passenger, preserves the wrapper, and rolls back using PREVIOUS", async () => {
  await release(shaA);
  await release(shaB);
  await mkdir(join(root, "henuoc-app"));
  await writeFile(join(root, "henuoc-app/server.js"), "wrapper");
  expect(hostScript("activate.sh", shaA).status).toBe(0);
  await writeFile(join(root, "henuoc-app/app/stale.txt"), "stale");
  expect(hostScript("activate.sh", shaB).status).toBe(0);
  expect((await readFile(join(root, "deploy/henuoc/PREVIOUS"), "utf8")).trim()).toBe(shaA);
  expect(hostScript("activate.sh", shaB).status).toBe(0);
  expect((await readFile(join(root, "deploy/henuoc/PREVIOUS"), "utf8")).trim()).toBe(shaA);
  expect(hostScript("rollback.sh").status).toBe(0);
  expect((await readFile(join(root, "henuoc-app/app/REVISION"), "utf8")).trim()).toBe(shaA);
  expect(await readFile(join(root, "henuoc-app/server.js"), "utf8")).toBe("wrapper");
  expect(await readFile(join(root, "henuoc-app/tmp/restart.txt"), "utf8")).toBe("");
  await expect(readFile(join(root, "henuoc-app/app/stale.txt"))).rejects.toThrow();
});

it("keeps CURRENT and PREVIOUS even when PREVIOUS is the oldest directory", async () => {
  for (const sha of [shaA, shaB, shaC, shaD]) await release(sha);
  await writeFile(join(root, "deploy/henuoc/CURRENT"), shaA);
  await utimes(join(root, "deploy/henuoc", shaA), new Date(0), new Date(0));
  expect(hostScript("activate.sh", shaB).status).toBe(0);
  const directories = (await readdir(join(root, "deploy/henuoc"), { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  expect(directories).toHaveLength(3);
  expect(directories).toContain(shaA);
  expect(directories).toContain(shaB);
});

it("rejects invalid releases and reports a missing rollback target", async () => {
  expect(hostScript("activate.sh", "../outside").status).not.toBe(0);
  await release(shaA);
  await writeFile(join(root, "deploy/henuoc", shaA, "REVISION"), shaB);
  expect(hostScript("activate.sh", shaA).stderr).toContain("revision mismatch");
  const rollback = hostScript("rollback.sh");
  expect(rollback.status).not.toBe(0);
  expect(rollback.stderr).toContain("no PREVIOUS");
});

async function smokeTest(responses: unknown[]) {
  const workflow = await readFile(resolve(".github/workflows/deploy.yml"), "utf8");
  const block = workflow.match(
    /- name: Smoke test and rollback on failure\n        run: \|\n([\s\S]*?)(?=\n      - name:)/,
  )?.[1];
  if (!block) throw new Error("Smoke test step not found");
  const script = block
    .split("\n")
    .map((line) => line.replace(/^ {10}/, ""))
    .join("\n");
  const bin = join(root, "bin");
  await mkdir(bin);
  const prelude = `#!${process.execPath}\nconst fs = require('node:fs');\n`;
  await writeFile(
    join(bin, "curl"),
    prelude +
      `
const countFile = process.env.DEPLOY_TEST_ROOT + '/attempts';
const count = fs.existsSync(countFile) ? Number(fs.readFileSync(countFile, 'utf8')) : 0;
fs.writeFileSync(countFile, String(count + 1));
const responses = JSON.parse(process.env.SMOKE_RESPONSES);
const response = responses[Math.min(count, responses.length - 1)];
if (response === 'http-error') process.exit(22);
const args = process.argv.slice(2);
fs.writeFileSync(args[args.indexOf('-o') + 1], typeof response === 'string' ? response : JSON.stringify(response));
`,
    { mode: 0o755 },
  );
  for (const command of ["ssh", "sleep"]) {
    await writeFile(
      join(bin, command),
      prelude +
        `fs.appendFileSync(process.env.DEPLOY_TEST_ROOT + '/${command}.log', JSON.stringify(process.argv.slice(2)) + '\\n');\n`,
      { mode: 0o755 },
    );
  }
  return spawnSync("bash", ["-e", "-o", "pipefail", "-c", script], {
    cwd: root,
    encoding: "utf8",
    env: {
      ...process.env,
      PATH: `${bin}:${process.env.PATH}`,
      DEPLOY_TEST_ROOT: root,
      SMOKE_RESPONSES: JSON.stringify(responses),
      SSH_HOST: "host.test",
      SSH_PORT: "2210",
      SSH_USER: "test-user",
      GITHUB_SHA: shaB,
    },
  });
}

it("retries HTTP errors, invalid JSON, false ok, and stale revisions until the exact revision is healthy", async () => {
  const result = await smokeTest([
    "http-error",
    "not JSON",
    { ok: false, revision: shaB },
    { ok: true, revision: shaA },
    { ok: true, revision: shaB },
  ]);
  expect(result.status).toBe(0);
  expect(await readFile(join(root, "attempts"), "utf8")).toBe("5");
  const sleeps = (await readFile(join(root, "sleep.log"), "utf8")).trim().split("\n");
  expect(sleeps).toEqual(Array(4).fill('["6"]'));
  await expect(readFile(join(root, "ssh.log"))).rejects.toThrow();
});

it("rolls back once after ten failures and still fails the deploy job", async () => {
  const result = await smokeTest([{ ok: true, revision: shaA }]);
  expect(result.status).toBe(1);
  expect(await readFile(join(root, "attempts"), "utf8")).toBe("10");
  expect((await readFile(join(root, "sleep.log"), "utf8")).trim().split("\n")).toHaveLength(9);
  const sshCalls = (await readFile(join(root, "ssh.log"), "utf8")).trim().split("\n");
  expect(sshCalls).toHaveLength(1);
  expect(sshCalls[0]).toContain("StrictHostKeyChecking=yes");
  expect(sshCalls[0]).toContain("bash ~/deploy/rollback.sh");
});

import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import manifest from "../src/content/ornaments/redoute.json";

import {
  fetchOrnaments,
  parseOrnamentManifest,
  resizeArgs,
  type ConvertArgs,
} from "../scripts/fetch-ornaments.mjs";

let root: string;
let manifestPath: string;
let outputDir: string;
const first = manifest[0]!;
const sample = [first, manifest[1]!];

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), "henuoc-ornaments-"));
  manifestPath = join(root, "redoute.json");
  outputDir = join(root, "output");
  await writeFile(manifestPath, JSON.stringify(sample));
});
afterEach(async () => rm(root, { recursive: true, force: true }));

function options(
  fetchImpl = vi.fn<typeof fetch>(
    async () => new Response(Buffer.alloc(51201), { headers: { "content-type": "image/jpeg" } }),
  ),
) {
  const converted: ConvertArgs[] = [];
  const convert = vi.fn(async (args: ConvertArgs) => {
    converted.push(args);
    await writeFile(args.output, "webp");
  });
  return { manifestPath, outputDir, fetchImpl, convert, converted, report: vi.fn() };
}

it("parses the real manifest: 8 images, 4 do-do and 4 hong", () => {
  const items = parseOrnamentManifest(manifest);
  expect(items).toHaveLength(8);
  expect(items.filter((i) => i.palette === "do-do")).toHaveLength(4);
  expect(items.filter((i) => i.palette === "hong")).toHaveLength(4);
});

it("rejects bad license, hosts, scheme, duplicates and non-kebab files", () => {
  expect(() => parseOrnamentManifest([{ ...first, license: "CC-BY" }])).toThrow("CC0");
  expect(() => parseOrnamentManifest([{ ...first, imageUrl: "https://evil.test/a.jpg" }])).toThrow(
    "imageUrl",
  );
  expect(() =>
    parseOrnamentManifest([
      { ...first, imageUrl: "http://openaccess-cdn.clevelandart.org/a/a_print.jpg" },
    ]),
  ).toThrow("HTTPS");
  expect(() => parseOrnamentManifest([{ ...first, museumUrl: "https://evil.test/art/1" }])).toThrow(
    "museumUrl",
  );
  expect(() => parseOrnamentManifest([first, first])).toThrow("trùng");
  expect(() => parseOrnamentManifest([{ ...first, file: "../Out" }])).toThrow("kebab-case");
  expect(() => parseOrnamentManifest([{ ...first, palette: "xanh" }])).toThrow("palette");
  expect(() => parseOrnamentManifest([{ ...first, artists: [] }])).toThrow("artists");
});

it("downloads, converts and skips files that already exist", async () => {
  const config = options();
  await fetchOrnaments(config);
  expect(config.fetchImpl).toHaveBeenCalledTimes(2);
  expect(await readFile(join(outputDir, `${first.file}.webp`), "utf8")).toBe("webp");
  await fetchOrnaments(config);
  expect(config.fetchImpl).toHaveBeenCalledTimes(2);
  expect(config.convert).toHaveBeenCalledTimes(2);
});

it("rejects wrong content-type and writes nothing", async () => {
  const config = options(
    vi.fn<typeof fetch>(
      async () => new Response("html", { headers: { "content-type": "text/html" } }),
    ),
  );
  await expect(fetchOrnaments(config)).rejects.toThrow("image/jpeg");
  expect(config.convert).not.toHaveBeenCalled();
  await expect(readFile(join(outputDir, `${first.file}.webp`))).rejects.toThrow();
});

it("computes resize so the longest edge is at most 1200 without upscaling", async () => {
  expect(resizeArgs(2563, 3400)).toEqual(["-resize", "0", "1200"]);
  expect(resizeArgs(3400, 2563)).toEqual(["-resize", "1200", "0"]);
  expect(resizeArgs(800, 1000)).toEqual([]);
  const config = options();
  await fetchOrnaments(config);
  expect(config.converted[0]).toMatchObject({ width: first.width, height: first.height });
});

it("does not duplicate credits on a second run", async () => {
  const config = options();
  await fetchOrnaments(config);
  const creditsPath = join(outputDir, "CREDITS.md");
  const credits = await readFile(creditsPath, "utf8");
  expect(credits).toContain(first.museumUrl);
  expect(credits).toContain("Cleveland Museum of Art, CC0");
  await fetchOrnaments(config);
  expect(await readFile(creditsPath, "utf8")).toBe(credits);
});

it("cleans up temp directories even when conversion fails", async () => {
  const config = options();
  const dirs: string[] = [];
  config.convert.mockImplementation(async (args: ConvertArgs) => {
    dirs.push(args.input);
    throw new Error("cwebp hỏng");
  });
  await expect(fetchOrnaments(config)).rejects.toThrow("cwebp hỏng");
  expect(dirs.length).toBeGreaterThan(0);
  for (const input of dirs) {
    const dir = input.slice(0, input.lastIndexOf("/"));
    await expect(readdir(dir)).rejects.toThrow();
  }
});

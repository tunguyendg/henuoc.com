import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import fixture from "./fixtures/cam-nang-images.json";

import { fetchArticleImages, parseImageManifest } from "../scripts/fetch-article-images.mjs";
let root: string;
let manifestPath: string;
let outputDir: string;

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), "henuoc-images-"));
  manifestPath = join(root, "images.json");
  outputDir = join(root, "output");
  await writeFile(manifestPath, JSON.stringify(fixture));
});
afterEach(async () => rm(root, { recursive: true, force: true }));

function options(
  fetchImpl = vi.fn<typeof fetch>(
    async () =>
      new Response(Buffer.alloc(20481), {
        headers: { "content-type": "image/webp" },
      }),
  ),
) {
  return { manifestPath, outputDir, fetchImpl, report: vi.fn() };
}

it("downloads the fixture, keeps existing files, and appends each credit only once", async () => {
  const config = options();
  await fetchArticleImages(config);
  expect(config.fetchImpl).toHaveBeenCalledTimes(2);
  expect(config.fetchImpl.mock.calls[0]?.[0]).toBe(
    `https://images.unsplash.com/${fixture[0]!.cdnPath}?w=1600&q=75&fm=webp&fit=max`,
  );
  const image = join(outputDir, "cach-ghi-thiep-cuoi/anh-bia.webp");
  expect((await readFile(image)).length).toBe(20481);
  const creditsPath = join(outputDir, "CREDITS.md");
  const credits = await readFile(creditsPath, "utf8");
  expect(credits).toContain(fixture[0]!.photographer);
  expect(credits).toContain(fixture[1]!.unsplashUrl);
  await fetchArticleImages(config);
  expect(config.fetchImpl).toHaveBeenCalledTimes(2);
  expect(await readFile(creditsPath, "utf8")).toBe(credits);
});

it.each([
  ["HTTP 404", () => new Response("missing", { status: 404 })],
  ["content-type", () => new Response("html", { headers: { "content-type": "text/html" } })],
  [
    "20480 byte",
    () => new Response(Buffer.alloc(20480), { headers: { "content-type": "image/webp" } }),
  ],
] as const)(
  "reports %s with the image path and never writes invalid downloads",
  async (message, response) => {
    const config = options(vi.fn<typeof fetch>(async () => response()));
    await expect(fetchArticleImages(config)).rejects.toThrow(message);
    await expect(readFile(join(outputDir, "cach-ghi-thiep-cuoi/anh-bia.webp"))).rejects.toThrow();
    await expect(readFile(join(outputDir, "CREDITS.md"))).rejects.toThrow();
  },
);

it("reports a missing manifest clearly", async () => {
  const config = options();
  config.manifestPath = join(root, "absent.json");
  await expect(fetchArticleImages(config)).rejects.toThrow("Chưa có manifest");
  expect(config.fetchImpl).not.toHaveBeenCalled();
});

it("rejects unsafe paths and duplicate entries before fetching", () => {
  expect(() => parseImageManifest([{ ...fixture[0], slug: "../outside" }])).toThrow("kebab-case");
  expect(() =>
    parseImageManifest([{ ...fixture[0], cdnPath: "https://other.test/image" }]),
  ).toThrow("cdnPath");
  expect(() => parseImageManifest([fixture[0], fixture[0]])).toThrow("trùng");
});

it("accepts editorial file paths while keeping writes inside the slug directory", () => {
  const entry = { ...fixture[0], file: "cam-nang/cach-ghi-thiep-cuoi/anh-bia.webp" };
  expect(parseImageManifest([entry])[0]?.file).toBe("anh-bia");
  expect(() => parseImageManifest([fixture[0], entry])).toThrow("trùng");
  expect(() => parseImageManifest([{ ...entry, file: "cam-nang/other/anh-bia.webp" }])).toThrow(
    "kebab-case",
  );
});

it("keeps successful downloads and credits when another image fails", async () => {
  const config = options();
  config.fetchImpl.mockResolvedValueOnce(new Response("missing", { status: 404 }));
  await expect(fetchArticleImages(config)).rejects.toThrow("cach-ghi-thiep-cuoi/anh-bia.webp");
  expect((await readFile(join(outputDir, "cach-ghi-thiep-cuoi/thiep-moi.webp"))).length).toBe(
    20481,
  );
  const credits = await readFile(join(outputDir, "CREDITS.md"), "utf8");
  expect(credits).toContain("thiep-moi.webp");
  expect(credits).not.toContain("anh-bia.webp");
});

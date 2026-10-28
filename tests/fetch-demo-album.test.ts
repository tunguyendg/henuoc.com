import { mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, it, vi } from "vitest";
import manifest from "../src/content/demo-album/images.json";
import { fetchDemoAlbum, parseDemoAlbumManifest } from "../scripts/fetch-demo-album.mjs";

const first = manifest[0]!;

it("manifest thật hợp lệ", () => {
  expect(parseDemoAlbumManifest(manifest)).toHaveLength(manifest.length);
});

it("từ chối manifest sai", () => {
  expect(() => parseDemoAlbumManifest({})).toThrow("mảng");
  expect(() => parseDemoAlbumManifest([{ ...first, file: "Hero_1" }])).toThrow("kebab-case");
  expect(() => parseDemoAlbumManifest([{ ...first, unsplashId: "short" }])).toThrow("unsplashId");
  expect(() => parseDemoAlbumManifest([{ ...first, alt: "a\nb" }])).toThrow("xuống dòng");
  expect(() => parseDemoAlbumManifest([{ ...first, unsplashUrl: "https://evil.com/x" }])).toThrow(
    "unsplash.com",
  );
  expect(() => parseDemoAlbumManifest([first, first])).toThrow("trùng");
  expect(() => parseDemoAlbumManifest([{ ...first, width: 0 }])).toThrow("width");
});

it("mục có existing → không gọi mạng", async () => {
  const root = await mkdtemp(join(tmpdir(), "henuoc-demo-album-"));
  try {
    const manifestPath = join(root, "images.json");
    await writeFile(manifestPath, JSON.stringify([first]));
    const fetchImpl = vi.fn<typeof fetch>();
    await fetchDemoAlbum({
      manifestPath,
      outputDir: join(root, "out"),
      creditsPath: join(root, "CREDITS.md"),
      fetchImpl,
      report: () => {},
    });
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(await readdir(root)).toEqual(["images.json"]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

it("redirect tới host lạ → lỗi, không ghi file", async () => {
  const root = await mkdtemp(join(tmpdir(), "henuoc-demo-album-"));
  try {
    const manifestPath = join(root, "images.json");
    const fresh: Record<string, unknown> = { ...first };
    delete fresh.existing;
    await writeFile(manifestPath, JSON.stringify([fresh]));
    const fetchImpl = vi.fn<typeof fetch>(
      async () =>
        new Response(null, { status: 302, headers: { location: "https://evil.com/a.jpg" } }),
    );
    await expect(
      fetchDemoAlbum({
        manifestPath,
        outputDir: join(root, "out"),
        creditsPath: join(root, "CREDITS.md"),
        fetchImpl,
        report: () => {},
      }),
    ).rejects.toThrow("host không cho phép");
    expect(await readdir(root)).toEqual(["images.json"]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

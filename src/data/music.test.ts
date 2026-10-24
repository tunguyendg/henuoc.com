import { statSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { getTrack, getTracks, musicSlugSchema } from "./music";
import { MusicToggle } from "@/themes/_shared/MusicToggle";
import { optionsSchema } from "@/themes/placeholder/manifest";

const tracks = getTracks();
const enabled = getTracks({ enabled: true });

describe("Kho nhạc", () => {
  it("có bài enabled, slug không trùng và getTrack tra đúng bài", () => {
    expect(enabled.length).toBeGreaterThan(0);
    expect(new Set(tracks.map((track) => track.slug)).size).toBe(tracks.length);
    for (const track of tracks) expect(getTrack(track.slug)).toEqual(track);
    expect(getTrack("khong-co")).toBeUndefined();
    expect(getTrack("toString")).toBeUndefined();
  });

  it.each(enabled)("$slug: enabled có file M4A và không có giọng hát", (track) => {
    expect(track.enabled).toBe(true);
    expect(track.hasVocals).toBe(false);
    expect(track.src).toBe(`/audio/library/${track.slug}.m4a`);
    expect(
      statSync(join(process.cwd(), "public", track.src.slice(1)), {
        throwIfNoEntry: false,
      })?.isFile(),
    ).toBe(true);
  });

  it.each(tracks.filter((track) => track.license.startsWith("CC-BY")))(
    "$slug: CC-BY có credit",
    (track) => {
      expect(track.credit?.trim().length).toBeGreaterThan(0);
    },
  );

  it("musicSlug chỉ nhận bài tồn tại và enabled", () => {
    for (const track of enabled)
      expect(optionsSchema.safeParse({ musicSlug: track.slug }).success).toBe(true);
    for (const track of getTracks({ enabled: false }))
      expect(musicSlugSchema.safeParse(track.slug).success).toBe(false);
    expect(optionsSchema.safeParse({ musicSlug: "khong-co" }).success).toBe(false);
    expect(optionsSchema.safeParse({ musicSlug: "/audio/demo-piano.m4a" }).success).toBe(false);
  });

  it("nút nhạc hiện đầy đủ credit và ẩn cả credit trong preview", () => {
    const props = {
      music: { isPlaying: false, isMuted: false, unlock() {}, toggle() {} },
      credit: getTrack("kevin-canon-in-d-major")!.credit,
    };
    const html = renderToStaticMarkup(createElement(MusicToggle, props));
    expect(html).toContain("Bật nhạc");
    expect(html).toContain("Kevin MacLeod");
    expect(html).toContain("https://creativecommons.org/licenses/by/4.0/");
    expect(renderToStaticMarkup(createElement(MusicToggle, { ...props, hidden: true }))).toBe("");
  });
});

import { statSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { getTrack, getTracks, musicSlugSchema } from "./music";
import { MusicCredit, musicCreditText } from "@/themes/_shared/MusicCredit";
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

  it("nút nhạc chỉ có nút tròn, không có bong bóng credit", () => {
    const props = {
      music: { isPlaying: false, isMuted: false, unlock() {}, toggle() {} },
    };
    const html = renderToStaticMarkup(createElement(MusicToggle, props));
    expect(html).toContain("Bật nhạc");
    expect(html).not.toContain("Kevin MacLeod");
    expect(html).not.toContain("<small");
    expect(html).not.toContain("https://creativecommons.org/licenses/by/4.0/");
    expect(renderToStaticMarkup(createElement(MusicToggle, { ...props, hidden: true }))).toBe("");
  });

  it.each(enabled)("$slug: credit CC-BY ghi đã chỉnh sửa, bài khác không có credit", (track) => {
    const text = musicCreditText(track);
    if (track.license !== "CC-BY-4.0") return expect(text).toBeNull();
    expect(text).toMatch(/^Nhạc nền \(đã chỉnh sửa\): /);
    expect(text).toContain("Kevin MacLeod");
    expect(text).toContain("https://creativecommons.org/licenses/by/4.0/");
    expect(text).not.toMatch(/\n/);
  });

  it("MusicCredit ẩn trong preview và khi không có bài", () => {
    const track = getTrack("kevin-there-is-romance")!;
    const html = renderToStaticMarkup(createElement(MusicCredit, { track }));
    expect(html).toContain("(đã chỉnh sửa)");
    expect(renderToStaticMarkup(createElement(MusicCredit, { track, hidden: true }))).toBe("");
    expect(renderToStaticMarkup(createElement(MusicCredit, {}))).toBe("");
  });
});

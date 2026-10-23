import { describe, expect, it } from "vitest";

import {
  imageUrlSchema,
  internalPathSchema,
  isAllowedImageUrl,
  isAllowedMapUrl,
  isInternalPath,
  mapUrlSchema,
  musicUrlSchema,
} from "./url-allowlist";

describe("imageUrlSchema / musicUrlSchema", () => {
  it("chấp nhận path nội bộ", () => {
    expect(imageUrlSchema.parse("/images/themes/a.webp")).toBe("/images/themes/a.webp");
    expect(musicUrlSchema.parse("/audio/piano-1.mp3")).toBe("/audio/piano-1.mp3");
  });

  it("chấp nhận https + media host", () => {
    expect(imageUrlSchema.parse("https://media.henuoc.com/w/1/cover.webp")).toBe(
      "https://media.henuoc.com/w/1/cover.webp",
    );
    expect(musicUrlSchema.safeParse("https://media.henuoc.com/music/a.mp3").success).toBe(true);
  });

  it("host chữ hoa được URL parser chuẩn hoá thành chữ thường → chấp nhận, output đã chuẩn hoá", () => {
    expect(imageUrlSchema.parse("https://MEDIA.henuoc.com/a")).toBe("https://media.henuoc.com/a");
  });

  it.each([
    ["chuỗi rỗng", ""],
    ["protocol-relative", "//evil.com/x"],
    ["path traversal", "/../x"],
    ["path traversal mã hoá", "/%2e%2e/x"],
    ["backslash", "/\\evil.com"],
    ["khoảng trắng / ký tự điều khiển", "/a b"],
    ["tab bị parser lặng lẽ bỏ", "https://media.henuoc.com/a\tb"],
    ["javascript:", "javascript:alert(1)"],
    ["data:", "data:image/svg+xml;base64,PHN2Zz4="],
    ["http:", "http://media.henuoc.com/a"],
    ["host giả dạng hậu tố", "https://media.henuoc.com.evil.com/a"],
    ["host đúng nằm trong path", "https://evil.com/media.henuoc.com"],
    ["có username", "https://user@media.henuoc.com/a"],
    ["có username:password", "https://u:p@media.henuoc.com/a"],
    ["có port", "https://media.henuoc.com:8443/a"],
    ["https không có //", "https:media.henuoc.com/a"],
    ["path tương đối", "images/a.webp"],
  ])("từ chối %s", (_label, value) => {
    expect(imageUrlSchema.safeParse(value).success).toBe(false);
    expect(musicUrlSchema.safeParse(value).success).toBe(false);
    expect(isAllowedImageUrl(value)).toBe(false);
  });

  it("path nội bộ giới hạn theo tiền tố: ảnh /images,/themes; nhạc /audio", () => {
    expect(imageUrlSchema.safeParse("/themes/hong-pastel/a.webp").success).toBe(true);
    expect(imageUrlSchema.safeParse("/audio/a.mp3").success).toBe(false);
    expect(musicUrlSchema.safeParse("/images/a.webp").success).toBe(false);
    for (const bad of ["/api/x", "/admin/x"]) {
      expect(imageUrlSchema.safeParse(bad).success).toBe(false);
      expect(musicUrlSchema.safeParse(bad).success).toBe(false);
    }
  });

  it("từ chối URL dài hơn 2048 ký tự", () => {
    const long = "/images/" + "a".repeat(2048);
    expect(imageUrlSchema.safeParse(long).success).toBe(false);
  });
});

describe("mapUrlSchema", () => {
  it.each([
    "https://www.google.com/maps/place/Trung+tam+Tiec+cuoi/@10.77,106.70,17z",
    "https://www.google.com/maps?q=10.77,106.70",
    "https://google.com/maps/search/?api=1&query=abc",
    "https://maps.google.com/?q=abc",
    "https://maps.google.com/?q=Ha+Noi",
    "https://www.google.com.vn/maps/place/abc",
    "https://maps.app.goo.gl/AbCdEf123",
    "https://goo.gl/maps/AbCdEf123",
  ])("chấp nhận link Google Maps: %s", (value) => {
    expect(mapUrlSchema.safeParse(value).success).toBe(true);
    expect(isAllowedMapUrl(value)).toBe(true);
  });

  it.each([
    ["google.com nhưng không phải /maps", "https://www.google.com/search?q=x"],
    ["/mapsxyz không phải mục maps", "https://www.google.com/mapsevil"],
    ["open redirect maps.google.com/url", "https://maps.google.com/url?q=https://evil.com"],
    ["open redirect www.google.com/url", "https://www.google.com/url?q=https://evil.com"],
    ["open redirect google.com.vn/url", "https://www.google.com.vn/url?q=https://evil.com"],
    ["www.google.com path gốc", "https://www.google.com/?q=x"],
    ["maps.google.com path khác", "https://maps.google.com/other"],
    ["goo.gl rút gọn thường", "https://goo.gl/abc"],
    ["http:", "http://maps.google.com/?q=abc"],
    ["javascript:", "javascript:alert(1)"],
    ["host lạ", "https://evil.com/maps"],
    ["host giả dạng", "https://maps.google.com.evil.com/"],
    ["có username", "https://u@maps.app.goo.gl/x"],
    ["có port", "https://maps.app.goo.gl:444/x"],
    ["path nội bộ", "/maps"],
  ])("từ chối %s", (_label, value) => {
    expect(mapUrlSchema.safeParse(value).success).toBe(false);
    expect(isAllowedMapUrl(value)).toBe(false);
  });
});

describe("internalPathSchema (icsUrl)", () => {
  it("chấp nhận route nội bộ", () => {
    expect(internalPathSchema.parse("/api/w/abc/ics?event=1")).toBe("/api/w/abc/ics?event=1");
  });

  it.each([
    "https://media.henuoc.com/a.ics",
    "//evil.com/a.ics",
    "/../a.ics",
    "/a\\b",
    "",
    "/a\nb",
  ])("từ chối %s", (value) => {
    expect(internalPathSchema.safeParse(value).success).toBe(false);
    expect(isInternalPath(value)).toBe(false);
  });
});

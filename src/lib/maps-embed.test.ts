import { describe, expect, it } from "vitest";
import { mapEmbedUrl } from "./maps-embed";

const KEY = "AIzaSyA-fake_key_0123456789abcdefghij";

describe("mapEmbedUrl", () => {
  it("thiếu key → undefined", () => {
    expect(mapEmbedUrl("Nhà hàng A", undefined)).toBeUndefined();
    expect(mapEmbedUrl("Nhà hàng A", "")).toBeUndefined();
  });

  it("query rỗng sau trim → undefined", () => {
    expect(mapEmbedUrl("   \n\t ", KEY)).toBeUndefined();
  });

  it("host, path và tham số đúng, không có tham số lạ", () => {
    const url = new URL(mapEmbedUrl("Nhà hàng A", KEY)!);
    expect(url.protocol).toBe("https:");
    expect(url.hostname).toBe("www.google.com");
    expect(url.pathname).toBe("/maps/embed/v1/place");
    expect([...url.searchParams.keys()].sort()).toEqual(["key", "language", "q", "region"]);
    expect(url.searchParams.get("key")).toBe(KEY);
    expect(url.searchParams.get("language")).toBe("vi");
    expect(url.searchParams.get("region")).toBe("VN");
  });

  it("encode tiếng Việt, & và # không tách tham số", () => {
    const raw = "Nhà hàng Hoa Sen & Bạn, 12 #3 Đà Lạt";
    const href = mapEmbedUrl(raw, KEY)!;
    const url = new URL(href);
    expect(url.searchParams.get("q")).toBe(raw);
    expect(url.hash).toBe("");
    expect([...url.searchParams.keys()]).toHaveLength(4);
    expect(href).not.toContain("&Bạn");
  });

  it("gom khoảng trắng và cắt tối đa 200 ký tự", () => {
    expect(new URL(mapEmbedUrl("  A \n  B  ", KEY)!).searchParams.get("q")).toBe("A B");
    expect(new URL(mapEmbedUrl("x".repeat(500), KEY)!).searchParams.get("q")).toHaveLength(200);
  });
});

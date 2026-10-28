import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { demoContent } from "../../_demo/content";
import { Venue } from "./Venue";

// The env module reads process.env at import time, so the key is injected with a mock instead.
vi.mock("@/lib/env.client", () => ({
  clientEnv: { NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY: "AIzaTestKeyTestKeyTestKey12345" },
}));
// "server-only" is a bundler marker; the demo content imports it.
vi.mock("server-only", () => ({}));

describe("Venue với key Google Maps", () => {
  const main = demoContent.events.find((e) => e.id === "demo-tiec-nha-trai");

  it("nhúng iframe có title, lazy, referrerPolicy và chỉ chứa venue + địa chỉ", () => {
    const html = renderToStaticMarkup(
      createElement(Venue, { events: demoContent.events, mainEvent: main }),
    );
    expect(html).toContain("<iframe");
    expect(html).toContain('title="Bản đồ Trung tâm tiệc cưới Hồng Ngà"');
    expect(html).toContain('loading="lazy"');
    expect(html).toContain('referrerPolicy="strict-origin-when-cross-origin"');
    expect(html).toContain("https://www.google.com/maps/embed/v1/place");
    expect(html).toContain("Tư gia nhà gái");
  });
});

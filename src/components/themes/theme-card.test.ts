import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { getTheme } from "@/data/themes";
import { ThemeCard } from "./theme-card";

const render = (slug: string) =>
  renderToStaticMarkup(createElement(ThemeCard, { theme: getTheme(slug)! }));

describe("ThemeCard", () => {
  it("mẫu có thumbnail hiện ảnh bìa với alt tiếng Việt", () => {
    const html = render("blush-rose");
    expect(html).toContain("<img");
    expect(html).toContain("Thiệp mẫu Blush Rose: ảnh chụp bìa thiệp");
  });

  it("mẫu preview dùng MiniInvitation, không có thẻ img", () => {
    const html = render("botanical-garden");
    expect(html).not.toContain("<img");
    expect(html).toContain("Botanical Garden");
  });
});

import { describe, expect, it } from "vitest";
import {
  invitationStyles,
  invitationVariables,
  renderInvitation,
  templateSlots,
} from "./invitation-templates";

const allTemplates = invitationStyles.flatMap((s) => s.templates);

describe("renderInvitation", () => {
  it("thay đủ biến, trim khoảng trắng", () => {
    expect(
      renderInvitation("Mời {tenKhach} dự cưới {chuRe} & {coDau} lúc {gio}, {ngay} tại {diaDiem}", {
        tenKhach: "  chị Lan ",
        chuRe: "Hoàng Nam",
        coDau: "Minh Anh",
        gio: "11 giờ",
        ngay: "20/12/2026",
        diaDiem: "Nhà hàng Hoa Sen",
      }),
    ).toBe("Mời chị Lan dự cưới Hoàng Nam & Minh Anh lúc 11 giờ, 20/12/2026 tại Nhà hàng Hoa Sen");
  });

  it("trường trống hoặc thiếu → giữ chỗ dạng [..]", () => {
    expect(renderInvitation("{tenKhach} · {ngay} · {link}", { tenKhach: "   " })).toBe(
      "[tên khách] · [ngày cưới] · [link thiệp]",
    );
  });

  it("biến lặp lại được thay ở mọi chỗ", () => {
    expect(renderInvitation("{tenKhach} ơi, mời {tenKhach}", { tenKhach: "Lan" })).toBe(
      "Lan ơi, mời Lan",
    );
  });

  it("biến lạ giữ nguyên, giá trị chứa {..} không bị thay lần hai", () => {
    expect(renderInvitation("{foo} {tenKhach}", { tenKhach: "{coDau}" })).toBe("{foo} {coDau}");
  });
});

describe("invitationStyles", () => {
  it("mỗi kiểu có 2–3 mẫu, id duy nhất", () => {
    const ids = new Set<string>();
    for (const style of invitationStyles) {
      expect(style.templates.length).toBeGreaterThanOrEqual(2);
      expect(style.templates.length).toBeLessThanOrEqual(3);
      for (const id of [style.id, ...style.templates.map((t) => t.id)]) {
        expect(ids.has(id), id).toBe(false);
        ids.add(id);
      }
    }
  });

  it("mọi mẫu chỉ dùng biến hợp lệ và không còn ngoặc nhọn thừa", () => {
    const valid = new Set<string>(invitationVariables);
    for (const t of allTemplates) {
      for (const slot of templateSlots(t.text))
        expect(valid.has(slot), `${t.id}: {${slot}}`).toBe(true);
      const stripped = t.text.replace(/\{\w+\}/g, "");
      expect(stripped, t.id).not.toMatch(/[{}]/);
    }
  });

  it("mọi mẫu nhắc tên khách, ngày, giờ, địa điểm", () => {
    for (const t of allTemplates) {
      const slots = new Set(templateSlots(t.text));
      for (const required of ["tenKhach", "ngay", "gio", "diaDiem"]) {
        expect(slots.has(required), `${t.id} thiếu {${required}}`).toBe(true);
      }
    }
  });
});

import { describe, expect, it } from "vitest";
import { announceLine, envelopeLine, inviteLine } from "./invitation-wording";

describe("announceLine", () => {
  it.each([
    ["nha-gai", "Trân trọng báo tin Lễ Vu Quy của hai con chúng tôi"],
    ["nha-trai", "Trân trọng báo tin Lễ Tân Hôn của hai con chúng tôi"],
    ["bao-hy", "Trân trọng báo tin Lễ Thành Hôn của chúng tôi"],
  ] as const)("%s", (kind, expected) => {
    expect(announceLine(kind)).toBe(expected);
  });
});

describe("inviteLine", () => {
  const guest = { honorific: "Cô Chú", name: "Năm Hoà", companion: "& Gia đình" } as const;

  it.each([
    ["nha-gai", "Trân trọng kính mời: Anh Minh tới dự Lễ Vu Quy của hai con chúng tôi"],
    ["nha-trai", "Trân trọng kính mời: Anh Minh tới dự Lễ Thành Hôn của hai con chúng tôi"],
    ["bao-hy", "Trân trọng kính mời: Anh Minh tới dự Lễ Thành Hôn của chúng tôi"],
  ] as const)("câu đầy đủ %s", (kind, expected) => {
    const { invite, attend } = inviteLine({ honorific: "Anh", name: "Minh" }, kind);
    expect(`${invite} ${attend}`).toBe(expected);
  });

  it("có người đi cùng: gắn vào cuối dòng mời", () => {
    expect(inviteLine(guest, "nha-gai")).toEqual({
      invite: "Trân trọng kính mời: Cô Chú Năm Hoà & Gia đình",
      attend: "tới dự Lễ Vu Quy của hai con chúng tôi",
    });
  });

  it("không có người đi cùng", () => {
    expect(inviteLine({ honorific: "Anh", name: "Minh" }, "nha-trai").invite).toBe(
      "Trân trọng kính mời: Anh Minh",
    );
  });

  it("báo hỷ: dòng tới dự nói 'của chúng tôi'", () => {
    expect(inviteLine({ honorific: "Bạn", name: "Thu Hà" }, "bao-hy")).toEqual({
      invite: "Trân trọng kính mời: Bạn Thu Hà",
      attend: "tới dự Lễ Thành Hôn của chúng tôi",
    });
  });

  it("danh xưng rỗng: không có khoảng trắng đôi", () => {
    const { invite } = inviteLine(
      { honorific: "", name: "Minh Anh", companion: "& Người thương" },
      "nha-gai",
    );
    expect(invite).toBe("Trân trọng kính mời: Minh Anh & Người thương");
    expect(invite).not.toContain("  ");
  });
});

describe("envelopeLine", () => {
  it("không in người đi cùng", () => {
    expect(envelopeLine({ honorific: "Cô Chú", name: "Năm Hoà" })).toBe("Kính gửi: Cô Chú Năm Hoà");
  });

  it("danh xưng rỗng thì bỏ qua", () => {
    expect(envelopeLine({ honorific: "", name: "Minh Anh" })).toBe("Kính gửi: Minh Anh");
  });
});

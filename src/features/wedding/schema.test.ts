import { describe, expect, it } from "vitest";
import { createWeddingSchema } from "./schema";

const valid = { brideName: "Minh Anh", groomName: "Hoàng Nam" };

function fieldErrors(input: unknown) {
  const r = createWeddingSchema.safeParse(input);
  if (r.success) throw new Error("Mong đợi lỗi nhưng parse thành công");
  return r.error.issues.map((i) => ({ path: i.path[0], message: i.message }));
}

describe("createWeddingSchema", () => {
  it("tên cô dâu rỗng bị từ chối với thông báo 'Nhập tên cô dâu'", () => {
    expect(fieldErrors({ ...valid, brideName: "" })).toContainEqual({
      path: "brideName",
      message: "Nhập tên cô dâu",
    });
  });

  it("tên chú rể chỉ toàn dấu cách bị từ chối với thông báo 'Nhập tên chú rể'", () => {
    expect(fieldErrors({ ...valid, groomName: "   " })).toContainEqual({
      path: "groomName",
      message: "Nhập tên chú rể",
    });
  });

  it("tên 61 ký tự bị từ chối, 60 ký tự thì hợp lệ", () => {
    expect(fieldErrors({ ...valid, brideName: "a".repeat(61) }).map((e) => e.path)).toContain(
      "brideName",
    );
    expect(createWeddingSchema.safeParse({ ...valid, brideName: "a".repeat(60) }).success).toBe(
      true,
    );
  });

  it("tên được cắt khoảng trắng hai đầu", () => {
    const r = createWeddingSchema.parse({ brideName: "  Minh Anh ", groomName: " Hoàng Nam  " });
    expect(r.brideName).toBe("Minh Anh");
    expect(r.groomName).toBe("Hoàng Nam");
  });

  it("ngày cưới để trống hoặc không gửi thì là null", () => {
    expect(createWeddingSchema.parse({ ...valid, weddingDate: "" }).weddingDate).toBeNull();
    expect(createWeddingSchema.parse(valid).weddingDate).toBeNull();
  });

  it("ngày không tồn tại hoặc sai định dạng bị từ chối ở trường weddingDate", () => {
    for (const bad of ["2026-13-40", "20/12/2026"]) {
      expect(fieldErrors({ ...valid, weddingDate: bad }).map((e) => e.path)).toContain(
        "weddingDate",
      );
    }
  });

  it("ngày cưới tính theo giờ Việt Nam: 2026-12-20 là 17:00 UTC hôm trước", () => {
    const { weddingDate } = createWeddingSchema.parse({ ...valid, weddingDate: "2026-12-20" });
    expect(weddingDate).toBeInstanceOf(Date);
    expect(weddingDate?.toISOString()).toBe("2026-12-19T17:00:00.000Z");
  });
});

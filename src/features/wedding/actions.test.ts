import { beforeEach, describe, expect, it, vi } from "vitest";
import { Prisma } from "@/generated/prisma/client";

vi.mock("server-only", () => ({}));

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  requireUser: vi.fn(),
  getMyWedding: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock("@/lib/db", () => ({ db: { wedding: { create: mocks.create } } }));
vi.mock("@/lib/session", () => ({ requireUser: mocks.requireUser }));
vi.mock("@/lib/wedding-access", () => ({ getMyWedding: mocks.getMyWedding }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));

import { createWedding } from "./actions";

const USER_ID = "user-phien-1";

function form(fields: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.append(k, v);
  return fd;
}

const goodForm = () =>
  form({ brideName: "  Minh Anh ", groomName: "Hoàng Nam  ", weddingDate: "2026-12-20" });

function prismaError(code: string) {
  return new Prisma.PrismaClientKnownRequestError("Unique", { code, clientVersion: "test" });
}

/** Lấy url từ lỗi redirect giả (redirect thật NÉM lỗi). */
async function redirectUrl(p: Promise<unknown>) {
  try {
    await p;
  } catch (e) {
    return (e as { url?: string }).url;
  }
  return undefined;
}

beforeEach(() => {
  vi.resetAllMocks();
  mocks.requireUser.mockResolvedValue({ id: USER_ID });
  mocks.getMyWedding.mockResolvedValue({ wedding: null });
  mocks.create.mockResolvedValue({});
  mocks.redirect.mockImplementation((url: string) => {
    throw Object.assign(new Error("NEXT_REDIRECT"), { url });
  });
});

describe("createWedding", () => {
  it("chưa đăng nhập thì ném lỗi và không đụng tới DB", async () => {
    mocks.requireUser.mockRejectedValue(
      Object.assign(new Error("NEXT_REDIRECT"), { url: "/dang-nhap" }),
    );
    expect(await redirectUrl(createWedding(undefined, goodForm()))).toBe("/dang-nhap");
    expect(mocks.getMyWedding).not.toHaveBeenCalled();
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("đã có đám cưới thì chuyển về /dashboard và không tạo thêm", async () => {
    mocks.getMyWedding.mockResolvedValue({ wedding: { id: "w1" } });
    expect(await redirectUrl(createWedding(undefined, goodForm()))).toBe("/dashboard");
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it("dữ liệu sai (tên rỗng) thì trả lỗi theo trường và không tạo", async () => {
    const r = await createWedding(
      undefined,
      form({ brideName: "", groomName: "Hoàng Nam", weddingDate: "" }),
    );
    expect(r?.errors?.brideName).toEqual(["Nhập tên cô dâu"]);
    expect(mocks.create).not.toHaveBeenCalled();
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it("thành công: tạo 1 lần với slug, tên đã trim, ngày, chủ sở hữu từ phiên rồi về /dashboard", async () => {
    expect(await redirectUrl(createWedding(undefined, goodForm()))).toBe("/dashboard");
    expect(mocks.create).toHaveBeenCalledTimes(1);
    const { data } = mocks.create.mock.calls[0]![0] as { data: Record<string, unknown> };
    expect(data.slug).toBe("minhanh-hoangnam");
    expect(data.themeSlug).toBe("placeholder");
    expect(data.brideName).toBe("Minh Anh");
    expect(data.groomName).toBe("Hoàng Nam");
    expect((data.weddingDate as Date).toISOString()).toBe("2026-12-19T17:00:00.000Z");
    expect(data.members).toEqual({ create: { userId: USER_ID, role: "OWNER" } });
  });

  it("không có ngày cưới thì lưu weddingDate là null", async () => {
    await redirectUrl(
      createWedding(undefined, form({ brideName: "Minh Anh", groomName: "Hoàng Nam" })),
    );
    const { data } = mocks.create.mock.calls[0]![0] as { data: Record<string, unknown> };
    expect(data.weddingDate).toBeNull();
  });

  it("form gửi lén userId/role/themeSlug thì bị bỏ qua (chống mass-assignment)", async () => {
    const fd = goodForm();
    fd.append("userId", "ke-tan-cong");
    fd.append("role", "ADMIN");
    fd.append("themeSlug", "mau-khac");
    await redirectUrl(createWedding(undefined, fd));
    const { data } = mocks.create.mock.calls[0]![0] as { data: Record<string, unknown> };
    expect(data.themeSlug).toBe("placeholder");
    expect(data.members).toEqual({ create: { userId: USER_ID, role: "OWNER" } });
  });

  it("slug bị trùng (P2002) thì thử lại với đuôi ngẫu nhiên", async () => {
    mocks.create.mockRejectedValueOnce(prismaError("P2002"));
    expect(await redirectUrl(createWedding(undefined, goodForm()))).toBe("/dashboard");
    expect(mocks.create).toHaveBeenCalledTimes(2);
    const first = mocks.create.mock.calls[0]![0] as { data: { slug: string } };
    const second = mocks.create.mock.calls[1]![0] as { data: { slug: string } };
    expect(first.data.slug).toBe("minhanh-hoangnam");
    expect(second.data.slug).toMatch(/^minhanh-hoangnam-[a-z0-9]{1,4}$/);
  });

  it("trùng slug cả 5 lần thì báo lỗi, không chuyển trang", async () => {
    mocks.create.mockRejectedValue(prismaError("P2002"));
    const r = await createWedding(undefined, goodForm());
    expect(r?.message).toBeTruthy();
    expect(mocks.create).toHaveBeenCalledTimes(5);
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it("lỗi DB khác thì ném tiếp và không thử lại", async () => {
    mocks.create.mockRejectedValue(new Error("DB sập"));
    await expect(createWedding(undefined, goodForm())).rejects.toThrow("DB sập");
    expect(mocks.create).toHaveBeenCalledTimes(1);
  });

  it("lỗi Prisma không phải P2002 (P2025) thì ném tiếp và không thử lại", async () => {
    const err = prismaError("P2025");
    mocks.create.mockRejectedValue(err);
    await expect(createWedding(undefined, goodForm())).rejects.toBe(err);
    expect(mocks.create).toHaveBeenCalledTimes(1);
  });
});

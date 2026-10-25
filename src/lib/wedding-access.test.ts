import { redirect } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";

// "server-only" chỉ có nghĩa trong bundler của Next → trong Vitest thay bằng module rỗng
vi.mock("server-only", () => ({}));

const mocks = vi.hoisted(() => ({
  findUnique: vi.fn(),
  findFirst: vi.fn(),
  requireUser: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  db: { weddingMember: { findUnique: mocks.findUnique, findFirst: mocks.findFirst } },
}));
vi.mock("@/lib/session", () => ({ requireUser: mocks.requireUser }));

import { getMyWedding, requireWeddingAccess } from "./wedding-access";

const userA = { id: "user-a", email: "a@example.com" };
const userB = { id: "user-b", email: "b@example.com" };

/** Chạy fn, bắt lỗi ném ra, trả về digest + message (hoặc báo nếu không ném). */
async function bat(fn: () => Promise<unknown>) {
  try {
    await fn();
  } catch (e) {
    const err = e as { digest?: string; message?: string };
    return { digest: String(err.digest ?? ""), message: String(err.message ?? "") };
  }
  throw new Error("Mong đợi hàm ném lỗi nhưng nó không ném");
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.findUnique.mockReset();
  mocks.findFirst.mockReset();
  mocks.requireUser.mockReset();
  mocks.requireUser.mockResolvedValue(userA);
});

describe("requireWeddingAccess", () => {
  it("không phải thành viên thì trả 404 và lỗi không lộ weddingId", async () => {
    mocks.findUnique.mockResolvedValue(null);
    const loi = await bat(() => requireWeddingAccess("wedding-bi-mat-123"));
    expect(loi.digest).toMatch(/^NEXT_HTTP_ERROR_FALLBACK;404/);
    expect(loi.message).not.toContain("wedding-bi-mat-123");
    expect(loi.digest).not.toContain("wedding-bi-mat-123");
  });

  it("wedding của người khác và wedding không tồn tại cho lỗi y hệt nhau, chủ thật vẫn vào được", async () => {
    // "DB" giả trả bản ghi CHỈ khi đúng cặp (weddingId, userId) → mock phụ thuộc where, không trả cứng.
    // Nếu code tra sai khoá (vd. chỉ theo weddingId) thì A sẽ lọt vào wedding của B và test này fail.
    mocks.findUnique.mockImplementation(
      async ({ where }: { where: { weddingId_userId: { weddingId: string; userId: string } } }) =>
        where.weddingId_userId.weddingId === "w-cua-B" && where.weddingId_userId.userId === userB.id
          ? { role: "OWNER" }
          : null,
    );
    const cuaNguoiKhac = await bat(() => requireWeddingAccess("w-cua-B"));
    const khongTonTai = await bat(() => requireWeddingAccess("w-khong-co"));
    expect(cuaNguoiKhac.digest).toMatch(/^NEXT_HTTP_ERROR_FALLBACK;404/);
    expect(cuaNguoiKhac.digest).toBe(khongTonTai.digest);
    expect(cuaNguoiKhac.message).toBe(khongTonTai.message);

    mocks.requireUser.mockResolvedValue(userB);
    await expect(requireWeddingAccess("w-cua-B")).resolves.toMatchObject({ role: "OWNER" });
  });

  it("EDITOR đòi quyền OWNER thì bị 404", async () => {
    mocks.findUnique.mockResolvedValue({ role: "EDITOR" });
    const loi = await bat(() => requireWeddingAccess("w1", "OWNER"));
    expect(loi.digest).toMatch(/^NEXT_HTTP_ERROR_FALLBACK;404/);
  });

  it("OWNER đòi quyền OWNER thì được vào, trả user và role OWNER", async () => {
    mocks.findUnique.mockResolvedValue({ role: "OWNER" });
    await expect(requireWeddingAccess("w1", "OWNER")).resolves.toEqual({
      user: userA,
      role: "OWNER",
    });
  });

  it("EDITOR gọi mặc định thì được vào với role EDITOR", async () => {
    mocks.findUnique.mockResolvedValue({ role: "EDITOR" });
    await expect(requireWeddingAccess("w1")).resolves.toEqual({ user: userA, role: "EDITOR" });
  });

  it("OWNER gọi mặc định (EDITOR) vẫn được vào", async () => {
    mocks.findUnique.mockResolvedValue({ role: "OWNER" });
    await expect(requireWeddingAccess("w1")).resolves.toMatchObject({ role: "OWNER" });
  });

  it("tra quyền bằng userId của phiên và chỉ select role", async () => {
    mocks.findUnique.mockResolvedValue({ role: "OWNER" });
    await requireWeddingAccess("w1");
    expect(mocks.findUnique).toHaveBeenCalledWith({
      where: { weddingId_userId: { weddingId: "w1", userId: userA.id } },
      select: { role: true },
    });
  });

  it("userId trong query đổi theo phiên, không theo input", async () => {
    mocks.findUnique.mockResolvedValue({ role: "OWNER" });
    await requireWeddingAccess("w1");
    mocks.requireUser.mockResolvedValue(userB);
    await requireWeddingAccess("w1");
    expect(mocks.findUnique).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        where: { weddingId_userId: { weddingId: "w1", userId: userA.id } },
      }),
    );
    expect(mocks.findUnique).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        where: { weddingId_userId: { weddingId: "w1", userId: userB.id } },
      }),
    );
  });

  it("truyền lén userId người khác làm tham số thừa → vẫn tra bằng userId của phiên", async () => {
    mocks.findUnique.mockResolvedValue({ role: "OWNER" });
    // Ép kiểu để gọi được với tham số thứ 3: nếu sau này ai thêm `userId ?? user.id` thì test này bắt
    const goiLen = requireWeddingAccess as (...args: unknown[]) => Promise<unknown>;
    await goiLen("w1", "EDITOR", userB.id);
    expect(mocks.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { weddingId_userId: { weddingId: "w1", userId: userA.id } },
      }),
    );
  });

  it("chưa đăng nhập thì chuyển về /dang-nhap và không chạm DB", async () => {
    mocks.requireUser.mockImplementation(async () => redirect("/dang-nhap"));
    const loi = await bat(() => requireWeddingAccess("w1"));
    expect(loi.digest).toMatch(/^NEXT_REDIRECT/);
    expect(loi.digest).toContain("/dang-nhap");
    expect(mocks.findUnique).not.toHaveBeenCalled();
    expect(mocks.findFirst).not.toHaveBeenCalled();
  });
});

describe("getMyWedding", () => {
  it("chưa có đám cưới thì trả role null và wedding null", async () => {
    mocks.findFirst.mockResolvedValue(null);
    await expect(getMyWedding()).resolves.toEqual({ user: userA, role: null, wedding: null });
  });

  it("có đám cưới thì trả wedding và role lấy từ bản ghi thành viên", async () => {
    const wedding = { id: "w1", slug: "an-binh" };
    mocks.findFirst.mockResolvedValue({ role: "OWNER", wedding });
    await expect(getMyWedding()).resolves.toEqual({ user: userA, role: "OWNER", wedding });
  });

  // DB là mock nên chỉ kiểm được câu hỏi gửi xuống (orderBy asc = cái tạo sớm nhất), không kiểm DB sắp xếp thật
  it("chỉ tìm đám cưới của user trong phiên, truyền orderBy createdAt asc", async () => {
    mocks.findFirst.mockResolvedValue(null);
    await getMyWedding();
    expect(mocks.findFirst).toHaveBeenCalledWith({
      where: { userId: userA.id },
      orderBy: { createdAt: "asc" },
      select: { role: true, wedding: true },
    });
  });

  it("chưa đăng nhập thì chuyển về /dang-nhap và không chạm DB", async () => {
    mocks.requireUser.mockImplementation(async () => redirect("/dang-nhap"));
    const loi = await bat(() => getMyWedding());
    expect(loi.digest).toMatch(/^NEXT_REDIRECT/);
    expect(loi.digest).toContain("/dang-nhap");
    expect(mocks.findFirst).not.toHaveBeenCalled();
    expect(mocks.findUnique).not.toHaveBeenCalled();
  });
});

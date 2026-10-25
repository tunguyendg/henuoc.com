import "server-only";
import { notFound } from "next/navigation";
import { cache } from "react";
import { db } from "@/lib/db";
import type { MemberRole } from "@/generated/prisma/enums";
import { requireUser } from "@/lib/session";

/**
 * Cổng DUY NHẤT để đọc/ghi dữ liệu của 1 đám cưới. Mọi repo dashboard phải gọi hàm này trước.
 * Không phải thành viên → 404 (không phải 403): 403 = "có tồn tại nhưng mày không được xem",
 * tức là vẫn lộ thông tin. 404 thì kẻ dò id không biết id đó có thật hay không.
 */
export const requireWeddingAccess = cache(
  async (weddingId: string, need: "EDITOR" | "OWNER" = "EDITOR") => {
    const user = await requireUser();
    const member = await db.weddingMember.findUnique({
      where: { weddingId_userId: { weddingId, userId: user.id } }, // tra bằng khoá chính ghép
      select: { role: true },
    });
    if (!member) notFound();
    if (need === "OWNER" && member.role !== "OWNER") notFound(); // vd: xoá thiệp, mời thêm người
    return { user, role: member.role as MemberRole };
  },
);

/** MVP: mỗi user có 1 đám cưới → dashboard lấy đám cưới đầu tiên của mình. Chưa có → null (đi onboarding). */
export const getMyWedding = cache(async () => {
  const user = await requireUser();
  const m = await db.weddingMember.findFirst({
    where: { userId: user.id }, // chạy nhanh nhờ index wedding_member_userId_idx
    orderBy: { createdAt: "asc" },
    select: { role: true, wedding: true },
  });
  return { user, role: m?.role ?? null, wedding: m?.wedding ?? null };
});

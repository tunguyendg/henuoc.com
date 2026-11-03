import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "@/lib/auth";
import { connection } from "next/server";

// connection(): báo Next phần này chỉ chạy lúc có request, KHÔNG prerender
// (Better Auth dùng crypto ngẫu nhiên khi đọc phiên → không được dựng sẵn)
export const getSession = cache(async () => {
  await connection();
  return auth.api.getSession({ headers: await headers() });
});

/** Lớp kiểm THẬT: đối chiếu cookie với bảng session trong DB. Chưa đăng nhập → về /dang-nhap. */
export async function requireUser() {
  const session = await getSession();
  if (!session) redirect("/dang-nhap");
  return session.user;
}

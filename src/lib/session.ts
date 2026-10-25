import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "@/lib/auth";

// cache(): trong 1 request, layout + page + component gọi bao nhiêu lần cũng chỉ hỏi DB 1 lần
export const getSession = cache(async () => auth.api.getSession({ headers: await headers() }));

/** Lớp kiểm THẬT: đối chiếu cookie với bảng session trong DB. Chưa đăng nhập → về /dang-nhap. */
export async function requireUser() {
  const session = await getSession();
  if (!session) redirect("/dang-nhap");
  return session.user;
}

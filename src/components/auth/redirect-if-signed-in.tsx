import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

// Đọc cookie = dữ liệu lúc request → phải nằm trong <Suspense> (giống require-login.tsx).
export async function RedirectIfSignedIn() {
  const session = await getSession();
  if (session) redirect("/dashboard");
  return null;
}

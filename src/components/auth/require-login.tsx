import { requireUser } from "@/lib/session";

// Đọc cookie = dữ liệu lúc request → phải nằm trong <Suspense> (Cache Components),
// nhờ vậy phần khung tĩnh của dashboard vẫn được prerender.
export async function RequireLogin() {
  await requireUser();
  return null;
}

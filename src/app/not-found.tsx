import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-5 py-24 text-center">
      <p className="font-display text-7xl font-extrabold tracking-[-0.03em] text-rose-500">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-ink">Không tìm thấy trang</h1>
      <p className="mt-2 text-muted">Đường dẫn có thể đã thay đổi hoặc không còn tồn tại.</p>
      <Link href="/" className={buttonVariants({ className: "mt-8" })}>
        Về trang chủ
      </Link>
    </main>
  );
}

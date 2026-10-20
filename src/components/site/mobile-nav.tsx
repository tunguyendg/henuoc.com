"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { mainNav } from "@/lib/site";

/**
 * Lưu ý: header cha có backdrop-blur → mọi con `position: fixed` bị tính theo header chứ không theo
 * màn hình (quy tắc CSS về containing block). Vì vậy panel dùng `absolute top-full` + chiều cao 100dvh − header.
 *
 * Client Component đầu tiên của dự án: cần useState để nhớ menu đang mở hay đóng.
 * Chỉ file này (và những gì nó import) được gửi JS xuống trình duyệt.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  // Khoá cuộn trang khi menu mở; Esc để đóng.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Đóng menu" : "Mở menu"}
        className="inline-flex size-11 items-center justify-center rounded-(--radius-btn) text-ink hover:bg-rose-50"
      >
        {open ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>

      {open ? (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full z-40 h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border bg-canvas px-5 pt-6 pb-10"
        >
          <nav aria-label="Menu di động">
            <ul className="flex flex-col">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    className="block border-b border-border py-4 text-lg font-medium text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/tao-thiep"
              onClick={close}
              className={buttonVariants({ size: "lg", className: "w-full" })}
            >
              Tạo thiệp miễn phí
            </Link>
            <Link
              href="/dang-nhap"
              onClick={close}
              className={buttonVariants({ variant: "secondary", size: "lg", className: "w-full" })}
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { mainNav } from "@/lib/site";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";

/**
 * Header là Server Component (không có "use client").
 * Chỉ phần menu mobile cần state mở/đóng → tách ra MobileNav (Client Component).
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-canvas/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-6 md:h-18">
        <Logo />

        <nav aria-label="Menu chính" className="hidden md:block">
          <ul className="flex items-center gap-8 text-[15px] font-medium text-ink">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-rose-600">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/dang-nhap" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            Đăng nhập
          </Link>
          <Link href="/tao-thiep" className={buttonVariants({ size: "sm" })}>
            Tạo thiệp miễn phí
          </Link>
        </div>

        <MobileNav />
      </Container>
    </header>
  );
}

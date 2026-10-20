import type { Metadata } from "next";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

// Chưa launch → chưa cho Google index toàn bộ nhóm trang marketing. Bỏ dòng này khi ra mắt.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Layout của route group (marketing): bọc mọi trang trong thư mục này bằng Header + Footer.
 * Dashboard sau này có layout riêng (sidebar) mà URL không bị dính chữ "marketing".
 */
export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}

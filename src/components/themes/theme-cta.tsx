import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import type { Theme } from "@/data/themes";

const HELPER_ID = "theme-cta-helper";

/**
 * Nút hành động ở trang chi tiết mẫu. `children` là các nút phụ (vd. "Xem mẫu khác") đặt cuối hàng.
 * Mobile xếp dọc, từ `sm` xếp ngang và được xuống dòng.
 */
export function ThemeCta({ theme, children }: { theme: Theme; children?: ReactNode }) {
  const live = theme.status === "live";
  // Cùng điều kiện với guard của dashboard: luồng tạo thiệp thật nằm ở dashboard, mà dashboard trả
  // 404 ở production; /tao-thiep cũng mới là trang "đang xây dựng". Không dẫn khách vào trang chết.
  const createLocked = process.env.NODE_ENV === "production";

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {live ? (
          <>
            <Link href={`/demo/${theme.slug}`} className={buttonVariants({ size: "lg" })}>
              Xem thiệp thực tế <ArrowRight aria-hidden />
            </Link>
            {createLocked ? (
              <Button size="lg" variant="secondary" disabled aria-describedby={HELPER_ID}>
                Sắp mở tạo thiệp
              </Button>
            ) : (
              <Link
                href={`/tao-thiep?mau=${theme.slug}`}
                className={buttonVariants({ variant: "secondary", size: "lg" })}
              >
                Dùng mẫu này
              </Link>
            )}
          </>
        ) : (
          <Button size="lg" disabled>
            Sắp ra mắt
          </Button>
        )}
        {children}
      </div>
      {live && createLocked && (
        <p id={HELPER_ID} className="mt-3 text-sm text-muted">
          Hẹn Ước đang hoàn thiện phần tạo thiệp, hai bạn xem trước mẫu này nhé.
        </p>
      )}
    </div>
  );
}

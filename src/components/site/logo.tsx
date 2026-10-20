import Link from "next/link";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

/**
 * Biểu tượng Hẹn Ước — "Nhẫn Tim": nhẫn cưới đội trái tim vàng (ADR-003).
 * Nhìn là biết đám cưới; nhẫn = lời hẹn ước.
 * - `ringClassName` đổi màu vành nhẫn qua `currentColor` (trắng trên ô hồng, hồng trên nền sáng).
 * - Trái tim luôn là Vàng Nhẫn #F6C76B — màu nhận diện, không đổi theo nền.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className={className} fill="none">
      <circle cx="32" cy="41" r="14.5" stroke="currentColor" strokeWidth={5.5} />
      <path
        d="M32 30 C21 23 19 17 21.8 13 C24.6 9.2 29.8 10.2 32 14.4 C34.2 10.2 39.4 9.2 42.2 13 C45 17 43 23 32 30Z"
        fill="#F6C76B"
      />
    </svg>
  );
}

/** Ô vuông hồng chứa nhẫn — giống favicon/app icon để mọi nơi chỉ có MỘT hình. */
export function LogoTile({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-[11px] bg-rose-500 text-white",
        className,
      )}
    >
      <LogoMark className="size-[78%]" />
    </span>
  );
}

/** Logo ngang: ô nhẫn + chữ "Hẹn Ước" (chữ HTML để dấu tiếng Việt luôn sắc nét). */
export function Logo({ className, inverted }: { className?: string; inverted?: boolean }) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — Trang chủ`}
      className={cn(
        "inline-flex items-center gap-2.5",
        inverted ? "text-white" : "text-ink",
        className,
      )}
    >
      <LogoTile />
      <span className="text-[1.55rem] leading-none font-extrabold tracking-[-0.035em]">
        {site.name}
      </span>
    </Link>
  );
}

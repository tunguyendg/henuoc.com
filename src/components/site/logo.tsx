import Link from "next/link";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

/**
 * Biểu tượng Hẹn Ước: chữ "Ư" — nét riêng của tiếng Việt, có trong chữ "Hẹn Ước" —
 * với dấu râu là một trái tim nhỏ. Vẽ bằng SVG inline + currentColor nên đổi màu theo
 * class `text-*` của thẻ cha (dùng được trên nền sáng lẫn nền màu).
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className={className} fill="none">
      <g
        transform="translate(32 32) translate(-37 -32.5)"
        stroke="currentColor"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 16 V36 C16 46 22.5 52 30 52 C37.5 52 44 46 44 36 V25" />
        <path
          d="M53 22.5 C47 18.8 45.6 15 47.6 12.6 C49.6 10.4 52.2 11.2 53 13.4 C53.8 11.2 56.4 10.4 58.4 12.6 C60.4 15 59 18.8 53 22.5Z"
          fill="currentColor"
          stroke="none"
        />
      </g>
    </svg>
  );
}

/** Logo ngang: biểu tượng + chữ "Hẹn Ước" (chữ HTML để dấu tiếng Việt luôn sắc nét). */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — Trang chủ`}
      className={cn("inline-flex items-center gap-2.5 text-rose-500", className)}
    >
      {/* Ô vuông bo góc giống favicon → logo trên web và icon trên tab trình duyệt đồng bộ */}
      <span className="flex size-9 items-center justify-center rounded-[10px] bg-rose-500 text-white">
        <LogoMark className="size-7" />
      </span>
      <span className="font-display text-[1.6rem] leading-none font-semibold">{site.name}</span>
    </Link>
  );
}

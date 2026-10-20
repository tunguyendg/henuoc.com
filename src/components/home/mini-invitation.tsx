import { cn } from "@/lib/utils";

/**
 * Cỡ chữ dùng đơn vị cqw (% chiều rộng khung chứa, nhờ class @container) → thiệp tự co giãn
 * đúng tỉ lệ dù nằm trong điện thoại lớn hay thẻ nhỏ của gallery.
 *
 * Thiệp minh hoạ cho trang chủ (chưa phải theme thật — theme thật làm ở M1).
 * Mỗi "style" là một bộ màu + bố cục chữ khác nhau để thấy được sự đa dạng.
 */
export const miniStyles = {
  pastel: {
    label: "Hồng Pastel",
    category: "Hoa lá",
    bg: "bg-[#fbeef0]",
    ink: "text-[#8a3d52]",
    sub: "text-[#b07686]",
    frame: "border-[#e8b9c3]",
    names: "font-display italic",
  },
  songhy: {
    label: "Song Hỷ",
    category: "Truyền thống",
    bg: "bg-[#8e1b24]",
    ink: "text-[#f3d28b]",
    sub: "text-[#e9b96e]",
    frame: "border-[#d4a24c]",
    names: "font-display",
  },
  bantin: {
    label: "Bản Tin",
    category: "Tối giản",
    bg: "bg-[#f4efe6]",
    ink: "text-[#1d1d1f]",
    sub: "text-[#6d6a63]",
    frame: "border-[#1d1d1f]/20",
    names: "font-sans font-bold uppercase tracking-[0.14em] text-[length:8.5cqw]",
  },
  sage: {
    label: "Xanh Sage",
    category: "Hiện đại",
    bg: "bg-[#e7ede4]",
    ink: "text-[#3e5641]",
    sub: "text-[#728a74]",
    frame: "border-[#a9bba8]",
    names: "font-display",
  },
  hanquoc: {
    label: "Seoul",
    category: "Hàn Quốc",
    bg: "bg-white",
    ink: "text-[#4a4a4a]",
    sub: "text-[#9b9b9b]",
    frame: "border-[#e6e6e6]",
    names: "font-sans font-light tracking-[0.08em]",
  },
  vintage: {
    label: "Hoài Niệm",
    category: "Vintage",
    bg: "bg-[#efe3cf]",
    ink: "text-[#5a3e2b]",
    sub: "text-[#8c6c52]",
    frame: "border-[#b89474]",
    names: "font-display italic",
  },
} as const;

export type MiniStyle = keyof typeof miniStyles;

export interface MiniInvitationProps {
  style: MiniStyle;
  bride?: string;
  groom?: string;
  date?: string;
  salutation?: string;
  className?: string;
}

export function MiniInvitation({
  style,
  bride = "Minh Anh",
  groom = "Hoàng Nam",
  date = "20 · 12 · 2026",
  salutation,
  className,
}: MiniInvitationProps) {
  const s = miniStyles[style];
  return (
    // Lớp ngoài CHỈ khai báo @container; cqw ở các lớp con mới tính theo chiều rộng lớp này.
    <div className={cn("@container h-full w-full", className)}>
      <div className={cn("flex h-full w-full p-[6cqw]", s.bg)}>
        <div
          className={cn(
            "flex h-full w-full flex-col items-center justify-center rounded-[6cqw] border px-[5cqw] text-center",
            s.frame,
          )}
        >
          <p className={cn("text-[4cqw] font-medium tracking-[0.3em] uppercase", s.sub)}>
            Thiệp mời cưới
          </p>
          {salutation ? (
            <p className={cn("mt-[5cqw] text-[4.6cqw] leading-snug", s.sub)}>{salutation}</p>
          ) : null}
          <p className={cn("mt-[6cqw] text-[length:11cqw] leading-tight", s.ink, s.names)}>
            {bride}
          </p>
          <p className={cn("my-[1cqw] text-[5.5cqw]", s.sub)}>&amp;</p>
          <p className={cn("text-[length:11cqw] leading-tight", s.ink, s.names)}>{groom}</p>
          <div
            className={cn(
              "mt-[6cqw] h-px w-[16cqw]",
              s.bg === "bg-white" ? "bg-[#ddd]" : "bg-current",
              s.sub,
            )}
          />
          <p className={cn("mt-[5cqw] text-[4.8cqw] font-medium tracking-[0.2em]", s.ink)}>
            {date}
          </p>
          <p className={cn("mt-[1.5cqw] text-[3.8cqw]", s.sub)}>
            Nhằm ngày 01 tháng 11 năm Bính Ngọ
          </p>
        </div>
      </div>
    </div>
  );
}

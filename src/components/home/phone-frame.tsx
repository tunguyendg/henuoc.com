import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Khung điện thoại vẽ bằng CSS — không cần ảnh mockup. */
export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative aspect-[9/19] w-[260px] rounded-[2.6rem] border-[10px] border-ink bg-ink shadow-[0_30px_60px_-20px_rgb(36_37_42/0.35)]",
        className,
      )}
    >
      <div className="absolute top-2 left-1/2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-ink" />
      <div className="h-full w-full overflow-hidden rounded-[2rem] bg-surface">{children}</div>
    </div>
  );
}

import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

export interface WatermarkProps {
  /** content.showWatermark (Free plan). */
  show: boolean;
  className?: string;
}

/** Server Component. Free-plan credit line, placed in the thanks section (docs/07 §10). */
export function Watermark({ show, className }: WatermarkProps) {
  if (!show) return null;
  return (
    <p className={cn("text-center text-xs text-muted", className)}>
      Thiệp tạo bằng{" "}
      <a
        href={site.url}
        target="_blank"
        rel="noopener"
        className="inline-flex min-h-11 items-center font-semibold text-rose-700 underline-offset-2 hover:underline"
      >
        {site.name} · {site.domain}
      </a>
    </p>
  );
}

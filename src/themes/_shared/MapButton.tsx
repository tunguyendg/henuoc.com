import { MapPin } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { isAllowedMapUrl } from "@/lib/url-allowlist";

export interface MapButtonProps {
  url?: string;
  label?: string;
  className?: string;
  icon?: ReactNode;
}

/** Server Component: a plain link, no JS. Renders nothing unless the URL passes the allowlist. */
export function MapButton({ url, label = "Chỉ đường", className, icon }: MapButtonProps) {
  if (!url || !isAllowedMapUrl(url)) return null;
  return (
    <a
      href={new URL(url).href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-(--radius-btn) border border-border bg-surface px-4 text-sm font-semibold text-ink transition-colors duration-200 hover:border-rose-500 hover:text-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 [&_svg]:size-4 [&_svg]:shrink-0",
        className,
      )}
    >
      {icon ?? <MapPin aria-hidden="true" />}
      {label}
    </a>
  );
}

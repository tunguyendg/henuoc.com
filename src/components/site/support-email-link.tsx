import { site, supportMailto } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The support email as visible, copyable text that is also a `mailto:` link.
 * Plain <a> (not next/link): mailto is not an app route. Server Component, no JS shipped.
 */
export function SupportEmailLink({ subject, className }: { subject?: string; className?: string }) {
  return (
    <a
      href={supportMailto(subject)}
      className={cn(
        "font-medium break-all text-rose-700 underline underline-offset-4 hover:text-rose-600",
        className,
      )}
    >
      {site.supportEmail}
    </a>
  );
}

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  children,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "mx-auto text-center", "max-w-2xl", className)}>
      {eyebrow ? (
        <p className="text-xs font-semibold tracking-[0.16em] text-rose-600 uppercase">{eyebrow}</p>
      ) : null}
      <h2 className="mt-3 font-display text-3xl leading-tight font-medium text-ink md:text-[2.6rem]">
        {title}
      </h2>
      {children ? <div className="mt-4 text-lg text-muted">{children}</div> : null}
    </div>
  );
}

/** Danh sách ý có dấu tick — dùng trong các section tính năng. */
export function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="mt-8 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-ink">
          <span
            aria-hidden
            className="mt-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-rose-50 text-xs font-bold text-rose-600"
          >
            ✓
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

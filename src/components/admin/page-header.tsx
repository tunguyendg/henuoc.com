import type { ReactNode } from "react";

export function AdminPageHeader({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <header className="mb-6">
      <h1 className="font-display text-2xl font-extrabold tracking-[-0.03em] md:text-3xl">
        {title}
      </h1>
      {children ? <p className="mt-1 text-muted">{children}</p> : null}
    </header>
  );
}

/** Wide tables scroll inside their own box so the page itself never scrolls sideways. */
export function TableFrame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      role="region"
      aria-label={label}
      tabIndex={0}
      className="max-w-full overflow-x-auto rounded-(--radius-card) border border-border bg-surface"
    >
      {children}
    </div>
  );
}

export const thClass =
  "px-4 py-3 text-left text-xs font-semibold tracking-wide text-muted uppercase";
export const tdClass = "px-4 py-3 align-top";

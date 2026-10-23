import type { ReactNode } from "react";

/** The one H1 of a dashboard page (same size on every page). */
export function PageTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-display text-[1.75rem] leading-tight font-extrabold tracking-[-0.03em] md:text-4xl">
      {children}
    </h1>
  );
}

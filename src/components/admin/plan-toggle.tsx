"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Plan } from "@/features/admin/types";
import { PlanBadge } from "./badges";
import { PREVIEW_NOT_SAVED } from "./labels";

/**
 * FAKE button: only flips the badge in this browser tab. No Server Action, no fetch — there is no
 * auth yet, so any write endpoint would be callable by anyone. Reload = back to the server value.
 */
export function PlanToggle({
  initialPlan,
  coupleNames,
}: {
  initialPlan: Plan;
  coupleNames: string;
}) {
  const [plan, setPlan] = useState(initialPlan);
  const [message, setMessage] = useState("");
  const next: Plan = plan === "PREMIUM" ? "FREE" : "PREMIUM";

  return (
    <div className="flex flex-col items-start gap-1.5">
      <PlanBadge plan={plan} />
      <Button
        size="sm"
        variant="secondary"
        aria-label={`${next === "PREMIUM" ? "Nâng lên Cao cấp" : "Hạ về Miễn phí"}: ${coupleNames}`}
        onClick={() => {
          setPlan(next);
          setMessage(PREVIEW_NOT_SAVED);
        }}
      >
        {next === "PREMIUM" ? "Nâng lên Cao cấp" : "Hạ về Miễn phí"}
      </Button>
      <p role="status" aria-live="polite" className="min-h-4 text-xs text-muted">
        {message}
      </p>
    </div>
  );
}

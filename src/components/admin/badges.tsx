import { Archive, Crown, FilePen, Globe, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Plan, WeddingStatus } from "@/features/admin/types";
import { planLabels, statusLabels } from "./labels";

// Text + icon, never colour alone (02-DESIGN_SYSTEM §2). No "use client": these render on the
// server and also inside client leaves (plain components work in both).

export function PlanBadge({ plan }: { plan: Plan }) {
  return plan === "PREMIUM" ? (
    <Badge tone="warning" icon={Crown}>
      {planLabels.PREMIUM}
    </Badge>
  ) : (
    <Badge icon={Sparkles}>{planLabels.FREE}</Badge>
  );
}

const statusTone = {
  DRAFT: { tone: "neutral", icon: FilePen },
  PUBLISHED: { tone: "success", icon: Globe },
  ARCHIVED: { tone: "neutral", icon: Archive },
} as const;

export function WeddingStatusBadge({ status }: { status: WeddingStatus }) {
  const s = statusTone[status];
  return (
    <Badge tone={s.tone} icon={s.icon}>
      {statusLabels[status]}
    </Badge>
  );
}

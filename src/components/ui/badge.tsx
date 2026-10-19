import { Check, Clock, Mail, X, type LucideIcon } from "lucide-react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const tones = {
  neutral: "bg-rose-50 text-rose-700",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
} as const;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: keyof typeof tones;
  icon?: LucideIcon;
}

export function Badge({ tone = "neutral", icon: Icon, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    >
      {Icon ? <Icon aria-hidden className="size-3.5" strokeWidth={2} /> : null}
      {children}
    </span>
  );
}

/** Trạng thái luôn có chữ + icon, không chỉ màu (02-DESIGN_SYSTEM §2). */
export const statusBadges = {
  attending: { tone: "success", icon: Check, label: "Sẽ đến" },
  declined: { tone: "danger", icon: X, label: "Không đến" },
  pending: { tone: "warning", icon: Clock, label: "Chưa phản hồi" },
  sent: { tone: "neutral", icon: Mail, label: "Đã gửi" },
} as const satisfies Record<string, { tone: BadgeProps["tone"]; icon: LucideIcon; label: string }>;

export function StatusBadge({ status }: { status: keyof typeof statusBadges }) {
  const s = statusBadges[status];
  return (
    <Badge tone={s.tone} icon={s.icon}>
      {s.label}
    </Badge>
  );
}

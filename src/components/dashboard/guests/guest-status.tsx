import { Ban, Check, Clock, Eye, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { DeliveryStatus } from "@/features/guest/types";

/**
 * Status chips for one guest. Always icon + text. "Đã đánh dấu gửi" is the couple's own tick
 * (AGENTS.md §4: never claim a message was sent just because a link was copied).
 */
export interface GuestStatusInput {
  revoked: boolean;
  delivery: DeliveryStatus;
  opened: boolean;
  hasRsvp: boolean;
}

export function GuestStatus({ guest }: { guest: GuestStatusInput }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {guest.revoked ? (
        <Badge tone="danger" icon={Ban}>
          Đã thu hồi
        </Badge>
      ) : null}
      {guest.delivery === "MARKED_SENT" ? (
        <Badge tone="neutral" icon={Mail}>
          Đã đánh dấu gửi
        </Badge>
      ) : (
        <Badge tone="neutral" icon={Clock}>
          Chưa gửi
        </Badge>
      )}
      {guest.opened ? (
        <Badge tone="neutral" icon={Eye}>
          Đã mở link
        </Badge>
      ) : null}
      {guest.hasRsvp ? (
        <Badge tone="success" icon={Check}>
          Đã phản hồi
        </Badge>
      ) : (
        <Badge tone="warning" icon={Clock}>
          Chưa phản hồi
        </Badge>
      )}
    </div>
  );
}

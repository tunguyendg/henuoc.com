"use client";

import { Copy, Link2 } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getInviteLinkAction } from "@/features/guest/actions";

type State = { kind: "idle" } | { kind: "ready"; url: string } | { kind: "error"; message: string };

// Client leaf: needs onClick, transition state and the clipboard. The link is fetched on demand,
// one guest at a time, so no link is ever rendered into the list's HTML.
export function InviteLinkButton({
  guestId,
  guestName,
  disabled,
}: {
  guestId: string;
  guestName: string;
  disabled?: boolean;
}) {
  const [state, setState] = useState<State>({ kind: "idle" });
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function create() {
    setNote("");
    startTransition(async () => {
      const result = await getInviteLinkAction(guestId);
      setState(
        result.ok
          ? { kind: "ready", url: `${window.location.origin}${result.link}` }
          : { kind: "error", message: result.error },
      );
    });
  }

  async function copy() {
    if (state.kind !== "ready") return;
    try {
      await navigator.clipboard.writeText(state.url);
      setNote("Đã sao chép");
    } catch {
      // Clipboard API unavailable (insecure context / denied): select the text for manual copy.
      inputRef.current?.focus();
      inputRef.current?.select();
      setNote("Hãy giữ và chọn Sao chép");
    }
  }

  if (disabled) {
    return (
      <Button variant="secondary" disabled className="w-full md:w-auto">
        <Link2 aria-hidden />
        Tạo link riêng
      </Button>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-2">
      {state.kind !== "ready" ? (
        <Button
          variant="secondary"
          onClick={create}
          disabled={pending}
          aria-label={`Tạo link riêng cho ${guestName}`}
          className="w-full md:w-auto"
        >
          <Link2 aria-hidden />
          {pending ? "Đang tạo…" : "Tạo link riêng"}
        </Button>
      ) : (
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex items-center gap-2">
            <Badge tone="warning">Link mẫu</Badge>
            <span className="text-xs text-muted">Chưa dùng được thật</span>
          </div>
          <div className="flex min-w-0 gap-2">
            <input
              ref={inputRef}
              readOnly
              value={state.url}
              aria-label={`Link riêng của ${guestName}`}
              onFocus={(e) => e.currentTarget.select()}
              className="h-11 min-w-0 flex-1 rounded-(--radius-btn) border border-border bg-canvas px-3 text-base text-ink"
            />
            <Button variant="primary" onClick={copy} aria-label="Sao chép link">
              <Copy aria-hidden />
              Sao chép
            </Button>
          </div>
          {note ? (
            <p role="status" className="text-sm text-muted">
              {note}
            </p>
          ) : null}
        </div>
      )}
      {state.kind === "error" ? (
        <p role="alert" className="text-sm text-danger">
          {state.message}
        </p>
      ) : null}
    </div>
  );
}

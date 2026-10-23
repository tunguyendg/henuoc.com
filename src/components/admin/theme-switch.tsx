"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PREVIEW_NOT_SAVED } from "./labels";

/** FAKE on/off switch: client state only, nothing is saved (no auth → no write endpoint). */
export function ThemeSwitch({ initialEnabled, name }: { initialEnabled: boolean; name: string }) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [message, setMessage] = useState("");

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted" aria-hidden>
          {enabled ? "Đang bật" : "Đang tắt"}
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label={`Bật mẫu ${name}`}
          onClick={() => {
            setEnabled((v) => !v);
            setMessage(PREVIEW_NOT_SAVED);
          }}
          className="inline-flex h-11 w-12 shrink-0 items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
        >
          <span
            aria-hidden
            className={cn(
              "relative inline-flex h-7 w-12 items-center rounded-full transition-colors",
              enabled ? "bg-rose-600" : "bg-muted",
            )}
          >
            <span
              className={cn(
                "inline-block size-5 rounded-full bg-surface shadow transition-transform",
                enabled ? "translate-x-6" : "translate-x-1",
              )}
            />
          </span>
        </button>
      </div>
      <p role="status" aria-live="polite" className="min-h-4 text-xs text-muted">
        {message}
      </p>
    </div>
  );
}

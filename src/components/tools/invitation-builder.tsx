"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  invitationFields,
  invitationStyles,
  invitationVariables,
  renderInvitation,
  templateSlots,
  type InvitationValues,
} from "@/data/invitation-templates";
import { cn } from "@/lib/utils";

const COPIED = "Đã sao chép";

const chip =
  "inline-flex min-h-11 cursor-pointer items-center rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-rose-500 peer-checked:border-rose-600 peer-checked:bg-rose-600 peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-rose-600";

/** Pick a style + template, fill a few fields, copy the result. Nothing leaves the browser. */
export function InvitationBuilder() {
  const [styleId, setStyleId] = useState(invitationStyles[0]?.id ?? "");
  const [templateIndex, setTemplateIndex] = useState(0);
  const [values, setValues] = useState<InvitationValues>({});
  const [status, setStatus] = useState("");
  const previewRef = useRef<HTMLParagraphElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const groupId = useId();

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const style = invitationStyles.find((s) => s.id === styleId) ?? invitationStyles[0];
  if (!style) return null;
  const template = style.templates[templateIndex] ?? style.templates[0];
  if (!template) return null;

  const usedSlots = new Set(style.templates.flatMap((t) => templateSlots(t.text)));
  const fields = invitationVariables.filter((v) => usedSlots.has(v));
  const text = renderInvitation(template.text, values);

  function announce(message: string) {
    setStatus(message);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setStatus(""), 4000);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      announce(COPIED);
    } catch {
      // Clipboard API missing (old browser, non-HTTPS) or blocked → select the text for the user.
      const node = previewRef.current;
      const selection = window.getSelection();
      if (node && selection) {
        const range = document.createRange();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      announce("Không sao chép tự động được. Câu mời đã được chọn sẵn, bạn bấm giữ để sao chép.");
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
      <div className="space-y-7">
        <fieldset>
          <legend className="text-sm font-semibold text-ink">1. Chọn kiểu lời mời</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {invitationStyles.map((s) => (
              <label key={s.id}>
                <input
                  type="radio"
                  name={`${groupId}-style`}
                  value={s.id}
                  checked={s.id === style.id}
                  onChange={() => {
                    setStyleId(s.id);
                    setTemplateIndex(0);
                  }}
                  className="peer sr-only"
                />
                <span className={chip}>{s.label}</span>
              </label>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted">{style.description}</p>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold text-ink">2. Chọn mẫu câu</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {style.templates.map((t, i) => (
              <label key={t.id}>
                <input
                  type="radio"
                  name={`${groupId}-template`}
                  value={t.id}
                  checked={t.id === template.id}
                  onChange={() => setTemplateIndex(i)}
                  className="peer sr-only"
                />
                <span className={chip}>Mẫu {i + 1}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold text-ink">
            3. Điền thông tin (không bắt buộc)
          </legend>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {fields.map((name) => (
              <Input
                key={name}
                label={invitationFields[name].label}
                placeholder={invitationFields[name].example}
                value={values[name] ?? ""}
                onChange={(e) => setValues((prev) => ({ ...prev, [name]: e.target.value }))}
                type={name === "link" ? "url" : "text"}
                inputMode={name === "link" ? "url" : undefined}
                autoComplete="off"
              />
            ))}
          </div>
        </fieldset>
      </div>

      <div className="lg:sticky lg:top-24">
        <div className="rounded-(--radius-card) border border-border bg-surface p-6 shadow-(--shadow-card)">
          <h2 className="text-sm font-semibold text-ink">Câu mời của bạn</h2>
          <p
            ref={previewRef}
            className="mt-3 text-lg leading-relaxed break-words whitespace-pre-line text-ink"
          >
            {text}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button onClick={copy}>
              <Copy aria-hidden /> Sao chép
            </Button>
            <p
              aria-live="polite"
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium",
                status === COPIED ? "text-success" : "text-muted",
              )}
            >
              {status === COPIED ? <Check aria-hidden className="size-4" /> : null}
              {status}
            </p>
          </div>
          <p className="mt-4 text-sm text-muted">
            Chỗ nào còn trong ngoặc vuông là chưa điền. Bạn có thể sửa thêm sau khi dán.
          </p>
        </div>
      </div>
    </div>
  );
}

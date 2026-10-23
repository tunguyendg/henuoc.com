"use client";

import { Check } from "lucide-react";
import { useId, useState, type KeyboardEvent, type TextareaHTMLAttributes } from "react";
import { MiniInvitation, type MiniStyle } from "@/components/home/mini-invitation";
import { PhoneFrame } from "@/components/home/phone-frame";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LIMITS, localToDateLabel, validate, type EditorValues } from "./draft";

export interface ThemeChoice {
  slug: string;
  name: string;
  preview: MiniStyle;
  premium: boolean;
}

type View = "form" | "preview";

function Textarea({
  label,
  error,
  hint,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string; hint?: string }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? `${id}-msg` : undefined}
        className={cn(
          "min-h-28 rounded-(--radius-btn) border border-border bg-surface px-4 py-3 text-base text-ink transition-colors placeholder:text-muted focus:border-rose-600 focus:outline-none",
          error && "border-danger focus:border-danger",
          className,
        )}
        {...props}
      />
      {error || hint ? (
        <p id={`${id}-msg`} className={cn("text-sm", error ? "text-danger" : "text-muted")}>
          {error ?? hint}
        </p>
      ) : null}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="flex flex-col gap-4 p-4 md:p-6">
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      {children}
    </Card>
  );
}

/**
 * Client leaf: the form is local state and the preview reads that same state, so it updates on every
 * keystroke with no server round trip. It receives only the fields it edits (plain serializable
 * props), never the whole wedding. Nothing is persisted yet (no backend).
 */
export function CardEditor({
  initial,
  themes,
}: {
  initial: EditorValues;
  themes: readonly ThemeChoice[];
}) {
  const [v, setV] = useState<EditorValues>(initial);
  const [touched, setTouched] = useState<ReadonlySet<string>>(new Set());
  const [view, setView] = useState<View>("form");
  const baseId = useId();

  const errors = validate(v);
  const err = (key: string) => (touched.has(key) ? errors[key] : undefined);
  const touch = (key: string) => setTouched((t) => new Set(t).add(key));
  const set = <K extends keyof EditorValues>(key: K, value: EditorValues[K]) => {
    setV((prev) => ({ ...prev, [key]: value }));
    touch(String(key));
  };
  const setEvent = (i: number, patch: Partial<EditorValues["events"][number]>, key: string) => {
    setV((prev) => ({
      ...prev,
      events: prev.events.map((ev, idx) => (idx === i ? { ...ev, ...patch } : ev)),
    }));
    touch(key);
  };
  const blur = (key: string) => () => touch(key);

  const theme = themes.find((t) => t.slug === v.themeSlug) ?? themes[0];
  const short = (full: string, s: string) =>
    s.trim() || full.trim().split(/\s+/).slice(-2).join(" ");
  const bride = short(v.brideName, v.brideShortName) || "Cô dâu";
  const groom = short(v.groomName, v.groomShortName) || "Chú rể";
  const [first, second] = v.brideFirst ? [bride, groom] : [groom, bride];
  const lastEvent = v.events[v.events.length - 1];
  const dateLabel = lastEvent ? localToDateLabel(lastEvent.startsAtLocal) : undefined;

  const tabClass = (on: boolean) =>
    cn(
      "min-h-11 flex-1 rounded-full text-sm font-semibold transition-colors duration-200",
      on ? "bg-surface text-rose-700 shadow-sm" : "text-muted",
    );

  // Roving tabindex (WAI-ARIA tabs): only the selected tab is in the Tab order; arrows move + select.
  const onTabKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const order: View[] = ["form", "preview"];
    const i = order.indexOf(view);
    let next: View | undefined;
    if (e.key === "ArrowRight") next = order[(i + 1) % order.length];
    else if (e.key === "ArrowLeft") next = order[(i + order.length - 1) % order.length];
    else if (e.key === "Home") next = order[0];
    else if (e.key === "End") next = order[order.length - 1];
    if (!next) return;
    e.preventDefault();
    setView(next);
    document.getElementById(`${baseId}-tab-${next}`)?.focus();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* < md: switch between the form and the preview instead of stacking them. */}
      <div
        role="tablist"
        aria-label="Chế độ xem"
        onKeyDown={onTabKeyDown}
        className="flex gap-1 rounded-full bg-rose-50 p-1 md:hidden"
      >
        <button
          type="button"
          role="tab"
          id={`${baseId}-tab-form`}
          aria-selected={view === "form"}
          tabIndex={view === "form" ? 0 : -1}
          aria-controls={`${baseId}-form`}
          onClick={() => setView("form")}
          className={tabClass(view === "form")}
        >
          Thông tin
        </button>
        <button
          type="button"
          role="tab"
          id={`${baseId}-tab-preview`}
          aria-selected={view === "preview"}
          tabIndex={view === "preview" ? 0 : -1}
          aria-controls={`${baseId}-preview`}
          onClick={() => setView("preview")}
          className={tabClass(view === "preview")}
        >
          Xem trước
        </button>
      </div>

      <div className="grid items-start gap-6 md:grid-cols-[minmax(0,1fr)_320px]">
        <div
          id={`${baseId}-form`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-form`}
          className={cn("flex min-w-0 flex-col gap-4", view !== "form" && "max-md:hidden")}
        >
          <Section title="Chọn mẫu thiệp">
            <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
              {themes.map((t) => {
                const on = t.slug === theme?.slug;
                return (
                  <button
                    key={t.slug}
                    type="button"
                    aria-pressed={on}
                    onClick={() => set("themeSlug", t.slug)}
                    className={cn(
                      "flex w-24 shrink-0 snap-start flex-col gap-1.5 rounded-(--radius-btn) border p-1.5 text-left transition-colors duration-200",
                      on
                        ? "border-rose-600 bg-rose-50"
                        : "border-border bg-surface hover:border-rose-500",
                    )}
                  >
                    <span className="block aspect-[3/4] w-full overflow-hidden rounded-lg">
                      <MiniInvitation style={t.preview} bride={bride} groom={groom} date="" />
                    </span>
                    <span className="flex items-center gap-1 px-0.5 text-xs font-semibold text-ink">
                      {on ? <Check aria-hidden className="size-3.5 text-rose-700" /> : null}
                      <span className="truncate">{t.name}</span>
                    </span>
                    {t.premium ? (
                      <span className="px-0.5 text-[11px] text-muted">Cao cấp</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title="Cô dâu & chú rể">
            <Input
              label="Tên cô dâu"
              autoComplete="off"
              value={v.brideName}
              error={err("brideName")}
              onChange={(e) => set("brideName", e.target.value)}
              onBlur={blur("brideName")}
            />
            <Input
              label="Tên gọi trên thiệp (cô dâu)"
              hint="Ví dụ: Minh Anh. Để trống thì lấy hai chữ cuối."
              autoComplete="off"
              value={v.brideShortName}
              error={err("brideShortName")}
              onChange={(e) => set("brideShortName", e.target.value)}
              onBlur={blur("brideShortName")}
            />
            <Input
              label="Tên chú rể"
              autoComplete="off"
              value={v.groomName}
              error={err("groomName")}
              onChange={(e) => set("groomName", e.target.value)}
              onBlur={blur("groomName")}
            />
            <Input
              label="Tên gọi trên thiệp (chú rể)"
              autoComplete="off"
              value={v.groomShortName}
              error={err("groomShortName")}
              onChange={(e) => set("groomShortName", e.target.value)}
              onBlur={blur("groomShortName")}
            />
            <fieldset className="flex flex-col gap-1.5">
              <legend className="mb-1.5 text-sm font-medium text-ink">Tên ai đứng trước</legend>
              <div className="flex gap-2">
                {[
                  { label: "Cô dâu trước", value: true },
                  { label: "Chú rể trước", value: false },
                ].map((o) => (
                  <label
                    key={o.label}
                    className={cn(
                      "flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-(--radius-btn) border px-3 text-sm font-medium has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-rose-600",
                      v.brideFirst === o.value
                        ? "border-rose-600 bg-rose-50 text-rose-700"
                        : "border-border bg-surface text-ink",
                    )}
                  >
                    <input
                      type="radio"
                      name="brideFirst"
                      className="sr-only"
                      checked={v.brideFirst === o.value}
                      onChange={() => set("brideFirst", o.value)}
                    />
                    {o.label}
                  </label>
                ))}
              </div>
            </fieldset>
          </Section>

          <Section title="Gia đình hai bên">
            <Input
              label="Bố mẹ cô dâu (nhà gái)"
              autoComplete="off"
              value={v.brideParents}
              error={err("brideParents")}
              onChange={(e) => set("brideParents", e.target.value)}
              onBlur={blur("brideParents")}
            />
            <Input
              label="Bố mẹ chú rể (nhà trai)"
              autoComplete="off"
              value={v.groomParents}
              error={err("groomParents")}
              onChange={(e) => set("groomParents", e.target.value)}
              onBlur={blur("groomParents")}
            />
          </Section>

          <Section title="Lời mời">
            <Textarea
              label="Lời mời"
              value={v.inviteMessage}
              error={err("inviteMessage")}
              hint={`${v.inviteMessage.length}/${LIMITS.message} ký tự`}
              onChange={(e) => set("inviteMessage", e.target.value)}
              onBlur={blur("inviteMessage")}
            />
          </Section>

          {v.events.map((ev, i) => (
            <Section key={ev.id} title={ev.title}>
              <Input
                label="Ngày giờ (giờ Việt Nam)"
                type="datetime-local"
                value={ev.startsAtLocal}
                className="w-full min-w-0"
                onChange={(e) => setEvent(i, { startsAtLocal: e.target.value }, `date-${i}`)}
              />
              <Input
                label="Tên địa điểm"
                autoComplete="off"
                value={ev.venue}
                error={err(`venue-${i}`)}
                onChange={(e) => setEvent(i, { venue: e.target.value }, `venue-${i}`)}
                onBlur={blur(`venue-${i}`)}
              />
              <Input
                label="Địa chỉ"
                autoComplete="off"
                value={ev.address}
                error={err(`address-${i}`)}
                onChange={(e) => setEvent(i, { address: e.target.value }, `address-${i}`)}
                onBlur={blur(`address-${i}`)}
              />
            </Section>
          ))}

          <div className="flex flex-col gap-2">
            <Button disabled size="lg" className="w-full">
              Lưu
            </Button>
            <p className="text-sm text-muted">Chưa lưu được — đang dùng dữ liệu mẫu.</p>
          </div>
        </div>

        <aside
          id={`${baseId}-preview`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-preview`}
          aria-label="Xem trước thiệp"
          className={cn(
            "flex min-w-0 flex-col items-center gap-3 md:sticky md:top-6",
            view !== "preview" && "max-md:hidden",
          )}
        >
          <PhoneFrame>
            {theme ? (
              <MiniInvitation
                style={theme.preview}
                bride={first}
                groom={second}
                date={dateLabel}
                salutation="Trân trọng kính mời"
              />
            ) : null}
          </PhoneFrame>
          <div className="flex flex-col items-center gap-1 text-center">
            <Badge tone="warning">Xem trước minh hoạ</Badge>
            <p className="max-w-[260px] text-sm text-muted">
              Mẫu {theme?.name}. Thiệp thật sẽ có thêm lời mời, gia đình và sự kiện.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

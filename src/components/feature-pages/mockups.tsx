import { Check, Copy, Download, MessageCircle } from "lucide-react";
import { MiniInvitation } from "@/components/home/mini-invitation";
import { PhoneFrame } from "@/components/home/phone-frame";
import { RsvpMock } from "@/components/home/rsvp-section";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Static illustrations only. All names below are sample data, not real guests.

function SampleNote({ className }: { className?: string }) {
  return <p className={cn("text-xs text-muted", className)}>Dữ liệu minh hoạ</p>;
}

export function RsvpPhoneMock() {
  return (
    <figure className="flex flex-col items-center">
      <PhoneFrame>
        <RsvpMock />
      </PhoneFrame>
      <figcaption>
        <SampleNote className="mt-4" />
      </figcaption>
    </figure>
  );
}

export function PersonalInviteMock() {
  return (
    <figure className="flex w-full max-w-md flex-col items-center">
      <div className="flex justify-center gap-4 sm:gap-6">
        <PhoneFrame className="w-[148px] rotate-[-4deg] border-8 sm:w-[200px]">
          <MiniInvitation style="songhy" salutation="Trân trọng kính mời Ông Bà Nội & Gia đình" />
        </PhoneFrame>
        <PhoneFrame className="mt-10 w-[148px] rotate-[4deg] border-8 sm:w-[200px]">
          <MiniInvitation style="songhy" salutation="Thân mời bạn Lan & Người thương" />
        </PhoneFrame>
      </div>
      <Card className="mt-8 w-full p-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-ink">
          <MessageCircle aria-hidden className="size-4 text-rose-600" strokeWidth={1.75} />
          Tin nhắn mẫu
        </p>
        <p className="mt-3 rounded-2xl bg-rose-50 p-4 text-sm break-words text-ink">
          Thân mời bạn Lan & Người thương đến dự tiệc cưới của Minh Anh & Hoàng Nam. Thiệp của bạn ở
          đây nhé: henuoc.com/thiepcuoi/minhanh-hoangnam/…
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
          <span className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-ink">
            <Copy aria-hidden className="size-3.5" /> Sao chép tin nhắn
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-ink">
            <Check aria-hidden className="size-3.5" /> Đánh dấu đã gửi
          </span>
        </div>
      </Card>
      <figcaption>
        <SampleNote className="mt-3" />
      </figcaption>
    </figure>
  );
}

const guestRows = [
  {
    name: "Ông Bà Nội & Gia đình",
    side: "Nhà trai",
    group: "Họ hàng",
    people: 4,
    status: "attending",
  },
  { name: "Cô Chú Tư & Gia đình", side: "Nhà gái", group: "Họ hàng", people: 3, status: "sent" },
  {
    name: "Bạn Lan & Người thương",
    side: "Nhà gái",
    group: "Bạn bè",
    people: 2,
    status: "pending",
  },
  { name: "Anh Minh", side: "Nhà trai", group: "Đồng nghiệp", people: 1, status: "declined" },
] as const;

const guestFilters = ["Tất cả", "Nhà trai", "Nhà gái", "Chưa phản hồi"];

export function GuestTableMock() {
  return (
    <Card className="w-full overflow-hidden p-0">
      <div className="flex flex-wrap gap-2 border-b border-border px-5 py-4">
        {guestFilters.map((f, i) => (
          <span
            key={f}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium",
              i === 0 ? "bg-rose-600 text-white" : "border border-border text-ink",
            )}
          >
            {f}
          </span>
        ))}
      </div>
      <ul className="divide-y divide-border">
        {guestRows.map((r) => (
          <li key={r.name} className="flex flex-wrap items-center gap-x-3 gap-y-2 px-5 py-4">
            <div className="min-w-0 flex-1 basis-40">
              <p className="truncate font-medium text-ink">{r.name}</p>
              <p className="text-sm text-muted">
                {r.group} · {r.people} người
              </p>
            </div>
            <Badge>{r.side}</Badge>
            <StatusBadge status={r.status} />
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between gap-3 border-t border-border bg-canvas px-5 py-3">
        <SampleNote />
        <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-700">
          <Download aria-hidden className="size-3.5" /> Xuất CSV
        </span>
      </div>
    </Card>
  );
}

const checklistGroups = [
  {
    when: "6 tháng trước",
    items: [
      { task: "Chốt ngày cưới và ngân sách", done: true },
      { task: "Chụp ảnh cưới", done: true },
    ],
  },
  {
    when: "1 tháng trước",
    items: [
      { task: "Gửi thiệp mời online", done: true },
      { task: "Chuẩn bị bàn gia tiên", done: false },
    ],
  },
  {
    when: "1 tuần trước",
    items: [
      { task: "Gửi danh sách khách cho nhà hàng", done: false },
      { task: "Nhắc khách chưa phản hồi", done: false },
    ],
  },
];

export function ChecklistMock() {
  return (
    <Card className="w-full max-w-md">
      <p className="text-sm font-semibold text-ink">Việc cần làm theo mốc</p>
      <div className="mt-5 space-y-6">
        {checklistGroups.map((g) => (
          <div key={g.when}>
            <p className="text-xs font-bold tracking-[0.16em] text-rose-700 uppercase">{g.when}</p>
            <ul className="mt-3 space-y-3">
              {g.items.map((it) => (
                <li key={it.task} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className={cn(
                      "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border",
                      it.done
                        ? "border-rose-600 bg-rose-600 text-white"
                        : "border-border bg-surface",
                    )}
                  >
                    {it.done ? <Check className="size-3.5" strokeWidth={3} /> : null}
                  </span>
                  <span
                    className={cn("font-medium", it.done ? "text-muted line-through" : "text-ink")}
                  >
                    {it.task}
                    <span className="sr-only">{it.done ? " (đã xong)" : " (chưa xong)"}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <SampleNote className="mt-6" />
    </Card>
  );
}

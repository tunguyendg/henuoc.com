import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { Photo } from "./photo";
import { FeatureList, SectionHeading } from "./section-heading";

const items = [
  { when: "6 tháng trước", task: "Chụp ảnh cưới", done: true },
  { when: "3 tháng trước", task: "Chuẩn bị lễ ăn hỏi", done: true },
  { when: "2 tháng trước", task: "Gửi thiệp mời online", done: true },
  { when: "1 tháng trước", task: "Trang trí bàn gia tiên", done: false },
  { when: "3 tuần trước", task: "Chọn quà cảm ơn cho khách", done: false },
];

export function ChecklistSection() {
  return (
    <section className="py-20 md:py-28">
      <Container className="grid items-center gap-14 md:grid-cols-[1.2fr_1fr]">
        <div className="relative order-2 md:order-1">
          <Photo
            src="/images/wedding/checklist.jpg"
            alt="Chuẩn bị đồ cưới trước ngày trọng đại"
            sizes="(min-width: 768px) 50vw, 90vw"
            className="absolute -top-6 right-0 bottom-6 left-10 rounded-[2rem]"
          />
          <Card className="relative mt-16 mr-10 md:mt-24">
            <p className="text-sm font-semibold text-ink">Còn 87 ngày · Việc cần làm</p>
            <ol className="mt-5 space-y-4">
              {items.map((it) => (
                <li key={it.task} className="flex items-start gap-3">
                  <span
                    className={cn(
                      "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border",
                      it.done
                        ? "border-rose-600 bg-rose-600 text-white"
                        : "border-border bg-surface",
                    )}
                  >
                    {it.done ? <Check aria-hidden className="size-3.5" strokeWidth={3} /> : null}
                  </span>
                  <div>
                    <p
                      className={cn(
                        "font-medium",
                        it.done ? "text-muted line-through" : "text-ink",
                      )}
                    >
                      {it.task}
                    </p>
                    <p className="text-sm text-muted">{it.when}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        <div className="order-1 md:order-2">
          <SectionHeading
            eyebrow="Checklist cưới"
            title="Từ ngày hẹn đến ngày cưới, không sót việc gì"
          >
            Danh sách việc cần làm tự xếp theo ngày cưới của hai bạn. Tick xong là nhẹ lòng!
          </SectionHeading>
          <FeatureList
            items={[
              "Gần 40 việc theo từng mốc thời gian",
              "Nhắc việc trong tuần ngay trên trang tổng quan",
              "Gợi ý đồ cưới phù hợp cho từng việc",
            ]}
          />
        </div>
      </Container>
    </section>
  );
}

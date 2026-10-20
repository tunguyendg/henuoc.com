import { Badge, StatusBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Photo } from "./photo";
import { FeatureList, SectionHeading } from "./section-heading";

// Dữ liệu mẫu cho mockup — không phải khách thật.
const rows = [
  { name: "Ông Bà Nội & Gia đình", side: "Nhà trai", people: 4, status: "attending" },
  { name: "Cô Chú Tư & Gia đình", side: "Nhà gái", people: 3, status: "attending" },
  { name: "Bạn Lan & Người thương", side: "Nhà gái", people: 2, status: "pending" },
  { name: "Anh Minh (đồng nghiệp)", side: "Nhà trai", people: 1, status: "declined" },
] as const;

const stats = [
  { label: "Lời mời", value: "120" },
  { label: "Sẽ đến", value: "86" },
  { label: "≈ Số bàn", value: "9" },
];

export function GuestManagement() {
  return (
    <section className="bg-surface py-20 md:py-28">
      <Container className="grid items-center gap-14 md:grid-cols-[1fr_1.2fr]">
        <div>
          <SectionHeading
            eyebrow="Quản lý khách mời"
            title="Nhà trai, nhà gái — rõ ràng trong một bảng"
          >
            Biết ai đã nhận lời mời, ai sẽ đến, đi bao nhiêu người và cần đặt khoảng bao nhiêu bàn.
          </SectionHeading>
          <FeatureList
            items={[
              "Chia khách theo bên và nhóm: họ hàng, bạn bè, đồng nghiệp",
              "Nhập danh sách từ file Excel/CSV",
              "Xuất danh sách cho nhà hàng chỉ một lần bấm",
            ]}
          />
          <Photo
            src="/images/wedding/guests.jpg"
            alt="Họ hàng và bạn bè chụp ảnh cùng cô dâu chú rể"
            sizes="(min-width: 768px) 40vw, 90vw"
            className="mt-10 aspect-[16/10] rounded-(--radius-card)"
          />
        </div>

        <Card className="overflow-hidden p-0">
          <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
            {stats.map((s) => (
              <div key={s.label} className="px-5 py-4">
                <p className="text-2xl font-semibold text-ink">{s.value}</p>
                <p className="text-sm text-muted">{s.label}</p>
              </div>
            ))}
          </div>
          <ul className="divide-y divide-border">
            {rows.map((r) => (
              <li key={r.name} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">{r.name}</p>
                  <p className="text-sm text-muted">{r.people} người</p>
                </div>
                <Badge>{r.side}</Badge>
                <StatusBadge status={r.status} />
              </li>
            ))}
          </ul>
          <p className="border-t border-border bg-canvas px-5 py-3 text-xs text-muted">
            Dữ liệu minh hoạ
          </p>
        </Card>
      </Container>
    </section>
  );
}

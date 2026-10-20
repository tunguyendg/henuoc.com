import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = { title: "UI kit", robots: { index: false, follow: false } };

const swatches = [
  ["rose-50", "bg-rose-50"],
  ["rose-500 · brand", "bg-rose-500"],
  ["rose-600 · CTA", "bg-rose-600"],
  ["rose-700 · hover", "bg-rose-700"],
  ["canvas", "bg-canvas"],
  ["ink", "bg-ink"],
  ["muted", "bg-muted"],
  ["border", "bg-border"],
  ["success", "bg-success"],
  ["warning", "bg-warning"],
  ["danger", "bg-danger"],
] as const;

/** Trang xem nhanh design system — chỉ có ở môi trường dev. */
export default function UiKitPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="py-12">
      <Container className="space-y-12">
        <section>
          <h1 className="font-display text-4xl font-extrabold tracking-[-0.03em]">
            UI kit · Hẹn Ước
          </h1>
          <p className="mt-2 text-muted">
            Kiểm tra dấu: Nguyễn Thị Thùy Dương — Trân trọng kính mời — Lễ Vu Quy (nhằm ngày 01.11
            Bính Ngọ)
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold">Màu</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {swatches.map(([name, cls]) => (
              <div key={name} className="overflow-hidden rounded-xl border border-border">
                <div className={`h-16 ${cls}`} />
                <p className="bg-surface px-3 py-2 text-xs font-medium">{name}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold">Nút</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg">
              Tạo thiệp miễn phí <ArrowRight aria-hidden />
            </Button>
            <Button>Lưu & chia sẻ</Button>
            <Button variant="secondary">Xem mẫu thiệp</Button>
            <Button variant="ghost">Huỷ</Button>
            <Button size="sm" disabled>
              Đang lưu…
            </Button>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <Card className="space-y-4">
            <h2 className="text-lg font-semibold">Form</h2>
            <Input label="Tên cô dâu" placeholder="Nguyễn Minh Anh" />
            <Input label="Tên gọi hiển thị" hint="Hiện trên bìa thiệp" defaultValue="Minh Anh" />
            <Input label="Số điện thoại" error="Số điện thoại chưa đúng" defaultValue="09123" />
          </Card>
          <Card className="space-y-4">
            <h2 className="text-lg font-semibold">Trạng thái</h2>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status="attending" />
              <StatusBadge status="declined" />
              <StatusBadge status="pending" />
              <StatusBadge status="sent" />
              <Badge>Cao cấp</Badge>
            </div>
          </Card>
        </section>
      </Container>
    </main>
  );
}

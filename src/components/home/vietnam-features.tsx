import { CalendarHeart, Landmark, QrCode, Send } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "./section-heading";

const features = [
  {
    icon: QrCode,
    title: "QR mừng cưới",
    text: "Mã QR chuyển khoản riêng cho nhà trai và nhà gái, khách quét là xong.",
  },
  {
    icon: CalendarHeart,
    title: "Lịch âm dương",
    text: "Tự hiển thị ngày âm lịch bên cạnh ngày dương cho mỗi buổi lễ.",
  },
  {
    icon: Landmark,
    title: "Vu quy & thành hôn",
    text: "Tách lễ nhà gái, nhà trai và tiệc cưới, mỗi lễ một địa điểm.",
  },
  {
    icon: Send,
    title: "Gửi qua Zalo",
    text: "Sao chép tin nhắn mời có sẵn link riêng, dán vào Zalo là gửi.",
  },
];

export function VietnamFeatures() {
  return (
    <section className="bg-rose-50/60 py-20 md:py-28">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Dành riêng cho đám cưới Việt"
          title="Những chi tiết nhỏ làm nên tấm thiệp đúng nghĩa"
        />
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }) => (
            <li
              key={title}
              className="rounded-(--radius-card) border border-border bg-surface p-6 shadow-(--shadow-card)"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <Icon aria-hidden className="size-5" strokeWidth={1.75} />
              </span>
              <h3 className="mt-5 font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-sm text-muted">{text}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

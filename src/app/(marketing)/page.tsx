import type { Metadata } from "next";
import { CalendarHeart, Heart, Send, Users } from "lucide-react";
import { Container } from "@/components/ui/container";
import { site } from "@/lib/site";

// Trang tạm trong lúc xây dựng — chưa cho Google index.
export const metadata: Metadata = {
  title: "Sắp ra mắt",
  robots: { index: false, follow: false },
};

const upcoming = [
  {
    icon: Heart,
    title: "Mẫu thiệp đẹp",
    text: "Hiện đại, truyền thống, tối giản — có nhạc và hiệu ứng.",
  },
  {
    icon: Send,
    title: "Mỗi khách một tấm thiệp",
    text: "Lời mời mang đúng tên, gửi nhanh qua Zalo.",
  },
  { icon: Users, title: "Quản lý khách mời", text: "Nhà trai, nhà gái, RSVP và số bàn dự kiến." },
  {
    icon: CalendarHeart,
    title: "Lịch âm & mừng cưới",
    text: "Ngày âm lịch, QR mừng cưới cho hai bên.",
  },
];

export default function ComingSoonPage() {
  return (
    <main className="flex flex-1 flex-col">
      <header className="py-6">
        <Container>
          <span className="font-display text-2xl font-semibold text-rose-500">{site.name}</span>
        </Container>
      </header>

      <section className="flex flex-1 items-center py-16 md:py-24">
        <Container className="grid gap-14 md:grid-cols-[1.1fr_1fr] md:items-center">
          <div>
            <p className="mb-5 inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold tracking-[0.14em] text-rose-700 uppercase">
              Sắp ra mắt
            </p>
            <h1 className="font-display text-4xl leading-[1.15] font-medium text-ink md:text-6xl">
              Thiệp cưới online,
              <span className="block text-rose-500">gửi đúng tên từng khách.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted">
              Hẹn Ước giúp hai bạn tạo thiệp cưới đẹp trong vài phút, gửi lời mời riêng qua Zalo và
              biết chính xác ai sẽ đến chung vui.
            </p>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2">
            {upcoming.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                className="rounded-(--radius-card) border border-border bg-surface p-5 shadow-(--shadow-card)"
              >
                <Icon aria-hidden className="mb-3 size-6 text-rose-500" strokeWidth={1.75} />
                <h2 className="font-semibold text-ink">{title}</h2>
                <p className="mt-1 text-sm text-muted">{text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <footer className="border-t border-border py-6 text-sm text-muted">
        <Container>
          © 2026 {site.name} · {site.domain}
        </Container>
      </footer>
    </main>
  );
}

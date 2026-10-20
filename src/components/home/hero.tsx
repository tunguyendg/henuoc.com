import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { MiniInvitation } from "./mini-invitation";
import { PhoneFrame } from "./phone-frame";

const ticks = ["Không cần biết thiết kế", "Xem trước ngay", "Khách không cần cài app"];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Mảng màu nền mềm phía sau điện thoại */}
      <div
        aria-hidden
        className="absolute top-10 -right-32 size-[560px] rounded-full bg-rose-50 blur-3xl md:right-0"
      />

      <Container className="relative grid items-center gap-14 py-14 md:grid-cols-[1.15fr_1fr] md:py-24">
        <div>
          <p className="inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-rose-700 uppercase">
            Thiệp cưới online · Miễn phí bắt đầu
          </p>
          <h1 className="mt-6 font-display text-[2.4rem] leading-[1.12] font-medium text-ink md:text-6xl">
            Thiệp cưới online,
            <span className="block text-rose-500">gửi đúng tên từng khách.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">
            Chọn mẫu, điền thông tin và xem thiệp ngay trên điện thoại. Mỗi khách nhận một lời mời
            riêng qua Zalo — hai bạn biết chính xác ai sẽ đến chung vui.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/tao-thiep" className={buttonVariants({ size: "lg" })}>
              Tạo thiệp miễn phí <ArrowRight aria-hidden />
            </Link>
            <Link
              href="/mau-thiep-cuoi"
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              Xem mẫu thiệp
            </Link>
          </div>

          <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            {ticks.map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <Check aria-hidden className="size-4 text-rose-600" strokeWidth={2.5} />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto">
          <PhoneFrame>
            <MiniInvitation style="pastel" salutation="Trân trọng kính mời Anh Minh & Gia đình" />
          </PhoneFrame>

          {/* Thẻ nổi minh hoạ lời mời riêng & RSVP */}
          <div className="absolute top-16 -left-16 hidden w-52 rounded-2xl border border-border bg-surface p-4 shadow-(--shadow-card) sm:block">
            <p className="text-xs text-muted">Lời mời riêng</p>
            <p className="mt-1 text-sm font-semibold text-ink">Kính mời Cô Chú Tư & Gia đình</p>
          </div>
          <div className="absolute -right-12 bottom-20 hidden w-48 rounded-2xl border border-border bg-surface p-4 shadow-(--shadow-card) sm:block">
            <p className="text-xs text-muted">Bạn Lan vừa phản hồi</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-success">
              <Check aria-hidden className="size-4" strokeWidth={2.5} /> Sẽ đến · 2 người
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

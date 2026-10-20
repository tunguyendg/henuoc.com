import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Photo } from "./photo";

export function FinalCta() {
  return (
    <section className="pb-20 md:pb-28">
      <Container>
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-rose-700 px-6 py-20 text-center text-white md:px-16 md:py-28">
          <Photo
            src="/images/wedding/cta.jpg"
            alt=""
            sizes="(min-width: 1152px) 1088px, 100vw"
            className="absolute inset-0 -z-10"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-t from-rose-700/90 via-rose-700/60 to-ink/30"
          />
          <h2 className="font-display text-3xl leading-tight font-extrabold tracking-[-0.03em] md:text-5xl">
            Bắt đầu tấm thiệp của hai bạn
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">
            Chỉ vài phút để có thiệp cưới đẹp trên điện thoại. Miễn phí để bắt đầu.
          </p>
          <Link
            href="/tao-thiep"
            className={buttonVariants({
              size: "lg",
              variant: "secondary",
              className: "mt-9 border-transparent text-rose-700 hover:text-rose-700",
            })}
          >
            Tạo thiệp miễn phí <ArrowRight aria-hidden />
          </Link>
        </div>
      </Container>
    </section>
  );
}

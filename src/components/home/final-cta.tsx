import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function FinalCta() {
  return (
    <section className="pb-20 md:pb-28">
      <Container>
        <div className="rounded-[2rem] bg-rose-600 px-6 py-16 text-center text-white md:px-16">
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

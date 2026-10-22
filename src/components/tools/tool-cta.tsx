import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

/** Closing call to action of a free tool page: lead into the online invitation builder. */
export function ToolCta({ title, text }: { title: string; text: string }) {
  return (
    <section className="py-16 md:py-20 print:hidden">
      <Container>
        <div className="rounded-[2rem] bg-rose-50 px-6 py-14 text-center md:px-16">
          <h2 className="font-display text-3xl leading-tight font-extrabold tracking-[-0.03em] text-ink md:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted">{text}</p>
          <Link href="/tao-thiep" className={buttonVariants({ size: "lg", className: "mt-8" })}>
            Tạo thiệp miễn phí <ArrowRight aria-hidden />
          </Link>
        </div>
      </Container>
    </section>
  );
}

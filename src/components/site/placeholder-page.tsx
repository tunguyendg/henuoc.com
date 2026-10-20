import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

/** Trang tạm cho các mục trong menu chưa xây — để bấm vào không bị 404. */
export function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <Container width="prose" className="py-24 text-center md:py-32">
      <p className="text-xs font-bold tracking-[0.16em] text-rose-700 uppercase">Đang xây dựng</p>
      <h1 className="mt-4 font-display text-4xl font-extrabold tracking-[-0.03em] text-ink md:text-5xl">
        {title}
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-lg text-muted">{description}</p>
      <Link href="/" className={buttonVariants({ variant: "secondary", className: "mt-10" })}>
        Về trang chủ
      </Link>
    </Container>
  );
}

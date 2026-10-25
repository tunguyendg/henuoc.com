import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { RedirectIfSignedIn } from "@/components/auth/redirect-if-signed-in";
import { Container } from "@/components/ui/container";
import { pageMetadata } from "@/lib/seo/metadata";
import { getSeoPage } from "@/lib/seo/pages";

export const metadata = pageMetadata("/dang-nhap");

export default function Page() {
  return (
    <Container width="prose" className="py-16 md:py-24">
      <Suspense fallback={null}>
        <RedirectIfSignedIn />
      </Suspense>
      <div className="mx-auto max-w-sm">
        <h1 className="text-center font-display text-3xl font-extrabold tracking-[-0.03em] text-ink">
          {getSeoPage("/dang-nhap").h1}
        </h1>
        <p className="mt-3 text-center text-muted">
          Chưa có tài khoản? Cứ nhập email, Hẹn Ước tự tạo cho bạn.
        </p>
        <LoginForm />
      </div>
    </Container>
  );
}

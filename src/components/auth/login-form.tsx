"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const inputClass =
  "h-12 w-full rounded-(--radius-btn) border border-border bg-surface px-4 text-base text-ink outline-none focus:border-rose-500";

export function LoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  // Bước 1: gửi mã về email
  async function sendCode(e: FormEvent) {
    e.preventDefault(); // chặn form tự tải lại trang
    setError(null);
    setPending(true);
    const { error } = await authClient.emailOtp.sendVerificationOtp({ email, type: "sign-in" });
    setPending(false);
    if (error) return setError("Không gửi được mã. Kiểm tra lại email nhé.");
    setStep("otp");
  }

  // Bước 2: nhập mã → server kiểm → đặt cookie phiên
  async function verify(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const { error } = await authClient.signIn.emailOtp({ email, otp });
    setPending(false);
    if (error) return setError("Mã không đúng hoặc đã hết hạn.");
    router.push("/dashboard");
    router.refresh(); // tải lại Server Component để thấy trạng thái đã đăng nhập
  }

  return (
    <div className="mt-8 space-y-6">
      <Button
        variant="secondary"
        className="h-12 w-full"
        onClick={() => authClient.signIn.social({ provider: "google", callbackURL: "/dashboard" })}
      >
        Tiếp tục với Google
      </Button>

      <p className="text-center text-sm text-muted">hoặc nhận mã qua email</p>

      {step === "email" ? (
        <form onSubmit={sendCode} className="space-y-3">
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="email@cuaban.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
          <Button type="submit" className="h-12 w-full" disabled={pending}>
            {pending ? "Đang gửi…" : "Gửi mã đăng nhập"}
          </Button>
        </form>
      ) : (
        <form onSubmit={verify} className="space-y-3">
          <p className="text-sm text-muted">
            Mã 6 số đã gửi tới <strong className="text-ink">{email}</strong>
          </p>
          <input
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            required
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            className={`${inputClass} text-center text-2xl tracking-[0.5em]`}
          />
          <Button type="submit" className="h-12 w-full" disabled={pending || otp.length < 6}>
            {pending ? "Đang kiểm tra…" : "Đăng nhập"}
          </Button>
          <button
            type="button"
            onClick={() => setStep("email")}
            className="w-full text-sm text-muted"
          >
            Đổi email
          </button>
        </form>
      )}

      {error && <p className="text-center text-sm text-danger">{error}</p>}
    </div>
  );
}

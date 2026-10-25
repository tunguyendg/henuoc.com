"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function SignOutButton({ variant }: { variant: "sidebar" | "icon" }) {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function handleClick() {
    if (busy) return;
    setBusy(true);
    setFailed(false);
    try {
      // Better Auth trả lỗi trong { error } chứ không throw → phải tự kiểm, không thì báo "đã ra" khi phiên còn
      const { error } = await authClient.signOut();
      if (error) {
        setFailed(true);
        return;
      }
      // Tải lại hẳn trang (không dùng router): xoá cache RSC phía client → bấm Back không hiện lại dashboard cũ
      window.location.assign("/");
    } catch {
      setFailed(true); // lỗi mạng: bật lại nút để thử lại
    } finally {
      setBusy(false);
    }
  }

  const status = (
    <span role="status" className="sr-only">
      {failed ? "Đăng xuất chưa được, thử lại nhé." : ""}
    </span>
  );

  if (variant === "icon") {
    return (
      <>
        <button
          type="button"
          onClick={handleClick}
          disabled={busy}
          aria-busy={busy}
          aria-label="Đăng xuất"
          className="flex size-11 shrink-0 items-center justify-center rounded-(--radius-btn) text-muted transition-colors duration-200 hover:bg-rose-50/60 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:opacity-60"
        >
          <LogOut aria-hidden className="size-5" strokeWidth={1.75} />
        </button>
        {status}
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        aria-busy={busy}
        className="flex h-11 w-full items-center gap-2 rounded-(--radius-btn) px-3 text-sm font-medium text-muted transition-colors duration-200 hover:bg-rose-50/60 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:opacity-60"
      >
        <LogOut aria-hidden className="size-4" strokeWidth={1.75} />
        {failed ? "Thử đăng xuất lại" : "Đăng xuất"}
      </button>
      {status}
    </>
  );
}

"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { userInitial } from "./user-initial";

type AuthState = "pending" | "guest" | "user";

function useAuthState() {
  const { data, isPending } = authClient.useSession();
  const user = data?.user ?? null;
  const state: AuthState = isPending ? "pending" : user ? "user" : "guest";
  return { state, user };
}

function Avatar({ initial }: { initial: string }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-rose-100 text-sm font-semibold text-rose-700"
    >
      {initial}
    </span>
  );
}

/**
 * Nút bên phải header (desktop). Trạng thái đăng nhập chỉ biết ở client.
 * Hai trạng thái xếp chồng cùng 1 ô grid → ô luôn rộng bằng trạng thái rộng hơn,
 * nên đổi trạng thái không làm nav xê dịch. Trạng thái không dùng: invisible + inert.
 */
export function HeaderActions() {
  const { state, user } = useAuthState();
  const guestHidden = state !== "guest";
  const userHidden = state !== "user";

  return (
    <div className="grid justify-items-end">
      <div
        className="flex items-center gap-3 [grid-area:1/1]"
        {...(guestHidden ? { inert: true, "aria-hidden": true } : {})}
        style={guestHidden ? { visibility: "hidden" } : undefined}
      >
        <Link href="/dang-nhap" className={buttonVariants({ variant: "ghost", size: "sm" })}>
          Đăng nhập
        </Link>
        <Link href="/tao-thiep" className={buttonVariants({ size: "sm" })}>
          Tạo thiệp miễn phí
        </Link>
      </div>
      <div
        className="flex items-center [grid-area:1/1]"
        {...(userHidden ? { inert: true, "aria-hidden": true } : {})}
        style={userHidden ? { visibility: "hidden" } : undefined}
      >
        <Link
          href="/dashboard"
          className={buttonVariants({ size: "sm", className: "gap-2 pl-1.5" })}
        >
          <Avatar initial={user ? userInitial(user) : "?"} />
          Vào bảng điều khiển
        </Link>
      </div>
    </div>
  );
}

/** Cụm nút cuối panel menu mobile; giữ chỗ cùng chiều cao khi đang tải. */
export function MobileAuthActions({ onNavigate }: { onNavigate: () => void }) {
  const { state, user } = useAuthState();

  if (state === "pending") {
    return (
      <div aria-hidden="true" className="mt-8 flex flex-col gap-3">
        <span className={buttonVariants({ size: "lg", className: "invisible w-full" })}>
          &nbsp;
        </span>
        <span
          className={buttonVariants({
            variant: "secondary",
            size: "lg",
            className: "invisible w-full",
          })}
        >
          &nbsp;
        </span>
      </div>
    );
  }

  if (state === "user" && user) {
    return (
      <div className="mt-8 flex flex-col gap-3">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className={buttonVariants({ size: "lg", className: "w-full gap-2" })}
        >
          <Avatar initial={userInitial(user)} />
          Vào bảng điều khiển
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-3">
      <Link
        href="/tao-thiep"
        onClick={onNavigate}
        className={buttonVariants({ size: "lg", className: "w-full" })}
      >
        Tạo thiệp miễn phí
      </Link>
      <Link
        href="/dang-nhap"
        onClick={onNavigate}
        className={buttonVariants({ variant: "secondary", size: "lg", className: "w-full" })}
      >
        Đăng nhập
      </Link>
    </div>
  );
}

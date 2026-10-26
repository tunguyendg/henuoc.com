"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createWedding, type CreateWeddingState } from "@/features/wedding/actions";

type Values = { brideName: string; groomName: string; weddingDate: string };

const EMPTY: Values = { brideName: "", groomName: "", weddingDate: "" };

function text(fd: FormData, key: keyof Values): string {
  const v = fd.get(key);
  return typeof v === "string" ? v : "";
}

export function CreateWeddingForm() {
  // React 19 tự reset form sau mỗi action → nhớ lại giá trị vừa gửi và trả về qua defaultValue,
  // để khi có lỗi người dùng không phải gõ lại từ đầu.
  const [values, setValues] = useState<Values>(EMPTY);

  const [state, formAction, isPending] = useActionState(
    async (prev: CreateWeddingState, fd: FormData) => {
      setValues({
        brideName: text(fd, "brideName"),
        groomName: text(fd, "groomName"),
        weddingDate: text(fd, "weddingDate"),
      });
      return createWedding(prev, fd);
    },
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Input
        label="Tên cô dâu"
        name="brideName"
        required
        maxLength={60}
        autoComplete="off"
        defaultValue={values.brideName}
        error={state?.errors?.brideName?.[0]}
      />
      <Input
        label="Tên chú rể"
        name="groomName"
        required
        maxLength={60}
        autoComplete="off"
        defaultValue={values.groomName}
        error={state?.errors?.groomName?.[0]}
      />
      <Input
        label="Ngày cưới"
        name="weddingDate"
        type="date"
        defaultValue={values.weddingDate}
        hint="Chưa chốt ngày thì để trống, sửa sau được"
        error={state?.errors?.weddingDate?.[0]}
      />
      {state?.message ? (
        <p role="alert" className="text-sm text-danger">
          {state.message}
        </p>
      ) : null}
      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "Đang tạo…" : "Tạo thiệp"}
      </Button>
    </form>
  );
}

"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { weddingSlug } from "@/lib/slug";
import { getMyWedding } from "@/lib/wedding-access";
import { createWeddingSchema } from "./schema";

export type CreateWeddingState =
  | {
      errors?: Partial<Record<"brideName" | "groomName" | "weddingDate", string[]>>;
      message?: string;
    }
  | undefined;

export async function createWedding(
  _prev: CreateWeddingState,
  formData: FormData,
): Promise<CreateWeddingState> {
  // 1. Action là endpoint công khai → tự kiểm đăng nhập, không dựa vào trang
  const user = await requireUser();

  // MVP: mỗi người 1 đám cưới
  const { wedding: existing } = await getMyWedding();
  if (existing) redirect("/dashboard");

  // 2. Không tin dữ liệu từ trình duyệt
  const parsed = createWeddingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { errors: z.flattenError(parsed.error).fieldErrors };
  const { brideName, groomName, weddingDate } = parsed.data;

  // 3–4. Thử slug gốc, trùng thì thêm đuôi ngẫu nhiên, tối đa 5 lần
  const base = weddingSlug(brideName, groomName);
  let created = false;
  for (let i = 0; i < 5 && !created; i++) {
    const slug = i === 0 ? base : `${base}-${Math.random().toString(36).slice(2, 6)}`;
    try {
      // "nested write": tạo Wedding + WeddingMember trong 1 câu → Prisma tự bọc transaction
      await db.wedding.create({
        data: {
          slug,
          themeSlug: "placeholder", // chọn mẫu ở bước sau, không nhận từ form
          brideName,
          groomName,
          weddingDate,
          members: { create: { userId: user.id, role: "OWNER" } },
        },
      });
      created = true;
    } catch (e) {
      // P2002 = vi phạm @unique (slug đã có người dùng) → thử slug khác. Lỗi khác → ném tiếp
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") continue;
      throw e;
    }
  }
  if (!created) return { message: "Chưa tạo được thiệp, thử lại sau ít phút nhé." };

  // 5. redirect() hoạt động bằng cách NÉM lỗi đặc biệt → phải gọi NGOÀI try/catch,
  //    đặt trong try thì catch nuốt mất, trang không chuyển.
  redirect("/dashboard");
}

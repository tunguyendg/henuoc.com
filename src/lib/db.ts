import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { serverEnv } from "@/lib/env.server";

// Dev: Next nạp lại code liên tục → mỗi lần lại tạo PrismaClient mới = mở thêm kết nối.
// Cất client vào globalThis để dùng lại → không làm cạn kết nối Supabase.
const globalForDb = globalThis as unknown as { db?: PrismaClient };

function createDb() {
  // App chạy qua pooler (cổng 6543): mỗi request mượn kết nối một lát rồi trả
  const adapter = new PrismaPg({ connectionString: serverEnv.DATABASE_URL });
  return new PrismaClient({ adapter });
}

export const db = globalForDb.db ?? createDb();
if (process.env.NODE_ENV !== "production") globalForDb.db = db;

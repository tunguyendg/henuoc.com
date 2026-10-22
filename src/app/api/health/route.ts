import { readFile } from "node:fs/promises";
import path from "node:path";
import { connection } from "next/server";
import { db } from "@/lib/db";

/**
 * Health check cho deploy smoke test + UptimeRobot.
 * `await connection()`: bắt chạy mỗi request (không prerender lúc build).
 */
export async function GET() {
  await connection();

  let revision = "dev";
  try {
    revision = (await readFile(path.join(process.cwd(), "REVISION"), "utf8")).trim();
  } catch {
    // Local dev không có file REVISION — bình thường.
  }

  // Hỏi DB một câu đơn giản nhất. Lỗi thì chỉ báo "error", KHÔNG trả chi tiết (có thể chứa host/user).
  let database: "ok" | "error" = "ok";
  try {
    await db.$queryRaw`SELECT 1`;
  } catch {
    database = "error";
  }

  return Response.json(
    { ok: database === "ok", database, revision, time: new Date().toISOString() },
    { status: database === "ok" ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}

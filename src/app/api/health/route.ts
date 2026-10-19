import { readFile } from "node:fs/promises";
import path from "node:path";
import { connection } from "next/server";

/**
 * Health check cho deploy smoke test + UptimeRobot.
 * Cache Components: GET handler mặc định được prerender lúc build →
 * `await connection()` bắt nó chạy mỗi request.
 * T-003 sẽ thêm kiểm tra DB (`SELECT 1`).
 */
export async function GET() {
  await connection();

  let revision = "dev";
  try {
    revision = (await readFile(path.join(process.cwd(), "REVISION"), "utf8")).trim();
  } catch {
    // Local dev không có file REVISION — bình thường.
  }

  return Response.json(
    { ok: true, revision, time: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } },
  );
}

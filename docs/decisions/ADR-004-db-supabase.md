# ADR-004 — Database: Supabase Postgres thay cho Neon

**Ngày:** 2026-10-22 · **Trạng thái:** Accepted · **Người quyết:** Tony · **Thay thế:** phần DB của ADR-001 (mục 7) và `00-PROJECT_CONTEXT.md` §8

## Bối cảnh
ADR-001 chọn Neon Postgres (Singapore). Khi làm T-003, Tony dựng DB trên **Supabase** (project đã có sẵn) và chạy
migration `init_auth` trên đó (commit `bd23f5b`). Trước đó `00-PROJECT_CONTEXT.md` ghi Supabase "chỉ thử nghiệm" vì
Free tier tự pause sau 7 ngày không hoạt động.

## Quyết định
1. **DB = Supabase Postgres**, region `ap-southeast-1` (Singapore). Code chỉ nói chuyện qua Prisma 7 + `@prisma/adapter-pg`,
   không dùng `@supabase/supabase-js`.
2. **Data API (PostgREST) tắt.** Không có đường đọc/ghi DB nào từ trình duyệt; mọi truy cập đi qua server
   (`src/lib/db.ts`, `server-only`). Không dựa vào RLS để bảo vệ dữ liệu, kiểm quyền ở service (AGENTS.md).
3. **Hai chuỗi kết nối:**
   - `DATABASE_URL` → Supavisor pooler **cổng 6543** (transaction mode) — app runtime.
   - `DIRECT_URL` → **cổng 5432** — chỉ Prisma CLI (`migrate dev` / `migrate deploy`, xem `prisma.config.ts`).
4. Không dùng tính năng riêng của Supabase (Auth, Storage, Realtime). Auth vẫn Better Auth, media vẫn R2 → đổi nhà
   cung cấp Postgres sau này chỉ là đổi 2 biến env.

## Hệ quả
- **Auto-pause Free tier:** UptimeRobot ping `/api/health` (có query DB) giữ DB hoạt động, nhưng không phải cam kết.
  **Trước launch phải quyết: lên gói Pro hoặc chấp nhận rủi ro.**
- **Backup:** không còn Neon PITR. Free tier không có backup tải về được → `pg_dump` hằng tuần ra R2 (T-064) là **bắt buộc**,
  không phải tuỳ chọn. PITR của Supabase là add-on trả phí.
- **Không có branching miễn phí:** dev dùng project Supabase riêng hoặc Postgres local (Docker); CI/integration test dùng
  Postgres service container của GitHub Actions.
- **Transaction mode (6543):** không giữ được state theo session (advisory lock, `LISTEN`, `SET` session). Migration luôn
  chạy qua `DIRECT_URL`.
- **IPv4:** host direct `db.<ref>.supabase.co` mặc định chỉ có IPv6. Nếu GitHub Actions / AZDIGI không ra được IPv6 →
  `DIRECT_URL` dùng **session pooler** (cùng host pooler, cổng 5432). Kiểm chứng ở T-006.

## Còn mở
Gói Supabase cho production (Free hay Pro) — quyết trước launch.

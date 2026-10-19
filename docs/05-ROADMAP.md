# 05 — Roadmap MVP

**Version:** 2.0 · 2026-10-19

**Ký hiệu:** 🟢 agent làm (Tony đọc diff) · 🔴 **Tony tự code** (agent chỉ giải thích/review) · ⚡ chạy song song được · `→` phụ thuộc

**Nguyên tắc:**
- Deploy **sớm** (cuối M0) và deploy **mỗi milestone** — học production bằng cách làm production liên tục.
- Mỗi task = 1 spec `docs/tasks/T-xxx-*.md` = 1 branch = 1 PR.
- Review theo milestone: cuối mỗi M, Claude review tổng + viết `docs/learning/Mx-*.md`.

## M0 — Nền móng *(mục tiêu: "Hello Hẹn Ước" chạy trên henuoc.com qua CI/CD)*

| ID | Task | Loại | Phụ thuộc |
|---|---|---|---|
| T-001 | Scaffold repo mới: Next 16, TS strict, Tailwind 4, ESLint, Prettier, cấu trúc thư mục theo AGENTS.md, script `typecheck/lint/test` | 🟢 | — |
| T-002 | `src/lib/env.ts` validate env bằng Zod + `.env.example` | 🔴 | T-001 |
| T-003 | Prisma 7 + Neon: `prisma.config.ts`, `lib/db.ts` singleton, `prisma/schema.prisma` chỉ gồm 4 bảng auth (copy từ `docs/reference/schema.prisma`), migration đầu | 🔴 | T-002 |
| T-004 | Design tokens (`globals.css`), font, UI primitives: Button, Input, Card, Badge, Container | 🟢 ⚡ | T-001 |
| T-005 | GitHub Actions CI: typecheck, lint, test, build trên PR | 🟢 ⚡ | T-001 |
| T-006 | **Deploy lần đầu** lên AZDIGI: `output: standalone`, workflow deploy rsync SSH, restart Passenger, SSL | 🔴 (cùng Claude) | T-005 |
| T-007 | Mang `public/brand/*` sang, tạo `CREDITS.md`, favicon/OG mặc định | 🟢 ⚡ | T-001 |

**Done khi:** push `main` → 5 phút sau thấy trang "Hẹn Ước — sắp ra mắt" trên `https://henuoc.com`, kết nối DB OK (`/api/health`).
📘 `docs/learning/M0-foundation.md`: App Router, Server vs Client Component, env & secret, Prisma client, standalone build, Passenger.

## M1 — Theme POC *(ưu tiên cao nhất về sản phẩm)*

| ID | Task | Loại | Phụ thuộc |
|---|---|---|---|
| T-010 | `themes/types.ts`, `registry.ts`, demo content, route `/demo/[slug]` | 🟢 | M0 |
| T-011 | `lib/lunar.ts` dương → âm (Hồ Ngọc Đức, UTC+7) + unit test ≥ 20 ngày đã biết | 🔴 | M0 |
| T-012 | `lib/vietqr.ts` EMVCo payload + CRC16 + unit test, bank list JSON | 🟢 ⚡ | M0 |
| T-013 | Primitives `_shared/`: useEnvelope, useMusic, useCountdown, AddToCalendar, MapButton, GiftQR, Reveal, Watermark | 🟢 | T-010 |
| T-014 | Spec + code theme `hong-pastel` | 🟢 ⚡ | T-013 |
| T-015 | Spec + code theme `song-hy` | 🟢 ⚡ | T-013 |
| T-016 | Spec + code theme `ban-tin` | 🟢 ⚡ | T-013 |
| T-017 | QA 3 theme theo checklist `07-THEMES.md §8`, sửa batch lỗi | 🟢 | T-014..16 |

**Done khi:** 5 người ngoài xem 3 demo trên điện thoại, ≥ 4 người nói "muốn dùng". AT-01 pass.
📘 `M1-themes.md`: composition, custom hooks, dynamic import, CSS scoping, next/font, reduced-motion, thuật toán âm lịch.

## M2 — Marketing & Gallery (SEO)

| ID | Task | Loại | Phụ thuộc |
|---|---|---|---|
| T-020 | Layout marketing: Header, Footer, mobile menu | 🟢 | M0 |
| T-021 | Homepage 10 section (`02-DESIGN_SYSTEM §5`), hero render theme thật | 🟢 | T-020, M1 |
| T-022 | Gallery + trang phong cách + chi tiết theme (demo iframe) | 🟢 ⚡ | T-020, M1 |
| T-023 | SEO base: `metadataBase`, `sitemap.ts`, `robots.ts`, OG động, JSON-LD | 🔴 | T-022 |
| T-024 | Bảng giá, FAQ, 3 landing tính năng | 🟢 ⚡ | T-020 |
| T-025 | Cẩm nang MDX (khung + 2 bài đầu) | 🟢 ⚡ | T-020 |

**Done khi:** Lighthouse mobile ≥ 90 SEO / ≥ 85 Perf trên homepage + gallery; sitemap đúng; Search Console đã verify + submit sitemap.
📘 `M2-seo.md`: SSG vs dynamic, `"use cache"`, generateMetadata, generateStaticParams, OG image runtime.

## M3 — Builder · Auth · Publish

| ID | Task | Loại | Phụ thuộc |
|---|---|---|---|
| T-030 | Tự gõ model wedding/event/media/gift từ `docs/reference/schema.prisma` vào `prisma/schema.prisma` (gõ để hiểu, không copy cả khối) + migration + seed | 🔴 | M0 |
| T-031 | Builder UI 8 bước + preview realtime + localStorage draft (zod `BuilderDraft`) | 🟢 | M1 |
| T-032 | Better Auth: Google + Email OTP (Resend), trang đăng nhập, `proxy.ts`, `getSession()` | 🔴 (cùng Claude) | T-030 |
| T-033 | `claimDraft` + wedding actions (CRUD, ownership) + test IDOR | 🔴 | T-030, T-032 |
| T-034 | Upload ảnh R2 presigned + resize client | 🟢 | T-033 |
| T-035 | Publish + `/w/[slug]` với cache tag | 🟢 | T-033 |

**Done khi:** AT-02, AT-06, AT-10 pass. Tạo đám cưới thật của chính Tony (dữ liệu mẫu) trên production.
📘 `M3-auth-data.md`: session cookie, OAuth flow, Server Actions bảo mật, ownership, presigned URL, revalidateTag.

## M4 — Khách mời & RSVP

| ID | Task | Loại | Phụ thuộc |
|---|---|---|---|
| T-040 | Schema invitation/group/rsvp + `lib/crypto.ts` (token, hash, AES-GCM) + test | 🔴 | M3 |
| T-041 | Dashboard Khách mời: bảng, thêm/sửa inline, nhóm, bên, mẫu danh xưng | 🟢 | T-040 |
| T-042 | Import CSV có preview lỗi từng dòng | 🟢 ⚡ | T-040 |
| T-043 | Copy link / tin nhắn mẫu / Zalo / đánh dấu đã gửi / thu hồi link | 🟢 ⚡ | T-041 |
| T-044 | `/i/[token]` + tracking mở link (`after()`) | 🟢 | T-040 |
| T-045 | `POST /api/rsvp` + rate limit Postgres + history | 🔴 | T-040 |
| T-046 | Dashboard RSVP: tổng theo sự kiện, ≈ số bàn, lọc, xuất CSV | 🟢 | T-045 |
| T-047 | Email thông báo RSVP gom ngày (cron) | 🟢 ⚡ | T-045 |

**Done khi:** AT-03, 04, 05, 07, 08, 09, 11, 13 pass. Test thật: 30 link gửi cho bạn bè → RSVP → dashboard đúng.
📘 `M4-rsvp.md`: Route Handler vs Server Action, transaction, upsert idempotent, rate limiting, crypto cơ bản.

## M5 — Dashboard · Checklist · Affiliate

| ID | Task | Loại | Phụ thuộc |
|---|---|---|---|
| T-050 | Checklist template (~40 việc) + dashboard checklist + tool public `/checklist-dam-cuoi` | 🟢 | M3 |
| T-051 | Tổng quan dashboard theo trạng thái + "Việc tuần này" | 🟢 | T-050, M4 |
| T-052 | `lib/accesstrade.ts` client có type + retry + rate limit 10/phút | 🔴 | M0 |
| T-053 | Admin: thêm sản phẩm từ URL Shopee, datafeeds/top_products, set plan wedding | 🟢 | T-052 |
| T-054 | Trang Mua sắm + gợi ý trong checklist + `/go/[id]` + log click | 🟢 | T-053 |
| T-055 | Cron sync conversions + báo cáo admin | 🟢 ⚡ | T-052 |
| T-056 | Cài đặt: thông tin, mời người cùng quản lý, xoá tài khoản | 🟢 ⚡ | M3 |

**Done khi:** AT-12 pass; ≥ 30 sản phẩm curated cho 6 danh mục; có click thật được ghi nhận trên ACCESSTRADE.
📘 `M5-integrations.md`: gọi API bên thứ 3 an toàn, retry/backoff, cron, idempotent sync.

## M6 — Launch

| ID | Task | Loại |
|---|---|---|
| T-060 | Playwright full AT-01 → AT-13 trong CI | 🟢 |
| T-061 | Thêm 7 theme (tổng 10) | 🟢 ⚡ |
| T-062 | 3 bài cẩm nang còn lại (tổng 5) | 🟢 ⚡ |
| T-063 | Điều khoản, Quyền riêng tư, Liên hệ | 🟢 ⚡ |
| T-064 | Backup (Neon PITR + dump tuần R2), UptimeRobot, log lỗi | 🔴 (cùng Claude) |
| T-065 | Beta 20 cặp đôi, thu feedback, fix batch | Tony |

**Done khi:** thước đo thành công MVP trong `00-PROJECT_CONTEXT §7` đạt.

## v2 (sau MVP)
payOS + paywall tự động · Sổ mừng cưới · Xem ngày cưới · Save the date · Thiệp cảm ơn · Sổ lưu bút · Khách upload ảnh · Ngân sách chi tiết · Import Excel nâng cao · Sắp xếp bàn · Slug/subdomain riêng · Umami analytics · Chuyển VPS + Docker khi cần.

## Lane song song gợi ý (2 agent)

```
          Agent A (Codex)                    Agent B (Claude Code)         Tony
M0   T-001 ─► T-004, T-007          T-005                        T-002 ─► T-003 ─► T-006
M1   T-012, T-013 ─► T-014          T-010 ─► T-015, T-016        T-011
M2   T-021, T-024                   T-020 ─► T-022, T-025        T-023
...
```

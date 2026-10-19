# Hẹn Ước — henuoc.com

SaaS thiệp cưới online cho người Việt: kho mẫu thiệp đẹp, thiệp mang tên từng khách, RSVP không cần đăng nhập, dashboard quản lý khách mời, checklist cưới có gợi ý mua sắm Shopee (affiliate ACCESSTRADE).

> **Trạng thái:** M0 — xong T-001 (scaffold), T-004 (design tokens + UI primitives), T-005 (CI). Tiếp theo: T-002, T-003 (🔴 Tony), T-006 (deploy).

## Stack

| Lớp | Công nghệ |
|---|---|
| App | Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS 4 |
| Data | PostgreSQL (Neon, Singapore) · Prisma 7 (`@prisma/adapter-pg`) · Zod |
| Auth | Better Auth — Google + Email OTP |
| File | Cloudflare R2 (presigned upload) |
| Email | Resend |
| Affiliate | ACCESSTRADE Publisher API (Shopee) |
| Thanh toán | payOS — **v2, chưa làm ở MVP** |
| Hosting | AZDIGI DirectAdmin "Setup Node.js App" (Passenger, Node 22) · `output: "standalone"` |
| CI/CD | GitHub Actions → build trên Ubuntu → rsync SSH → restart Passenger |

## Đọc theo thứ tự

| File | Nội dung |
|---|---|
| [`AGENTS.md`](AGENTS.md) | Luật bắt buộc cho mọi coding agent (Codex, Claude Code) |
| [`docs/00-PROJECT_CONTEXT.md`](docs/00-PROJECT_CONTEXT.md) | **Nguồn sự thật**: quyết định đã chốt / chưa chốt |
| [`docs/01-PRD.md`](docs/01-PRD.md) | Persona, user journey, scope MVP, acceptance tests |
| [`docs/02-DESIGN_SYSTEM.md`](docs/02-DESIGN_SYSTEM.md) | Brand tokens, page map (tham chiếu sayi.do), component rules |
| [`docs/03-ARCHITECTURE.md`](docs/03-ARCHITECTURE.md) | Route map, Prisma schema, bảo mật, caching |
| [`docs/04-GROWTH.md`](docs/04-GROWTH.md) | SEO, pricing, affiliate ACCESSTRADE |
| [`docs/05-ROADMAP.md`](docs/05-ROADMAP.md) | Milestone + task ID, phân loại 🟢 agent / 🔴 Tony |
| [`docs/06-DEPLOYMENT.md`](docs/06-DEPLOYMENT.md) | Local → AZDIGI Passenger → CI/CD, backup |
| [`docs/07-THEMES.md`](docs/07-THEMES.md) | Theme engine, theme spec template, QA checklist |
| `docs/decisions/` | ADR — mọi thay đổi hướng ghi tại đây |
| `docs/tasks/` | Spec từng task giao cho agent |
| `docs/reference/schema.prisma` | Schema đích của MVP (đã validate Prisma 7) — áp dụng dần theo milestone |
| `scripts/deploy/` | Script activate / rollback upload lên host |
| `docs/learning/` | Ghi chú học theo milestone |

## Chạy local

```bash
node -v                        # cần >= 22 (xem .nvmrc)
npm ci
npm run dev                    # http://localhost:3000  ·  UI kit: http://localhost:3000/ui
```

Từ T-003 trở đi: `cp .env.example .env.local`, điền `DATABASE_URL` (Neon branch dev) rồi `npx prisma migrate dev`.

Thử bản production giống trên host:

```bash
npm run build
cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/
npm start                      # = node .next/standalone/server.js
curl localhost:3000/api/health
```

## Lệnh kiểm tra trước khi merge

```bash
npm run typecheck && npm run lint && npm run test && npm run build
```

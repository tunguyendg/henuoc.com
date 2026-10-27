<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — Luật làm việc cho coding agent

Áp dụng cho **mọi** agent (Codex, Claude Code, Cursor…). Trái với file này = task bị reject.

## 0. Trước khi code

1. Đọc `docs/00-PROJECT_CONTEXT.md` và spec task được giao trong `docs/tasks/T-xxx-*.md`.
2. Chỉ làm đúng scope trong spec. Thấy việc khác cần làm → ghi vào mục "Ghi chú cho reviewer" của PR, **không tự làm**.
3. Nếu spec mâu thuẫn với docs → dừng, báo lại. Không tự đoán.
4. Không đọc / dùng hướng thiết kế cũ (tím `#6255E8`, burgundy `#9B5C64`, coral `#E3707C`, rose trầm `#BD6477`, logo chữ Ư). Brand hiện hành: **Hồng Cưới `#E8436A` + Vàng Nhẫn `#F6C76B`, logo Nhẫn Tim** (xem `docs/02-DESIGN_SYSTEM.md`, ADR-003).

## 1. Stack — không tự thêm thư viện

Next.js 16 App Router · React 19 · TypeScript strict · Tailwind 4 · Prisma 7 + `@prisma/adapter-pg` · Zod · Better Auth · Motion · lucide-react · Vitest · Playwright.

- Thêm dependency mới **chỉ khi spec cho phép**. Pin version chính xác (không `latest`, không `^` cho package runtime quan trọng).
- Không dùng: UI kit nặng (MUI, Chakra), state lib toàn cục (Redux, Zustand) trừ khi spec yêu cầu, ORM khác, CSS-in-JS.

## 2. Cấu trúc thư mục

```
src/
  app/                     # chỉ routing + composition; không đặt business logic
    (marketing)/  (auth)/  (app)/dashboard/  (public)/thiepcuoi/[slug]  (public)/thiepcuoi/[slug]/[token]  (thiep)/demo/[slug]
    api/                   # chỉ: RSVP public, auth handler, webhook, /go redirect
  components/ui/           # primitive (Button, Input, Card…) — không biết domain
  components/<feature>/    # component theo feature
  features/<feature>/      # actions.ts, queries.ts, schema.ts (zod), service.ts
                           # + types.ts (DTO rời server), repo.ts (interface), mock-repo.ts / prisma-repo.ts (bản cài)
  features/repos.ts        # nơi DUY NHẤT chọn bản cài (mock ↔ prisma), server-only
  themes/<theme-slug>/     # mỗi theme 1 folder, xem docs/07-THEMES.md
  data/                    # dữ liệu tĩnh có type (themes, features, faq, articles, banks) — nguồn cho trang + sổ SEO
  content/<section>/       # MDX chỉ chứa thân bài; metadata nằm ở data/
  app/(dev)/               # trang nội bộ khi dev, notFound() ở production
  lib/                     # db.ts, auth.ts, r2.ts, accesstrade.ts, lunar.ts, utils
prisma/schema.prisma
tests/  e2e/
```

## 3. Quy tắc code

- **Server Component mặc định.** Chỉ thêm `"use client"` cho component cần state/event/browser API. Đẩy `"use client"` xuống lá thấp nhất có thể.
- **Mutation = Server Action** trong `features/*/actions.ts`. Mỗi action: (1) parse input bằng Zod, (2) lấy session, (3) **kiểm tra ownership** (`wedding.ownerId === session.user.id`), (4) gọi service, (5) `updateTag()` (Server Action) — `revalidateTag(tag, "max")` chỉ dùng trong Route Handler/cron.
- **Không truy vấn Prisma trực tiếp trong component.** Đi qua `features/*/queries.ts`, mọi query owner-side phải lọc theo `ownerId`.
- **Repository:** UI/queries chỉ gọi `repos.*` từ `features/repos.ts`, không import `*-repo.ts` trực tiếp. DTO trong `types.ts` map từng field (không `...row`), không bao giờ có token/tokenHash/tokenCipher/phone/email khách. Kiểm ownership (session ↔ `WeddingMember`) là bắt buộc trước khi dùng bản Prisma.
- Không `any`. Không `// @ts-ignore`. Không tắt rule ESLint.
- Tên file kebab-case; component PascalCase; hàm camelCase. UI text tiếng Việt, code + comment tiếng Anh.
- Ngày giờ lưu UTC trong DB, hiển thị `Asia/Ho_Chi_Minh`.
- Tiền tệ lưu số nguyên VND.
- **Ảnh trong `public/images/` là của Tony.** Agent KHÔNG chép, tạo, ghi đè hay xoá file trong đó (kể cả chép ảnh bài cũ sang bài mới cho test xanh). Ảnh cẩm nang mới: chỉ thêm entry vào `src/content/cam-nang/images.json` với ảnh Unsplash chưa dùng trong dự án; thiếu mạng hoặc chưa tìm được ảnh → để trống, báo Tony, Tony chạy `npm run images:cam-nang` (docs/11-ARTICLE-IMAGES.md).

## 4. Bảo mật & riêng tư — không thương lượng

- Token thiệp riêng: `crypto.randomBytes(24).toString("base64url")`. DB lưu `tokenHash` (SHA-256, để tra cứu) + `tokenCipher` (AES-256-GCM, để dashboard hiện lại link). Không bao giờ lưu token thô, không log token. Dùng helper trong `src/lib/crypto.ts`.
- `/thiepcuoi/*`, `/dashboard/*`, trang draft: `robots: { index: false, follow: false }` + **không có trong sitemap**.
- Không đưa tên khách, SĐT, token vào: analytics, OG image, `<title>`, URL query, log.
- RSVP endpoint có rate limit + validate `attendeeCount <= invitation.maxAttendees`.
- Không bao giờ commit `.env*` (trừ `.env.example`), file build, `*.tar.gz`, `*.zip`.
- Không hiển thị số liệu bịa (số khách hàng, rating, review) ở bất kỳ đâu.
- Không claim "đã gửi" / "đã đọc" khi chỉ có copy link. Trạng thái gửi do user tự đánh dấu.

## 5. Git

- Làm và commit thẳng `main` (Tony chọn quy trình đơn giản). Không branch/PR trừ khi Tony yêu cầu.
- Commit nhỏ, Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`). **Chỉ `git push` khi Tony đồng ý.**
- 2 agent chạy song song không được sửa cùng file; cần song song thật thì dùng git worktree riêng.
- Báo cáo mỗi việc: *Đã làm · Cách test · Ghi chú · Kiến thức đáng chú ý*. Đội agent & quyền: `docs/09-AGENTS.md`.

## 6. Definition of Done (mọi task)

```bash
npm run typecheck && npm run lint && npm run test && npm run build
```
- Pass hết 4 lệnh. UI: chụp màn hình mobile 390px + desktop 1280px.
- Không có `console.log` thừa. Không file rác.
- Cập nhật docs nếu thay đổi schema, route, env var (`.env.example`).
- Mục **"Kiến thức đáng chú ý"** trong báo cáo: 3–5 gạch đầu dòng giải thích khái niệm Next/React/Node quan trọng đã dùng (Tony đang học — viết ngắn, cụ thể, gắn với code vừa viết).

## 7. Task 🔴 (Tony tự code)

Task gắn 🔴 trong roadmap: agent **không viết code hoàn chỉnh**. Chỉ được: giải thích, đưa pseudo-code, review code Tony viết, chỉ ra bug. Nếu được gọi vào task 🔴 → hỏi lại trước khi viết code.

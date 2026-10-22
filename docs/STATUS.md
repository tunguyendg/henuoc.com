# STATUS — bảng tình hình dự án

> Tổng chỉ huy (Claude Code) cập nhật file này sau mỗi việc. Tony đọc file này hoặc gõ `/bao-cao`.
> Cập nhật lần cuối: 2026-10-22 (T-010 xong: typecheck ✅ · lint ✅ · format ✅ · test 190/190 · build ✅)

## Đang ở đâu

**Hướng hiện tại:** dựng frontend MVP trên local trước (chưa backend), rồi mới M0 backend + deploy.

## ✅ Đã xong

- T-002 `env.client.ts` / `env.server.ts` + `server-only` (Tony code 🔴) · test `env.client.test.ts` (4) + `env.server.test.ts` (3) · T-003 Prisma 7 + Supabase (Tony code 🔴): `prisma.config.ts`, schema auth + migration `init_auth`, `src/lib/db.ts`, `/api/health`, DATABASE_URL bắt buộc (`startsWith("postgres")`) · T-001 scaffold Next 16 · T-004 design tokens + UI primitives · T-005 CI (push main) · T-007 brand
- Brand v3 "Nhẫn Tim" (ADR-003), favicon / apple-icon
- Trang chủ đủ section + ảnh cưới thật (`public/images/wedding/`, Unsplash License)
- Sổ SEO `src/lib/seo/pages.ts`: metadata, canonical, breadcrumb, related links, sitemap, robots, test (docs/08-SEO.md)
- Trang Mẫu thiệp: `/mau-thiep-cuoi`, `/mau-thiep-cuoi/phong-cach/[style]`, `/mau-thiep-cuoi/[slug]`
- Đội agent Claude Code: `.claude/agents/`, `.claude/skills/` (docs/09-AGENTS.md)
- T-024 (một phần) `/tinh-nang` + 4 trang con (rsvp, quan-ly-khach-moi, loi-moi-rieng, checklist-dam-cuoi), menu trỏ `/tinh-nang`
- T-024 phần 2: `/bang-gia` (Miễn phí / Cao cấp "Sắp công bố"), `/cau-hoi-thuong-gap` (FAQPage, nguồn `src/data/faq.ts`), `/gioi-thieu`, `/chinh-sach-bao-mat` + `/dieu-khoan` (DỰ THẢO, noindex), footer
- T-025 Cẩm nang: `@next/mdx` (Tony duyệt), `/cam-nang` + `/cam-nang/[slug]`, 2 bài (cách ghi thiệp cưới, lời mời đám cưới hay), JSON-LD Article; MDX ở `src/content/cam-nang`, metadata ở `src/data/articles.ts`
- Liên hệ = email `hotro@henuoc.com` (Tony chốt 2026-10-22): `/lien-he` thật, nút Cao cấp → mailto, trang pháp lý/FAQ ghi email. Giá: 2 gói Miễn phí / Cao cấp (docs D8, GROWTH, PRD, DESIGN_SYSTEM, enum `Plan` FREE/PREMIUM)
- T-012 VietQR: `src/lib/vietqr.ts` (payload EMVCo + CRC16) + `src/data/banks.{json,ts}` (23 ngân hàng NAPAS, freeze), 26 test
- T-010 khung theme engine: `src/themes/types.ts` (contract), `registry.ts` (dynamic import, memo, safeParse options), `_demo/content.ts`, theme `placeholder` (draft), route `/demo/[slug]` noindex — draft chỉ xem ở dev, production 404

## 🔨 Đang làm

- (trống)

## ⏭️ Tiếp theo (frontend)

1. T-013 primitives `src/themes/_shared/` → T-015/T-016 theme thật (hong-pastel, song-hy)
2. Cẩm nang thêm bài (PRD: ≥ 5 bài khi launch) — bài 3 "lễ vu quy, thành hôn, tân hôn" link từ bài ghi thiệp
3. Mock builder `/tao-thiep` + dashboard (dữ liệu localStorage)

## ⏭️ Sau đó (backend — phần lớn 🔴 Tony tự code)

- 🔴 T-006 deploy AZDIGI (cần SSH host/port + DNS)

## ⚠️ Rủi ro / bảo mật đang theo dõi

- DATABASE_URL đã bắt buộc: secret chỉ nằm trong `env.server.ts` (server-only). Tuyệt đối không đặt tên `NEXT_PUBLIC_DATABASE_URL`. Client Component chỉ được import `env.client.ts`. Build/CI phải có DATABASE_URL.

- `NEXT_PUBLIC_ALLOW_INDEXING` để trống (noindex toàn site). Chỉ bật ngày launch.
- Contract theme (`src/themes/types.ts`): `qrSvg` chỉ sinh ở server, không lưu DB, render bằng `<img data:…>`; URL (map/ảnh/nhạc) zod ép https + allowlist; không truyền cả object `guest` (có token) xuống Client Component; cấm `dangerouslySetInnerHTML` trong `src/themes/**`.
- Ảnh demo là JPG 1600px (~100–500KB) → theme thật cần bản WebP tối ưu để đạt ngân sách 600KB trang đầu (07-THEMES §8).
- Slug mẫu sai trả 200 + noindex (giới hạn Cache Components) — chấp nhận.
- VietQR chứa STK dạng rõ: không đưa payload/STK vào URL, title, OG, log, analytics; chỉ render ở `/thiepcuoi/*` noindex. Server Action nhận `bankBin` phải check `findBankByBin` (đừng tin dropdown).
- `/tinh-nang/checklist-dam-cuoi` dùng keyword "lên kế hoạch đám cưới" để chừa "checklist đám cưới" cho công cụ `/checklist-dam-cuoi` (PRD F1).
- Trang pháp lý là dự thảo, `index: false` — Tony duyệt nội dung trước launch; khi đổi kiến trúc dữ liệu phải sửa chính sách cho khớp.
- Nâng cấp Cao cấp qua email + chuyển khoản tay: PHẢI công bố điều khoản chính thức + chính sách hoàn tiền trước khi nhận tiền.
- Xoá dữ liệu qua email: chỉ xoá sau khi chủ tài khoản bấm xác nhận qua email đăng nhập (header From giả được).
- `hotro@henuoc.com` công khai → bật lọc spam, không dùng làm email admin/đăng nhập dịch vụ nào.
- Chưa có backend → chưa có bề mặt tấn công dữ liệu. Khi làm M3/M4: IDOR, token khách, rate limit RSVP là ưu tiên.

## 🧭 Quyết định chờ Tony

- Chống IDOR khi thay mock bằng Prisma: (A) `service.ts` có `requireWeddingAccess(session, weddingId)` trả kiểu branded `AuthorizedWeddingId`, repo chỉ lọc weddingId (khuyên dùng) hay (B) mọi method repo nhận `ctx: { userId }` và tự lọc `members.some.userId`? Phải chốt trước khi viết `prisma-repo.ts`.

- Gói Supabase cho production: Free (auto-pause 7 ngày, không backup) hay Pro? Quyết trước launch (ADR-004).
- Thêm mục menu "Công cụ" (checklist public) khi có `/checklist-dam-cuoi`? (mặc định: có)

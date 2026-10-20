# STATUS — bảng tình hình dự án

> Tổng chỉ huy (Claude Code) cập nhật file này sau mỗi việc. Tony đọc file này hoặc gõ `/bao-cao`.
> Cập nhật lần cuối: 2026-10-20 (test 161/161)

## Đang ở đâu

**Hướng hiện tại:** dựng frontend MVP trên local trước (chưa backend), rồi mới M0 backend + deploy.

## ✅ Đã xong

- T-002 `src/lib/env.ts` (Tony code 🔴) + `env.test.ts` 4 case (stubEnv/resetModules) · T-001 scaffold Next 16 · T-004 design tokens + UI primitives · T-005 CI (push main) · T-007 brand
- Brand v3 "Nhẫn Tim" (ADR-003), favicon / apple-icon
- Trang chủ đủ section + ảnh cưới thật (`public/images/wedding/`, Unsplash License)
- Sổ SEO `src/lib/seo/pages.ts`: metadata, canonical, breadcrumb, related links, sitemap, robots, test (docs/08-SEO.md)
- Trang Mẫu thiệp: `/mau-thiep-cuoi`, `/mau-thiep-cuoi/phong-cach/[style]`, `/mau-thiep-cuoi/[slug]`
- Đội agent Claude Code: `.claude/agents/`, `.claude/skills/` (docs/09-AGENTS.md)
- T-024 (một phần) `/tinh-nang` + 4 trang con (rsvp, quan-ly-khach-moi, loi-moi-rieng, checklist-dam-cuoi), menu trỏ `/tinh-nang`
- T-024 phần 2: `/bang-gia` (Miễn phí / Cao cấp "Sắp công bố", nút "Sắp mở"), `/cau-hoi-thuong-gap` (FAQPage, nguồn `src/data/faq.ts`), `/gioi-thieu`, `/chinh-sach-bao-mat` + `/dieu-khoan` (DỰ THẢO, noindex), footer
- T-012 VietQR: `src/lib/vietqr.ts` (payload EMVCo + CRC16) + `src/data/banks.{json,ts}` (23 ngân hàng NAPAS, freeze), 26 test

## 🔨 Đang làm

- (trống)

## ⏭️ Tiếp theo (frontend)

1. Cẩm nang (MDX — chờ Tony duyệt dependency) — 2 bài đầu: cách ghi thiệp cưới, lời mời đám cưới hay
2. Mock builder `/tao-thiep` + dashboard (dữ liệu localStorage)

## ⏭️ Sau đó (backend — phần lớn 🔴 Tony tự code)

- 🔴 T-003 Prisma + Neon · 🔴 T-006 deploy AZDIGI (cần SSH host/port + DNS)

## ⚠️ Rủi ro / bảo mật đang theo dõi

- **Phải xử lý trước T-003:** `env.ts` bị kéo vào client bundle (`mobile-nav.tsx` "use client" → `site.ts` → `env.ts`). Hiện vô hại (DATABASE_URL không được inline), nhưng khi DATABASE_URL bắt buộc sẽ throw trên trình duyệt. Sửa: tách `env.client.ts` / `env.server.ts` (+ `server-only`, cần duyệt dep), đưa `mainNav` ra file không import env. Tuyệt đối không đặt tên `NEXT_PUBLIC_DATABASE_URL`.

- `NEXT_PUBLIC_ALLOW_INDEXING` để trống (noindex toàn site). Chỉ bật ngày launch.
- Slug mẫu sai trả 200 + noindex (giới hạn Cache Components) — chấp nhận.
- VietQR chứa STK dạng rõ: không đưa payload/STK vào URL, title, OG, log, analytics; chỉ render ở `/thiepcuoi/*` noindex. Server Action nhận `bankBin` phải check `findBankByBin` (đừng tin dropdown).
- `/tinh-nang/checklist-dam-cuoi` dùng keyword "lên kế hoạch đám cưới" để chừa "checklist đám cưới" cho công cụ `/checklist-dam-cuoi` (PRD F1).
- Trang pháp lý là dự thảo, `index: false` — Tony duyệt nội dung trước launch; khi đổi kiến trúc dữ liệu phải sửa chính sách cho khớp.
- `/lien-he` vẫn placeholder → chưa có kênh hỗ trợ; mọi trang đang ghi "công bố khi ra mắt".
- Chưa có backend → chưa có bề mặt tấn công dữ liệu. Khi làm M3/M4: IDOR, token khách, rate limit RSVP là ưu tiên.

## 🧭 Quyết định chờ Tony

- Thêm mục menu "Công cụ" (checklist public) khi có `/checklist-dam-cuoi`? (mặc định: có)

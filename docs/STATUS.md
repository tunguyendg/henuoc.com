# STATUS — bảng tình hình dự án

> Tổng chỉ huy (Claude Code) cập nhật file này sau mỗi việc. Tony đọc file này hoặc gõ `/bao-cao`.
> Cập nhật lần cuối: 2026-10-20 (/bao-cao: typecheck ✅ · lint ✅ · test 87/87)

## Đang ở đâu

**Hướng hiện tại:** dựng frontend MVP trên local trước (chưa backend), rồi mới M0 backend + deploy.

## ✅ Đã xong

- T-001 scaffold Next 16 · T-004 design tokens + UI primitives · T-005 CI (push main) · T-007 brand
- Brand v3 "Nhẫn Tim" (ADR-003), favicon / apple-icon
- Trang chủ đủ section + ảnh cưới thật (`public/images/wedding/`, Unsplash License)
- Sổ SEO `src/lib/seo/pages.ts`: metadata, canonical, breadcrumb, related links, sitemap, robots, test (docs/08-SEO.md)
- Trang Mẫu thiệp: `/mau-thiep-cuoi`, `/mau-thiep-cuoi/phong-cach/[style]`, `/mau-thiep-cuoi/[slug]`
- Đội agent Claude Code: `.claude/agents/`, `.claude/skills/` (docs/09-AGENTS.md)

## 🔨 Đang làm

- (trống)

## ⏭️ Tiếp theo (frontend)

1. `/tinh-nang` + 4 landing page tính năng (RSVP, quản lý khách, lời mời riêng, checklist)
2. Cẩm nang (MDX) — 2 bài đầu: cách ghi thiệp cưới, lời mời đám cưới hay
3. Bảng giá, FAQ, giới thiệu / liên hệ / chính sách
4. Mock builder `/tao-thiep` + dashboard (dữ liệu localStorage)

## ⏭️ Sau đó (backend — phần lớn 🔴 Tony tự code)

- 🔴 T-002 `lib/env.ts` · 🔴 T-003 Prisma + Neon · 🔴 T-006 deploy AZDIGI (cần SSH host/port + DNS)

## ⚠️ Rủi ro / bảo mật đang theo dõi

- Chưa launch → `NEXT_PUBLIC_ALLOW_INDEXING` để trống (noindex toàn site). Chỉ bật ngày launch.
- Slug mẫu sai trả 200 + noindex (giới hạn Cache Components) — chấp nhận.
- Chưa có backend → chưa có bề mặt tấn công dữ liệu. Khi làm M3/M4: IDOR, token khách, rate limit RSVP là ưu tiên.

## 🧭 Quyết định chờ Tony

- Menu "Tính năng" đổi thành trang `/tinh-nang` thật + thêm mục "Công cụ"? (mặc định: có)

# ADR-001 — Rebuild v2: hợp nhất hướng đi

**Ngày:** 2026-10-19 · **Trạng thái:** Accepted · **Người quyết:** Tony

## Bối cảnh
Từ 15–16/10/2026, docs bị viết qua 4 lần đổi hướng (Modern Romance burgundy → SaaS tím → Rose Say I do → visual-reference coral). 13 file mâu thuẫn về màu, logo, cách làm việc. Repo `henuoc.com` chỉ có frontend localStorage, chưa có DB/auth.

## Quyết định
1. Repo mới `tunguyendg/henuoc.com`; repo cũ archive. Chỉ mang sang `public/brand/*`.
2. Gộp docs thành `00`→`07` + ADR. Docs cũ xoá khỏi repo mới (vẫn còn trong repo cũ để tra cứu).
3. Brand: Rose `#BD6477` (brand) + `#A84E63` (nền nút, đạt WCAG AA). Bỏ `#6255E8`, `#9B5C64`, `#E3707C`.
4. Bỏ toàn bộ số liệu giả trong visual-reference (10.000+, 98%, 4.9/5).
5. Mô hình hybrid `/w/[slug]` + `/i/[token]`.
6. MVP thêm: lịch âm, VietQR mừng cưới, vu quy/thành hôn, nhà trai/nhà gái, checklist có affiliate.
7. Stack: Next 16, Prisma 7, Neon Postgres Singapore (→ Supabase, xem ADR-004), Better Auth, R2, Resend.
8. Hosting: AZDIGI Passenger (thay cho đề xuất VPS + Docker ban đầu), build trên GitHub Actions.
9. Cách làm: từ "một bước nhỏ, đợi user báo" → **task spec + branch + PR + review theo milestone**, agent song song.
10. v2: payOS, sổ mừng cưới, xem ngày cưới.

## Hệ quả
- Không có Redis/queue → rate limit & job dùng Postgres + DirectAdmin cron.
- `images.unoptimized` → ảnh phải tối ưu sẵn trước khi upload.
- Supabase không dùng cho production (auto-pause Free).
- Mọi thay đổi hướng sau này: tạo `ADR-00x`, rồi cập nhật `00-PROJECT_CONTEXT.md`.

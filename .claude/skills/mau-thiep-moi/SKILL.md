---
name: mau-thiep-moi
description: Tạo 1 mẫu thiệp cưới mới từ ảnh tham khảo Tony gửi — viết spec, chờ Tony duyệt, rồi dựng theme. Dùng khi Tony gõ /mau-thiep-moi.
argument-hint: "[tên mẫu, vd hoa-anh-dao] + dán 2–3 ảnh tham khảo"
disable-model-invocation: true
---

Mẫu: $ARGUMENTS

Đọc trước: `docs/07-THEMES.md` (nhất là mục "Trải nghiệm khách" và checklist QA §8), `src/themes/types.ts`, `src/themes/_shared/`.

## Pha 1 — SPEC (dừng chờ Tony duyệt)
1. Phân tích ảnh tham khảo: bố cục, nhịp khoảng trắng, kiểu chữ, màu, hoạ tiết, chuyển động.
2. Viết `docs/themes/<slug>.md`: tên, phong cách, bảng màu (hex), font (Google Fonts có tiếng Việt), từng phần trong hành trình 8 phần trông thế nào, chuyển động, ảnh demo dùng ảnh nào.
3. Mục **"Không chép"**: ghi rõ chỉ học bố cục/cảm giác; hoạ tiết, ảnh, chữ phải là của mình.
4. **DỪNG**. Hỏi Tony: duyệt / sửa gì. Chưa viết code.

## Pha 2 — DỰNG (sau khi Tony nói ok)
5. Theme trong `src/themes/<slug>/`, dùng primitives `_shared/` (phong bì, nhạc, đếm ngược, RSVP, mừng cưới…). Đăng ký registry với status `draft`; thêm vào `src/data/themes.ts` status `concept`.
6. Luật bắt buộc: nhạc chỉ phát sau cú chạm mở phong bì; số tài khoản/QR chỉ trong bottom sheet "Gửi quà mừng"; tôn trọng `prefers-reduced-motion`; không tràn ngang ở 390px; chữ đủ tương phản.
7. Chạy `code-reviewer` + `security-reviewer`, DoD đầy đủ. Commit `feat(theme): <slug>`. Không push.

Báo Tony: link `/demo/<slug>`, checklist QA §8 (đạt/chưa), 3 chỗ Tony nên xem kỹ trên điện thoại.
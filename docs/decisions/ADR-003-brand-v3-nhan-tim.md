# ADR-003 — Brand v3: Nhẫn Tim, Hồng Cưới, link /thiepcuoi

**Ngày:** 2026-10-20 · **Trạng thái:** Accepted · **Người quyết:** Tony · **Thay thế:** ADR-002

## Bối cảnh
Khách hàng chính là các cặp đôi **trẻ, năng động**, thích dùng cái mới và **tự hào khi gửi thiệp cho bạn bè, người thân**. Yêu cầu: **nhìn là biết đám cưới**.
- Logo chữ Ư (ADR-002) và Tơ Hồng đẹp nhưng phải giải thích mới hiểu → trượt yêu cầu.
- Rose trầm `#BD6477` + font có chân Playfair cho cảm giác sang nhưng già.
- Khi gửi qua Zalo, người nhận thấy **link + ảnh preview** trước khi thấy logo → brand phải nằm cả trong URL và ảnh OG.

Đã so sánh: Nhẫn Kim Cương, Nhẫn Tim, Song Hỷ hiện đại, Nhẫn đôi, Phong thư + nhẫn (canvas "Hẹn Ước — Nhận diện thương hiệu").

## Quyết định
1. **Logo Nhẫn Tim**: nhẫn cưới trắng đội trái tim Vàng Nhẫn, trong ô vuông bo góc Hồng Cưới. Một hình duy nhất cho header, footer, favicon, app icon.
2. **Màu**: Hồng Cưới `#E8436A` (logo, chữ lớn) · nút `#D6335C` (AA 4.7) · hover/eyebrow `#C92A53` · Vàng Nhẫn `#F6C76B` · Mận Đậm `#2B1B30` (chữ) · nền `#FFF8F9`.
3. **Chữ**: toàn bộ UI thương hiệu dùng **Be Vietnam Pro**, tiêu đề 800, letter-spacing âm. Logo chữ **"Hẹn Ước"** viết hoa chữ cái đầu. Playfair chỉ còn trong thiệp minh hoạ / theme (`font-serif`).
4. **URL thiệp**: `/thiepcuoi/[slug]` (chung) và `/thiepcuoi/[slug]/[token]` (riêng), thay cho `/w/[slug]` và `/i/[token]`. Slug = tên cặp đôi viết liền không dấu (`minhanh-hoangnam`). Slug chỉ để đọc; bảo mật vẫn dựa trên token ngẫu nhiên.
5. **Song Hỷ** không làm logo, giữ làm hoạ tiết cho mẫu thiệp truyền thống.

## Hệ quả
- Token màu đổi giá trị nhưng giữ tên `rose-*` → component không phải sửa.
- Tiêu đề trong code: `font-display font-extrabold tracking-[-0.03em]`.
- Cần ảnh OG động cho `/thiepcuoi/*` (làm ở giai đoạn trang thiệp): nền Hồng Cưới + nhẫn + tên cặp đôi + ngày, **không có tên khách**.
- Route dashboard / API / RSVP dùng `/thiepcuoi/...` (đã cập nhật docs 00, 01, 03, 04, 05, 07, AGENTS).

## Còn mở
Kiểm tra trùng nhãn hiệu trước khi in ấn / đăng ký. Có thể vẽ riêng wordmark sau.

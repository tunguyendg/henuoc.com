# 01 — PRD (MVP)

**Version:** 2.0 · 2026-10-19 · Phạm vi: **MVP** (v1). Thứ gì không có trong file này = không làm ở MVP.

## 1. Persona

| Persona | Nhu cầu | Đau |
|---|---|---|
| **Cặp đôi sắp cưới** (25–32 tuổi, dùng điện thoại, Zalo) | Thiệp đẹp, làm nhanh, gửi đúng người, biết ai đến | Thiệp giấy đắt, thiệp ảnh không biết ai đến, excel khách mời rối giữa nhà trai/nhà gái |
| **Khách mời** (mọi lứa tuổi, nhiều người lớn tuổi) | Mở là xem, biết giờ/địa điểm, chỉ đường, xác nhận nhanh | Phải đăng nhập, chữ nhỏ, nhạc tự bật ồn ào |
| **Phụ huynh** (gián tiếp) | Thiệp trang trọng, đúng xưng hô, có tên ông bà | Thiệp "trẻ trâu", sai vai vế |

## 2. User journey MVP

```
Google / Zalo / bạn bè
  → Trang mẫu thiệp (SEO) → xem demo thật
  → "Dùng mẫu này" → Builder (KHÔNG cần đăng nhập, nháp localStorage)
  → Bấm "Lưu & chia sẻ" → Đăng nhập Google / Email OTP → nháp chuyển lên DB
  → Publish → có link /thiepcuoi/[slug]
  → Thêm khách (tay hoặc CSV) → mỗi khách 1 link /thiepcuoi/[slug]/[token]
  → Copy tin nhắn mẫu → dán Zalo → tự đánh dấu "Đã gửi"
  → Khách mở thiệp → RSVP
  → Dashboard: ai đến, bao nhiêu người, ≈ bao nhiêu bàn, xuất CSV
  → Checklist cưới → gợi ý Shopee theo từng việc
```

## 3. Scope chức năng MVP

### F1. Marketing site (SEO)
- Homepage (cấu trúc ở `02-DESIGN_SYSTEM.md` §5).
- `/mau-thiep-cuoi` gallery + lọc theo phong cách; `/mau-thiep-cuoi/[slug]` chi tiết theme có **demo tương tác thật** với dữ liệu mẫu.
- `/mau-thiep-cuoi/phong-cach/[style]` landing theo phong cách.
- Landing tính năng: `/thiep-cuoi-online`, `/thiep-cuoi-gui-zalo`, `/thiep-cuoi-co-ten-khach`.
- `/bang-gia`, `/cau-hoi-thuong-gap`.
- `/cam-nang` + `/cam-nang/[slug]` (MDX trong repo, ≥ 5 bài khi launch).
- `/checklist-dam-cuoi` công cụ public (không cần đăng nhập, SEO) — dùng chung data với checklist dashboard.

### F2. Builder (tạo thiệp)
- Không cần đăng nhập để thử. Nháp lưu `localStorage`, nút "Lưu & chia sẻ" mới yêu cầu đăng nhập.
- Layout: form bên trái (desktop) / tab dưới (mobile) + **preview điện thoại realtime**.
- Các bước (progressive disclosure, không bắt điền hết):
  1. **Cặp đôi**: tên cô dâu, chú rể, tên gọi hiển thị, thứ tự hiển thị (nữ trước / nam trước).
  2. **Gia đình**: tên bố mẹ hai bên (tuỳ chọn), địa chỉ nhà trai / nhà gái.
  3. **Sự kiện**: 1–4 sự kiện, mỗi sự kiện: loại (`VU_QUY | THANH_HON | TAN_HON | AN_HOI | TIEC`), bên (`NHA_TRAI | NHA_GAI | CHUNG`), ngày giờ, địa điểm, link Google Maps. Tự hiển thị **ngày âm lịch**.
  4. **Ảnh**: ảnh bìa + album tối đa 12 ảnh (Free) / 40 (Wedding) / 80 (Signature). Crop ảnh bìa.
  5. **Lời mời**: chọn mẫu lời mời có sẵn hoặc tự viết.
  6. **Tiện ích**: bật/tắt từng section (countdown, album, map, QR mừng cưới, RSVP, nhạc).
  7. **Mừng cưới**: tối đa 2 tài khoản (nhà trai / nhà gái): ngân hàng, số TK, tên → render **VietQR**.
  8. **Nhạc**: chọn từ thư viện có giấy phép.
- Đổi theme bất cứ lúc nào, **không mất dữ liệu**.

### F3. Thiệp & trang cưới (khách xem)
- `/thiepcuoi/[slug]`: trang chung, lời mời chung ("Trân trọng kính mời quý khách").
- `/thiepcuoi/[slug]/[token]`: như trên + **danh xưng riêng** ("Kính mời Anh Minh & Gia đình"), chỉ hiện sự kiện khách được mời, form RSVP gắn với lời mời.
- Mở phong bì → nhạc phát **sau khi chạm**; nút tắt nhạc luôn hiện; tôn trọng `prefers-reduced-motion`.
- Section chuẩn (mỗi theme vẽ theo cách riêng): Bìa · Lời mời · Cặp đôi · Sự kiện (dương + âm lịch, đếm ngược, thêm vào lịch `.ics`, chỉ đường) · Album · Mừng cưới QR · RSVP · Lời cảm ơn.
- Free: watermark nhỏ "Tạo bởi Hẹn Ước" ở cuối thiệp.
- OG image: **ảnh bìa + tên cặp đôi + ngày**. Không bao giờ chứa tên khách.

### F4. Khách mời & lời mời
- Khách thuộc **bên** (`NHA_TRAI | NHA_GAI`) và **nhóm** (Họ hàng, Bạn bè, Đồng nghiệp… user tự tạo).
- Lời mời (`Invitation`) dành cho 1 hộ/nhóm: danh xưng hiển thị, số người tối đa, các sự kiện được mời.
- Mẫu danh xưng: chọn tiền tố (`Kính mời / Trân trọng kính mời / Thân mời / Mời`) + tên + hậu tố (`& Gia đình / & Người thương / & Bạn đời`) — sửa tay được.
- Thêm tay, sửa nhanh inline, **import CSV** (tên, danh xưng, bên, nhóm, số người, SĐT tuỳ chọn) có preview + báo lỗi từng dòng.
- Mỗi lời mời: copy link, copy **tin nhắn mẫu kèm link**, nút "Mở Zalo" (`https://zalo.me/<sđt>` nếu có SĐT), **đánh dấu đã gửi** (tay, hàng loạt).
- Thu hồi / tạo lại link (token cũ hết hiệu lực).
- Giới hạn: Free 30 lời mời; paid không giới hạn (soft cap 1.000 chống abuse).

### F5. RSVP
- Khách: **Sẽ đến / Không đến được**, số người (≤ `maxAttendees`), sự kiện tham dự (nếu được mời nhiều sự kiện), lời nhắn (≤ 500 ký tự).
- Sửa lại được trước hạn RSVP; mỗi lần sửa ghi lịch sử, **không đếm trùng**.
- Trang `/thiepcuoi/[slug]` (không token): RSVP "khách vãng lai" — nhập tên + SĐT, tạo bản ghi chờ chủ tiệc duyệt/gộp. Có thể tắt.
- Rate limit theo IP + token. Honeypot chống bot.
- Email thông báo cho chủ tiệc (tuỳ chọn, gom theo ngày).

### F6. Dashboard
Menu: **Tổng quan · Thiệp · Khách mời · RSVP · Checklist · Mua sắm · Cài đặt**.

Tổng quan thay đổi theo trạng thái (không hiện 4 con số 0 vô nghĩa):

| Trạng thái | Nội dung chính |
|---|---|
| Chưa có thiệp | Gallery mini → chọn mẫu |
| Nháp | Preview + "còn thiếu: địa điểm, ảnh bìa" + nút Publish |
| Đã publish, chưa khách | Link `/thiepcuoi/`, hướng dẫn thêm khách, import CSV |
| Đang mời | Countdown · chưa gửi / đã gửi / đã phản hồi · tổng người đến · ≈ số bàn (10 người/bàn, chỉnh được) |
| < 14 ngày | RSVP nổi bật, danh sách chưa phản hồi + nút copy tin nhắc, xuất CSV cho nhà hàng |
| Sau cưới | Cảm ơn, gợi ý thiệp cảm ơn (v2) |

Luôn có: **"Việc tuần này"** lấy từ checklist theo số ngày còn lại.

RSVP: bảng lọc theo bên / nhóm / trạng thái, tổng theo từng sự kiện, xuất CSV.

### F7. Checklist & Mua sắm (affiliate)
- Checklist mẫu ~40 việc theo mốc (12, 6, 3, 1 tháng, 2 tuần, 1 tuần, ngày cưới), tính hạn từ ngày cưới; user tick, thêm, ẩn việc.
- Mỗi việc có thể gắn **danh mục sản phẩm** → hiện 3–6 sản phẩm Shopee đã tuyển chọn ngay trong việc đó.
- Trang **Mua sắm**: duyệt theo danh mục (Gia tiên, Ăn hỏi, Cô dâu, Quà cảm ơn, Trang trí tiệc, Chụp ảnh).
- **Quà cảm ơn**: tự gợi ý số lượng = số người xác nhận + 5% dự phòng.
- Mọi link đi qua `/go/[productId]` (đếm click, không gửi PII), mở tab mới, nhãn "Liên kết tiếp thị".
- Ghi "Đã mua" + giá thực trả (tuỳ chọn) → **tổng chi** đơn giản.

### F8. Tài khoản
- Đăng nhập Google / Email OTP. 1 user = 1 đám cưới ở MVP (schema hỗ trợ nhiều).
- Mời thêm 1 người cùng quản lý (vợ/chồng) bằng email — role `EDITOR`.
- Xoá tài khoản + toàn bộ dữ liệu (yêu cầu bắt buộc về riêng tư).

### F9. Admin (chỉ Tony)
- `/admin` (role `ADMIN`): quản lý sản phẩm affiliate (thêm từ URL Shopee → gọi ACCESSTRADE tạo link), xem đơn affiliate, set `plan` cho wedding (thay paywall ở MVP), danh sách wedding (không xem chi tiết khách).

## 4. Yêu cầu phi chức năng

- Mobile-first, test iPhone Safari + **trình duyệt trong Zalo** + Android Chrome.
- Dấu tiếng Việt đúng ở mọi font (test chuỗi "Nguyễn Thị Thùy Dương — Trân trọng kính mời").
- Input ≥ 16px trên mobile (tránh iOS zoom). Touch target ≥ 44px.
- Thiệp: LCP ≤ 2.5s trên 4G, ảnh qua `next/image` / R2 resize, JS theme lazy-load.
- WCAG AA contrast cho UI sản phẩm (theme có thể tự do hơn nhưng nội dung chính phải đọc được).
- Backup DB hằng ngày (Neon PITR + dump tuần ra R2).

## 5. Acceptance tests MVP (Playwright + Vitest)

| ID | Kịch bản | Kỳ vọng |
|---|---|---|
| AT-01 | Cùng 1 wedding render 3 theme | 3 layout khác nhau, dấu tiếng Việt đúng |
| AT-02 | Tạo nháp chưa đăng nhập → đăng nhập | Nháp chuyển lên DB, không mất dữ liệu |
| AT-03 | 2 lời mời khác nhau | 2 token khác nhau, mỗi link đúng danh xưng |
| AT-04 | Khách RSVP 3 người, sửa thành 2 | Dashboard tổng = 2, lịch sử có 2 bản ghi |
| AT-05 | RSVP vượt `maxAttendees` | Bị từ chối, báo lỗi rõ |
| AT-06 | Đổi theme sau khi đã gửi link | Link cũ vẫn chạy, RSVP giữ nguyên |
| AT-07 | Thu hồi link | Link cũ trả 404, link mới chạy |
| AT-08 | `/thiepcuoi/[slug]/[token]`, `/dashboard` | Header `noindex`, không có trong `sitemap.xml` |
| AT-09 | OG của `/thiepcuoi/[slug]/[token]` | Không chứa tên khách |
| AT-10 | User A truy cập wedding của user B (đoán ID) | 404 |
| AT-11 | Gửi 30 RSVP / phút từ 1 IP | Bị rate limit |
| AT-12 | Click sản phẩm Shopee | Redirect đúng `aff_link`, log click không có PII |
| AT-13 | Free tạo lời mời thứ 31 | Bị chặn, hiện thông báo nâng cấp |

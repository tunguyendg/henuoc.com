# 00 — Project Context (Nguồn sự thật)

**Version:** 2.0 · **Ngày chốt:** 2026-10-19 · **Owner:** Tony · **Trạng thái:** M0 — tài liệu

> File này thắng mọi file khác khi mâu thuẫn. Muốn đổi quyết định → tạo ADR trong `docs/decisions/`, rồi cập nhật file này.

## 1. Sản phẩm trong một câu

**Hẹn Ước** giúp cặp đôi Việt **tạo thiệp cưới online đẹp trong vài phút, gửi lời mời mang tên từng khách qua Zalo, và quản lý khách mời / RSVP** — miễn phí để bắt đầu.

## 2. Ba trụ giá trị (theo thứ tự ưu tiên)

1. **Kho mẫu thiệp đẹp + tiện ích trong thiệp** — sản phẩm chính, lý do người ta trả tiền.
2. **Thiệp riêng từng khách + RSVP** — điểm khác biệt so với thiệp ảnh/Canva.
3. **Dashboard của người sắp cưới** — khách mời, checklist, gợi ý mua sắm (affiliate).

## 3. Quyết định đã chốt

| # | Chủ đề | Quyết định |
|---|---|---|
| D1 | Thương hiệu | Tên **Hẹn Ước**, domain `henuoc.com`. Định vị **trẻ, hiện đại, nhìn là biết đám cưới**. Logo **Nhẫn Tim** (nhẫn cưới đội trái tim vàng), màu **Hồng Cưới `#E8436A` + Vàng Nhẫn `#F6C76B`**, chữ Be Vietnam Pro đậm. Xem ADR-003 |
| D2 | Tham chiếu UI | **sayi.do** về cấu trúc, khoảng trắng, giọng văn. Không copy code, ảnh, logo, review của họ |
| D3 | Mô hình | **Hybrid** (URL có chữ "thiepcuoi" + tên cặp đôi để nhìn link là biết đám cưới): `/thiepcuoi/[slug]` trang cưới chung (gửi group, đăng MXH) + `/thiepcuoi/[slug]/[token]` thiệp riêng có tên khách, RSVP |
| D4 | Tính năng Việt trong MVP | Lễ **vu quy / thành hôn / tân hôn**, **nhà trai / nhà gái**, **lịch âm**, **QR mừng cưới (VietQR)**, mẫu xưng hô |
| D5 | Stack | Next 16 · TS · Tailwind 4 · Prisma 7 · **Supabase Postgres (Singapore, ADR-004)** · Better Auth · R2 · Resend |
| D6 | Hosting | **AZDIGI DirectAdmin Node.js App (Passenger, Node 22)**, `output: "standalone"`, build trên GitHub Actions. VPS + Docker là đường nâng cấp khi cần |
| D7 | Repo | Repo mới `tunguyendg/henuoc.com`. Repo cũ `henuoc.com` archive, chỉ mang sang `public/brand/*` |
| D8 | Monetization | Free-first. **2 gói: Miễn phí / Cao cấp**, Cao cấp trả **một lần / đám cưới**, giá **chưa công bố** (quyền lợi = đề xuất, xem `04-GROWTH.md`). MVP: nâng cấp qua email `hotro@henuoc.com`. **Thanh toán làm ở v2** (Tony chốt 2026-10-22, thay phương án 3 gói Wedding 199k / Signature 349k) |
| D9 | Affiliate | ACCESSTRADE (đã có tài khoản + API token). Gợi ý Shopee **gắn theo việc trong checklist**, chỉ trong dashboard. **Không bao giờ** trên thiệp gửi khách |
| D10 | Theme | Tony chọn reference → Claude viết theme spec → Codex code. Mỗi theme là React component riêng, **layout khác nhau thật**, không chỉ đổi màu |
| D11 | Ảnh marketing | Chỉ ảnh **miễn phí dùng thương mại** (Unsplash, Pexels) — ghi nguồn vào `public/brand/CREDITS.md` |
| D12 | Cách làm | Claude = kiến trúc sư/reviewer · Codex/Claude Code = implement · Tony = owner + tự code task 🔴 |
| D13 | Khách mời | Không cần tài khoản để xem thiệp và RSVP |
| D14 | SEO | Trang marketing, gallery, cẩm nang: SSR/SSG, index. `/thiepcuoi/*`, `/dashboard/*`: noindex, không sitemap |

## 4. Để dành v2+ (đã quyết KHÔNG làm ở MVP)

- Thanh toán payOS + paywall thật (MVP chỉ có flag `plan` trong DB, set tay)
- **Sổ mừng cưới** (ghi ai mừng bao nhiêu — dữ liệu tài chính, riêng tư)
- **Xem ngày cưới** hoàng đạo / hợp tuổi
- Save the date, thiệp cảm ơn
- Sổ lưu bút, khách upload ảnh, livestream
- Ngân sách cưới chi tiết (MVP chỉ có tổng chi từ checklist)
- Import Excel nâng cao (MVP: CSV đơn giản), sắp xếp bàn
- Tên miền riêng, subdomain theo cặp đôi
- Editor kéo thả kiểu Canva — **không bao giờ** trong roadmap gần

## 5. Còn mở (chưa chốt, không chặn MVP)

- Logo chính thức
- Hạn mức Free cụ thể (đề xuất trong `04-GROWTH.md`, sẽ test với user thật)
- Thời hạn lưu trữ thiệp sau ngày cưới
- Nguồn nhạc nền có giấy phép (đề xuất: Pixabay Music / nhạc tự sản xuất)
- Chính sách hoàn tiền, điều khoản, chính sách quyền riêng tư (cần trước khi thu tiền)

## 6. Nguyên tắc trung thực sản phẩm

- Không bịa số liệu (số cặp đôi, %, rating). Chỗ social proof dùng **demo thật** hoặc FAQ cho đến khi có data thật.
- Không claim "đã gửi" khi user chỉ copy link; "đã mở" ≠ "đã đọc".
- Không hứa giá rẻ nhất / giá checkout từ dữ liệu ACCESSTRADE.
- Không quảng cáo tính năng chưa chạy. Tính năng v2 hiển thị nhãn "Sắp có".
- Nhạc, ảnh, font trong theme phải có quyền dùng thương mại.

## 7. Thước đo thành công MVP

1. 3 theme đủ đẹp để **người ngoài muốn gửi** (test với 5 người).
2. Một cặp đôi thật tạo thiệp → 30 link riêng → khách RSVP → dashboard đếm đúng.
3. 0 rò rỉ PII trong sitemap / OG / analytics (có test tự động).
4. Lighthouse mobile trang thiệp ≥ 85 Performance, LCP ≤ 2.5s.
5. Có ≥ 1 đơn affiliate được ghi nhận từ Shopping Planner.

## 8. Môi trường hiện có

| Thứ | Giá trị |
|---|---|
| GitHub | `tunguyendg` |
| Hosting | AZDIGI DirectAdmin, user `yvltjpca`, Node.js App selector có Node 22 (đang chạy `api.giavang.today`) |
| DB | Supabase, region `ap-southeast-1`, Data API tắt (ADR-004). Free tier auto-pause sau 7 ngày không hoạt động → **chọn gói production trước launch** |
| Affiliate | ACCESSTRADE Publisher, có API token |
| Máy dev | MacBook Air (Apple Silicon), VS Code |

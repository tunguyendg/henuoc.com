# 04 — Growth: SEO · Pricing · Affiliate

**Version:** 2.0 · 2026-10-19 · Thay thế `SEO_AND_GROWTH.md`, `MONETIZATION.md`, `FREE_FIRST_DECISION.md`.

## 1. Phễu

```
Google (SEO) ─┐
Zalo (thiệp khách nhận, watermark Free) ─┼─▶ Gallery / Tool ─▶ Builder (không login) ─▶ Đăng nhập & Publish
TikTok/FB (demo theme) ─┘                                                        │
                                       ┌──────────────────────────────────────────┤
                                       ▼                                          ▼
                              Nâng cấp Cao cấp (v2: payOS)            Checklist ─▶ Shopee (affiliate)
```

**Vòng lặp lan truyền:** mỗi đám cưới gửi 100–300 link → khách là người sắp cưới tương lai → watermark "Tạo bởi Hẹn Ước" dẫn về `/?ref=thiep`.

## 2. SEO

### 2.1 Next.js làm được gì (và không làm được gì)
Next.js cho **HTML render sẵn**, metadata từng trang, sitemap, OG image, tốc độ tốt. Nó **không** tự đưa lên top — thứ hạng đến từ trang **khớp đúng ý định tìm kiếm** + nội dung thật + backlink + thời gian.

### 2.2 Kiến trúc trang SEO

| Cụm | URL | Ý định | Nội dung bắt buộc |
|---|---|---|---|
| Gallery | `/mau-thiep-cuoi` | "mẫu thiệp cưới đẹp", "mẫu thiệp cưới online" | Grid theme, đoạn giới thiệu 150 chữ, FAQ |
| Phong cách | `/mau-thiep-cuoi/phong-cach/truyen-thong` … | "thiệp cưới truyền thống", "thiệp cưới hàn quốc" | ≥ 3 theme thật của phong cách đó (ít hơn → **không** publish trang) |
| Chi tiết | `/mau-thiep-cuoi/hong-pastel` | long-tail tên/màu | Demo tương tác, mô tả viết tay |
| Tính năng | `/thiep-cuoi-online` · `/thiep-cuoi-gui-zalo` · `/thiep-cuoi-co-ten-khach` | "thiệp cưới online miễn phí", "thiệp cưới điện tử", "thiệp cưới gửi zalo" | Hướng dẫn từng bước + demo + FAQ |
| Tool | `/checklist-dam-cuoi` (MVP) · `/xem-ngay-cuoi`, `/tinh-chi-phi-dam-cuoi` (v2) | "checklist đám cưới", "chuẩn bị đám cưới cần những gì" | Tool chạy được không cần login + CTA tạo thiệp |
| Cẩm nang | `/cam-nang/<slug>` | informational | Bài 1.200–2.500 chữ, có ví dụ thật |

**Bài cẩm nang ưu tiên khi launch (≥ 5):**
1. Cách ghi thiệp cưới đúng chuẩn (xưng hô, ghi tên khách)
2. Lời mời đám cưới hay, trang trọng — 50 mẫu
3. Lễ vu quy, thành hôn, tân hôn khác nhau thế nào
4. Checklist chuẩn bị đám cưới từ A–Z (link tool)
5. Gửi thiệp cưới qua Zalo có lịch sự không? Cách gửi tinh tế

> Keyword là **giả thuyết** cho đến khi có dữ liệu Search Console. Tháng đầu sau launch: đọc Search Console hằng tuần, viết bài theo query thật.

### 2.3 Technical SEO checklist

- `metadataBase: new URL("https://henuoc.com")`; `generateMetadata` từng trang, `alternates.canonical` duy nhất.
- `sitemap.ts`: marketing + theme `published` + trang phong cách đủ ≥ 3 theme + bài cẩm nang. **Không** `/thiepcuoi/`, `/thiepcuoi/…/[token]`, `/dashboard`, `/demo`.
- `robots.ts`: cho phép tất cả trừ `/api/`, `/dashboard`, `/admin`. **Không chặn `/thiepcuoi/…/[token]`** bằng robots (để Google đọc được `noindex`).
- `/thiepcuoi/[slug]`: mặc định `noindex` (đời tư cặp đôi). Cho cặp đôi bật "cho phép Google tìm thấy" ở v2.
- JSON-LD: `Organization` (home), `FAQPage` (FAQ thật), `BreadcrumbList`, `Article` (cẩm nang). **Không** `AggregateRating` giả.
- OG image động `opengraph-image.tsx` cho theme + cẩm nang. Test bằng Zalo + Facebook Debugger.
- Core Web Vitals p75: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1.
- Nội dung chính render server-side; animation không chặn nội dung.
- Internal link: mỗi theme → 3 theme tương tự + phong cách; mỗi bài cẩm nang → 2 theme + tool.
- Không tạo trang mỏng (đổi màu = trang mới).

### 2.4 Đo lường funnel

Sự kiện (server-side log hoặc Umami v2): `theme_view`, `theme_demo_open`, `builder_start`, `draft_claimed`, `wedding_published`, `invitation_created`, `invitation_link_copied`, `rsvp_submitted`, `upgrade_cta_click`, `affiliate_click`.
**Không** gửi tên khách, token, SĐT, nội dung lời mời.

## 3. Pricing

**Mô hình:** trả **một lần / đám cưới**. Không subscription.
**Gói:** Miễn phí / Cao cấp (Tony chốt 2026-10-22). Giá Cao cấp chưa công bố — từng cân nhắc 199k–349k.
**MVP:** chưa có thanh toán online. Nút nâng cấp → email `hotro@henuoc.com` → Tony chuyển khoản tay → set `plan` trong `/admin`. Mục đích: **đo nhu cầu trả tiền thật** trước khi tích hợp payOS (v2).

| Quyền lợi (đề xuất — sẽ test) | Miễn phí | Cao cấp (giá chưa công bố) |
|---|---|---|
| Theme | Theme `free` | **Tất cả** theme |
| Trang cưới `/thiepcuoi/` | ✓ | ✓ |
| Lời mời riêng có tên | 30 | Không giới hạn |
| RSVP + dashboard | ✓ | ✓ |
| Ảnh album | 12 | Nhiều hơn (chưa chốt số) |
| Nhạc nền | — | ✓ |
| QR mừng cưới | ✓ | ✓ |
| Watermark "Tạo bởi Hẹn Ước" | Có | Không |
| Xuất CSV khách / RSVP | — | ✓ |
| Slug tuỳ chọn `/thiepcuoi/ten-dep` | — | ✓ |
| Thiệp online sau ngày cưới | 30 ngày | Lâu hơn (chưa chốt) |
| Hỗ trợ | Cẩm nang | Email `hotro@henuoc.com` |

- Giá early-adopter cho nhóm cặp đôi đầu tiên = phương án thử, chưa chốt.
- QR mừng cưới để Free: đó là tính năng người Việt cần nhất, đưa vào Free tăng lan truyền.
- Trước khi thu tiền thật: điều khoản, chính sách hoàn tiền, xuất hoá đơn (nếu cần).

**Kiểm chứng:** 20 cặp đôi thật dùng Free → đếm bao nhiêu người **chuyển khoản** (không phải survey "có muốn trả không").

## 4. Affiliate — Wedding Shopping Planner

### 4.1 Nguyên tắc
- Chỉ trong dashboard + tool checklist public. **Không bao giờ** trên thiệp gửi khách.
- Catalogue **chọn tay** bởi Tony: sản phẩm thật, shop uy tín, đánh giá tốt. Mỗi sản phẩm có 1 câu "vì sao chọn".
- Hiển thị giá dạng "khoảng 150.000đ" + chú thích "Giá có thể thay đổi trên Shopee". Không "rẻ nhất", không đếm ngược sale giả.
- Nhãn rõ: "Liên kết tiếp thị — Hẹn Ước có thể nhận hoa hồng, giá của bạn không đổi."

### 4.2 Gắn theo ngữ cảnh (đây là điểm tạo chuyển đổi)

| Mốc | Việc trong checklist | Danh mục |
|---|---|---|
| −180 ngày | Chụp ảnh cưới | `chup-anh` (váy, vest, phụ kiện chụp) |
| −90 ngày | Chuẩn bị lễ ăn hỏi | `an-hoi` (tráp, khay, khăn phủ) |
| −60 ngày | In / gửi thiệp | *(thiệp online — không affiliate)* |
| −30 ngày | Trang trí gia tiên | `gia-tien` (phông, chữ hỷ, đèn, hoa giả) |
| −21 ngày | Chọn quà cảm ơn | `qua-cam-on` — **gợi ý số lượng = khách xác nhận × 1.05** |
| −14 ngày | Phụ kiện cô dâu | `co-dau` (giày, kẹp tóc, mạng che) |
| −7 ngày | Bao lì xì, phong bì | `trang-tri` |

Dashboard tổng quan có ô **"Gợi ý cho tuần này"** = danh mục của việc gần hạn nhất chưa tick.

### 4.3 ACCESSTRADE API (đã xác minh từ tài liệu publisher)

Base `https://api.accesstrade.vn` · Header `Authorization: token <ACCESSTRADE_TOKEN>`

| Mục đích | Endpoint | Dùng ở |
|---|---|---|
| Tạo link affiliate | `POST /v1/product_link/create` — `{ campaign_id, urls, utm_source, utm_medium, utm_campaign, utm_content, sub1..sub4 }` → `data.success_link[].{aff_link, short_link, url_origin}` | Admin: thêm sản phẩm |
| Lấy campaign | `GET /v1/campaigns?approval=successful` | Admin: lấy `campaign_id` Shopee (1 lần, lưu env) |
| Tìm ý tưởng sản phẩm | `GET /v1/datafeeds?domain=shopee.vn&price_from&price_to&discount_rate_from&page&limit≤200` | Admin: duyệt gợi ý |
| Top bán chạy | `GET /v1/top_products?date_from=DD-MM-YYYY&date_to=DD-MM-YYYY&merchant=` | Admin: gợi ý |
| Đối soát giao dịch | `GET /v1/transactions?since&until&utm_source=henuoc&status` (ISO date) — **10 req/phút** | Cron hằng ngày |
| Danh sách đơn | `GET /v1/order-list?since&until&utm_content&limit≤300` — **10 req/phút**, cache 1 phút | Báo cáo admin |

Quy ước UTM: `utm_source=henuoc`, `utm_medium=planner`, `utm_campaign=<category>`, `utm_content=<AffiliateProduct.id>` → biết sản phẩm nào ra đơn mà **không** gửi thông tin user.

Thận trọng: link Shopee có thể chết / đổi giá → cron tuần kiểm tra HTTP status `originUrl`, đánh dấu sản phẩm lỗi để Tony thay.

### 4.4 Chỉ số
CTR gợi ý (click / lượt hiển thị) · đơn approved / click · hoa hồng / wedding active. **Không** coi tỷ lệ giả định là dữ liệu thị trường.

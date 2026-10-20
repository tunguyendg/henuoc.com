# 02 — Design System & Page Map

**Version:** 3.0 (Brand v3, 2026-10-20) · 2026-10-19 · Thay thế: `BRAND_GUIDELINES.md`, `SAAS_BRAND_V2.md`, `DESIGN_DIRECTION_SAYIDO.md`, `HOMEPAGE_DIRECTION_SAYIDO.md`, `BRAND_LOGO_ROSE.md`, `GALLERY_SECTION_DECISION.md` (đã xoá).

## 1. Nguyên tắc

1. **Brand là khung, theme là tác phẩm.** UI Hẹn Ước (marketing, builder, dashboard) dùng một hệ màu thống nhất. Theme thiệp có palette/font/hiệu ứng riêng — **không** ép theo brand.
2. **Tham chiếu sayi.do (bố cục), cá tính riêng (trẻ, tươi):** nền trắng, khoảng trắng rộng, ảnh cặp đôi thật cạnh screenshot sản phẩm thật, section xen kẽ trái–phải, giọng văn thân thiện có chút vui. Không copy asset/code/review.
3. **Mobile & Zalo first.** 70%+ khách mở thiệp trên điện thoại trong Zalo.
4. **Dashboard bình tĩnh.** Không giống admin panel. Một CTA chính mỗi màn hình.
5. **Trung thực.** Không số liệu bịa, không review giả, không mockup giả làm tính năng thật.

## 2. Thương hiệu: Brand v3 (ADR-003)

**Định vị hình ảnh:** trẻ, hiện đại, năng động, khách muốn khoe với bạn bè; **nhìn là biết đám cưới**.

### Logo: Nhẫn Tim
- Nhẫn cưới (vành tròn) đội **trái tim vàng**. Nhẫn = lời hẹn ước.
- Luôn đặt trong **ô vuông bo góc màu Hồng Cưới** ở header, footer, favicon, app icon: chỉ có MỘT hình ở mọi nơi.
- Chữ đi kèm: **"Hẹn Ước"** viết hoa chữ cái đầu mỗi từ, Be Vietnam Pro **800**, letter-spacing −0.035em, màu Mận Đậm (nền sáng) hoặc trắng (nền tối).
- Nguồn hình: `src/components/site/logo.tsx` (`LogoMark`, `LogoTile`, `Logo`). File xuất: `src/app/icon.svg`, `favicon.ico`, `apple-icon.png`, `public/brand/mark.svg`, `icon-192/512.png`.
- Không: đổi màu trái tim, kéo méo, đặt nhẫn trần không ô trên nền ảnh, dùng lại logo chữ Ư, Tơ Hồng, hai vòng nhẫn.

### Link chia sẻ: phần bạn bè thấy đầu tiên
- URL: `henuoc.com/thiepcuoi/minhanh-hoangnam` (thiệp chung) · `henuoc.com/thiepcuoi/minhanh-hoangnam/<mã>` (thiệp riêng).
- Ảnh OG: nền Hồng Cưới, nhẫn tim, **tên cặp đôi + ngày**, chữ nhỏ "hẹn ước" ở góc. **Không bao giờ có tên khách.**
- Tiêu đề OG: `Thiệp cưới Minh Anh & Hoàng Nam · 20.12.2026`.

## 3. Color tokens

| Token | HEX | Dùng cho | Contrast |
|---|---|---|---|
| `rose-500` (**Hồng Cưới**) | `#E8436A` | Logo, ô icon, chữ **lớn** ≥ 24px, illustration | 3.7 trên nền, chỉ dùng cho chữ lớn |
| `rose-600` (nút) | `#D6335C` | **Nền nút CTA**, link | 4.7 với chữ trắng ✅ |
| `rose-700` | `#C92A53` | Hover, eyebrow chữ nhỏ, badge | ≥ 4.6 ✅ |
| `rose-50` (Hồng Phấn) | `#FFE9EE` | Nền section nhấn, badge, chip | — |
| `gold-400` (**Vàng Nhẫn**) | `#F6C76B` | Trái tim trong logo, điểm nhấn, highlight | Chữ Mận Đậm trên vàng 10.2 ✅ |
| `gold-100` | `#FDF0D5` | Nền nhấn phụ | — |
| `canvas` | `#FFF8F9` | Nền trang | — |
| `surface` | `#FFFFFF` | Card, form, bảng | — |
| `ink` (Mận Đậm) | `#2B1B30` | Tiêu đề, body | 15.4 ✅ |
| `muted` | `#6E5F72` | Chú thích | 5.7 ✅ |
| `border` | `#F1DFE4` | Viền | — |
| `success` / `warning` / `danger` | `#1F7A5A` / `#9A5B13` / `#B4232F` | Trạng thái RSVP | ≥ 5.3 ✅ |

Trạng thái luôn có **chữ + icon**, không chỉ màu. Token nằm trong `src/app/globals.css` (`@theme`). Tên `rose-*` được giữ nguyên từ v2 để component không phải đổi.

## 3b. Typography

| Vai trò | Font | Size desktop / mobile | Weight |
|---|---|---|---|
| H1 hero | **Be Vietnam Pro** | 60 / 38px, line-height 1.08, tracking −0.03em | **800** |
| H2 section | Be Vietnam Pro | 42 / 30px, tracking −0.03em | 800 |
| H3, UI heading | Be Vietnam Pro | 20 / 18px | 600–700 |
| Body | Be Vietnam Pro | 17 / 16px, line-height 1.65 | 400 |
| Small, label | Be Vietnam Pro | 14px | 500 |
| Eyebrow | Be Vietnam Pro | 12px, UPPERCASE, tracking 0.16em | 700 |

- Class Tailwind cho tiêu đề: `font-display font-extrabold tracking-[-0.03em]`.
- **Playfair Display** (`font-serif`) chỉ dùng **bên trong thiệp minh hoạ / theme**, không dùng cho UI thương hiệu.
- Kiểm tra chuỗi: "Nguyễn Thị Thùy Dương", "Trân trọng kính mời", "Lễ Vu Quy (nhằm ngày 01.11 Bính Ngọ)".

## 4. Component rules

| Component | Quy tắc |
|---|---|
| Button | Cao 44px (lg 52px), radius 14px, chữ 15px/600. Variant: `primary` (rose-600), `secondary` (viền border, chữ ink), `ghost`. Mỗi màn hình **1** primary |
| Card | Nền surface, viền border, radius 20px, `shadow-card` nhẹ, padding 24px |
| Input | Label luôn hiện phía trên, 16px, cao 48px, lỗi hiện ngay dưới field màu danger |
| Badge trạng thái | Pill, icon + chữ: ✓ Sẽ đến · ✕ Không đến · ⏱ Chưa phản hồi · ✉ Đã gửi |
| Icon | `lucide-react`, stroke 1.75, 20px |
| Motion UI | 150–250ms, ease-out. Không bounce. Tôn trọng `prefers-reduced-motion` |
| Container | `max-w-6xl` marketing, `max-w-7xl` dashboard, gutter 20px mobile / 32px desktop |
| Section spacing | `py-20 md:py-28` |

## 5. Page map — Marketing (tham chiếu sayi.do)

### Header
Logo · **Mẫu thiệp** · **Tính năng** · **Bảng giá** · **Cẩm nang** · *(phải)* Đăng nhập · **[Tạo thiệp miễn phí]**
Sticky, nền trắng mờ khi cuộn. Mobile: logo + nút CTA nhỏ + menu sheet.

### Homepage `/` — thứ tự section

| # | Section | Nội dung | Layout |
|---|---|---|---|
| 1 | **Hero** | H1 "Thiệp cưới online đẹp, gửi đúng tên từng khách" · sub 1 câu · [Tạo thiệp miễn phí] [Xem mẫu thiệp] · 3 tick "Không cần thiết kế · Xem trước ngay · Miễn phí bắt đầu" | Trái: chữ. Phải: ảnh cặp đôi + mockup điện thoại hiển thị **theme thật** (render component, không phải ảnh) |
| 2 | **Mẫu thiệp nổi bật** | Carousel 6–8 theme, chip lọc phong cách, "Xem tất cả mẫu →" | Card dọc 3:4, chỉ ảnh + tên + phong cách |
| 3 | **Mỗi khách một tấm thiệp** | Demo 2 điện thoại cạnh nhau: "Kính mời Anh Minh & Gia đình" vs "Thân mời Bạn Lan" | Chữ trái, visual phải |
| 4 | **RSVP không cần đăng nhập** | Khách bấm "Sẽ đến", chọn số người, xong. Chủ tiệc thấy ngay | Visual trái, chữ phải |
| 5 | **Quản lý khách nhà trai, nhà gái** | Screenshot bảng khách thật (dữ liệu mẫu), tổng người đến, ≈ số bàn, xuất Excel | Chữ trái, visual phải |
| 6 | **Checklist từ ngày hẹn đến ngày cưới** | Danh sách việc theo mốc, tick | Visual trái, chữ phải |
| 7 | **Tiện ích dành riêng người Việt** | 3–4 card: QR mừng cưới · Lịch âm dương · Lễ vu quy & thành hôn · Gửi qua Zalo | Grid 4 cột / 2 cột mobile |
| 8 | Ảnh full-width | Ảnh cưới (Unsplash/Pexels có ghi credit) | Full-bleed, cao 60vh |
| 9 | **FAQ** | 6–8 câu (miễn phí đến đâu, khách có cần cài app, gửi Zalo thế nào, dữ liệu có an toàn…) | Accordion, có JSON-LD `FAQPage` |
| 10 | **CTA cuối** | "Bắt đầu thiệp của hai bạn" + nút | Nền rose-50 |

**Không có:** số liệu "10.000+ cặp đôi", rating, logo đối tác, review — cho đến khi có data thật.

### Footer
4 cột: **Sản phẩm** (Mẫu thiệp, Tính năng, Bảng giá) · **Mẫu theo phong cách** (link SEO) · **Cẩm nang** (5 bài nổi bật) · **Hẹn Ước** (Giới thiệu, Liên hệ, Điều khoản, Quyền riêng tư). Dòng cuối: © 2026 Hẹn Ước · Facebook · TikTok · Zalo OA.

### Gallery `/mau-thiep-cuoi`
- H1 + đoạn mô tả ngắn (SEO).
- Chip lọc phong cách (link thật tới `/mau-thiep-cuoi/phong-cach/[style]`, không chỉ filter JS) + filter `Miễn phí / Cao cấp`.
- Grid 2 cột mobile / 3–4 desktop. Card: ảnh 3:4, tên, phong cách, badge `Cao cấp`.
- Click → trang chi tiết.

### Chi tiết theme `/mau-thiep-cuoi/[slug]`
- Trái (desktop): **khung điện thoại chạy demo thật** (iframe tới `/demo/[slug]` hoặc render trực tiếp), có nút "Mở toàn màn hình".
- Phải: tên, phong cách, mô tả 80–150 chữ viết tay, danh sách tiện ích có trong theme, palette, [Dùng mẫu này] → `/tao-thiep?theme=[slug]`.
- Dưới: "Mẫu tương tự".

### Bảng giá `/bang-gia`
3 cột Free / Wedding / Signature. Ở MVP nút paid = "Liên hệ nâng cấp" (Zalo) vì chưa có payment. Bảng so sánh chi tiết + FAQ.

## 6. Builder `/tao-thiep`

```
Desktop                                     Mobile
┌──────────────────────┬──────────────┐     ┌───────────────┐
│ [Bước 1..8 sidebar]  │  ┌────────┐  │     │  Preview      │
│                      │  │ iPhone │  │     │  (thu nhỏ,    │
│  Form bước hiện tại  │  │ preview│  │     │   chạm = mở)  │
│                      │  │ live   │  │     ├───────────────┤
│                      │  └────────┘  │     │ Form bước     │
│ [← Trước] [Tiếp →]   │ [Đổi mẫu]    │     │ [tab bước ▾]  │
└──────────────────────┴──────────────┘     └───────────────┘
Top bar: Logo · "Đã lưu nháp" · [Xem toàn màn hình] · [Lưu & chia sẻ]
```

## 7. Dashboard `/dashboard`

```
┌ Sidebar ─────────┐┌ Content ───────────────────────────────────────┐
│ Hẹn Ước          ││ Còn 87 ngày · Minh Anh & Hoàng Nam              │
│ ● Tổng quan      ││ ┌ Việc tuần này ─────────┐ ┌ RSVP ────────────┐ │
│ ○ Thiệp          ││ │ ☐ Chốt khách nhà gái   │ │ 120 lời mời      │ │
│ ○ Khách mời      ││ │ ☐ Gửi thiệp đợt 1      │ │ 86 sẽ đến ≈ 9 bàn│ │
│ ○ RSVP           ││ │ [Xem checklist →]      │ │ 12 chưa phản hồi │ │
│ ○ Checklist      ││ └────────────────────────┘ └──────────────────┘ │
│ ○ Mua sắm        ││ ┌ Gợi ý cho tuần này ───────────────────────┐   │
│ ○ Cài đặt        ││ │ Quà cảm ơn cho ~90 khách  [3 sản phẩm →]  │   │
│ [Xem thiệp ↗]    ││ └───────────────────────────────────────────┘   │
└──────────────────┘└─────────────────────────────────────────────────┘
Mobile: sidebar → bottom nav 5 mục (Tổng quan, Khách, RSVP, Checklist, Thêm)
```

Bảng khách: cột **Danh xưng · Bên · Nhóm · Số người · Gửi · Mở link · RSVP · Thao tác (copy link, copy tin nhắn, Zalo, ⋯)**. Lọc nhanh bằng chip. Chọn nhiều → đánh dấu đã gửi / xoá / đổi nhóm.

## 8. Giọng văn & microcopy

- Xưng "bạn" / "hai bạn" với cặp đôi. Ấm, ngắn, không sến. Có thể vui nhẹ như sayi.do ("Tick xong là nhẹ lòng!").
- Với khách mời trên thiệp: trang trọng, dùng đúng mẫu xưng hô Việt.
- CTA chuẩn: "Tạo thiệp miễn phí" · "Xem mẫu thiệp" · "Dùng mẫu này" · "Lưu & chia sẻ" · "Thêm khách" · "Sao chép link mời" · "Sẽ đến" · "Rất tiếc, không đến được".
- Tránh: "gửi Zalo tự động", "biết khách đã đọc", "rẻ nhất".

## 9. Assets

- `public/brand/`: logo, mark, favicon (mang từ repo cũ — **tạm**). Tạo `public/brand/CREDITS.md` ghi nguồn mọi ảnh.
- `public/themes/<slug>/`: asset riêng của từng theme.
- `public/brand/`: logo Nhẫn Tim (ADR-003). Ảnh marketing: Unsplash / Pexels, export WebP ≤ 200KB, có `width/height` chính xác (tránh lỗi "width or height modified").

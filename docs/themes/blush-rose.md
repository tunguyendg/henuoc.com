# Theme: Blush Rose (`blush-rose`) · v1 — BRIEF thiết kế

Brief để dev implement, không phải code. Contract: `docs/07-THEMES.md` §2–§4, §8, §10. Catalog: `docs/12-THEME-CATALOG.md`.
Thư mục code: `src/themes/blush-rose/` (cấu trúc theo 07 §4). Tier `free`, style `lang-man-hoa-la` (có thể thêm `co-dien-hoai-niem`, Tony quyết).

> Lệch catalog: `src/data/themes.ts` mô tả blush-rose là "hồng phấn + màu nước", palette `#FBEEF0…#8A3D52`. Brief này đổi sang đỏ đô + giấy ngà + tranh Redouté. Khi implement phải sửa `name/summary/description/palette` trong catalog cho khớp (catalog là nguồn SEO), và nên cân nhắc đổi tên mẫu nếu "Blush" không còn hợp.

## 1. Tổng quan

- Cảm giác: mở một phong thư giấy ngà có dán con dấu sáp, bên trong là tranh thực vật thế kỷ 19, đỏ đô trầm, hồng phấn nhạt, ánh vàng cũ. Cổ điển, ấm, tĩnh; "sang" nhờ khoảng trắng và hoa vẽ tay, không nhờ hiệu ứng.
- Bố cục: một cột, căn giữa, `max-w` ~480px trên desktop (07 §8). Cuộn dọc, thẻ giấy xen hoa.
- Tối đa 1 hiệu ứng "wow": mở phong bì (§6.1). Còn lại chỉ fade/slide nhẹ qua `<Reveal>`.

## 2. Màu

| Token gợi ý | Hex | Vai trò |
|---|---|---|
| `--br-paper` | `#F3EDE3` | Nền trang (giấy ngà) |
| `--br-card` | `#ECE5DA` | Nền phụ, thẻ, phong bì |
| `--br-wine` | `#4A161A` | Chữ chính, tiêu đề, nút chính, nền khối tối |
| `--br-wine-2` | `#4B1A1E` | Hover/viền (xem ghi chú) |
| `--br-gold` | `#C4A257` | Điểm nhấn: viền mảnh, đường kẻ, icon, chấm; chữ chỉ khi trên nền đỏ đô |

Ghi chú `#4B1A1E`: khác `#4A161A` gần như không thấy (tương phản giữa hai màu 1.03:1). Hover/viền không có tín hiệu thị giác. **Đề xuất gộp thành một token `--br-wine`**; hover dùng đổi độ sáng rõ hơn (vd `color-mix(in oklab, var(--br-wine) 85%, white)`) hoặc gạch chân/viền vàng. Tony chốt giữ hay gộp.

Tỉ lệ tương phản WCAG (tính theo công thức WCAG 2.x):

| Chữ / nền | Tỉ lệ | Kết luận |
|---|---|---|
| `#4A161A` trên `#F3EDE3` | 12.69:1 | AA + AAA, dùng cho mọi chữ |
| `#4A161A` trên `#ECE5DA` | 11.81:1 | AA + AAA |
| `#F3EDE3` trên `#4A161A` | 12.69:1 | OK (chữ sáng trên khối đỏ đô) |
| `#C4A257` trên `#4A161A` | 6.09:1 | AA cho chữ thường; dùng cho chữ vàng trên khối đỏ đô |
| `#C4A257` trên `#F3EDE3` | 2.08:1 | **Không đạt** chữ (cần 4.5), cả cỡ lớn (cần 3) |
| `#C4A257` trên `#ECE5DA` | 1.94:1 | **Không đạt** |

Hệ quả: vàng trên nền giấy chỉ là trang trí (viền, đường kẻ, chấm) và không mang thông tin một mình; mọi chữ vàng phải nằm trên khối đỏ đô. Trạng thái focus dùng viền `--br-wine` 2px (không dùng vàng).
Nhớ kiểm lại tỉ lệ nếu thêm màu hồng nhạt (chữ hồng trên giấy dễ rớt dưới 4.5): hồng nhạt chỉ làm nền/chấm.

## 3. Font

| Vai trò | Font | Dùng cho |
|---|---|---|
| Tiêu đề | Playfair Display | H1/H2, ngày, nhãn thẻ |
| Thân | Cormorant Garamond | Lời mời, địa chỉ, nút, form |
| Viết tay | Great Vibes | **Chỉ** tên cô dâu chú rể và 1–2 tiêu đề rất ngắn (vd "Cảm ơn") |

- Cả 3 có subset `vietnamese` (đã kiểm). Nạp bằng `next/font/google` trong `src/themes/blush-rose/fonts.ts`, **không** đặt trong layout chung, `subsets: ["latin", "vietnamese"]`, `display: "swap"`, khai báo `variable` và gắn vào wrapper của theme.
- Weight tối thiểu: Playfair 400 + 600 (hoặc biến thiên nếu nhẹ hơn), Cormorant Garamond 400 + 600 (Cormorant nét mảnh, cỡ thân ≥ 18px, weight 500 nếu 400 mờ trên điện thoại), Great Vibes 400 (chỉ có một weight). Không nạp italic nếu không dùng.
- Great Vibes: kiểm dấu tiếng Việt (ợ, ữ, ỹ, ặ, ề…) hiển thị đúng và không bị chồng dấu/cắt ở dòng trên; kiểm với "Nguyễn Thị Thùy Dương" và "Trần Nguyễn Hoàng Bảo Long" (07 §8). Cần `line-height` ≥ 1.3 và `padding-top` để dấu không bị cắt. Dấu lỗi → fallback tên sang Playfair Display italic; chốt sau khi test trên iPhone + Zalo.
- Không dùng Great Vibes cho câu dài, địa chỉ, giờ giấc.

## 4. Hoa Redouté (CC0)

Nguồn: `src/content/ornaments/redoute.json` (8 tranh, Cleveland Museum of Art, CC0). File ra `public/images/ornaments/redoute/<file>.webp` do Tony chạy `npm run ornaments:fetch`; dev không tạo/sửa file trong `public/images/`.

| `file` | Palette | Gợi ý dùng |
|---|---|---|
| `rosa-gallica-purpurea-velutina` | do-do | Bìa (hoa lớn trên phong bì mở / đầu trang) |
| `rosa-indica-stelligera` | do-do | Thẻ lễ cưới (góc) |
| `rosa-indica` | do-do | Cảm ơn |
| `rosa-alpina-pendulina` | do-do | Dress code hoặc đệm giữa các phần. **Nền ngả vàng hơn** (xem dưới) |
| `rosa-gallica` | hong | Tên cô dâu chú rể (bên cạnh/viền) |
| `rosa-centifolia-simplex` | hong | Thẻ tiệc (góc) |
| `rosa-hudsoniana-salicifolia` | hong | Quà mừng (cạnh bao lì xì) |
| `rosa-carolina-corymbosa` | hong | Địa điểm / đệm nhẹ |

Quy tắc dùng:
- Xoá nền giấy cũ bằng CSS: `mix-blend-mode: multiply` trên nền `--br-paper`/`--br-card`. Multiply chỉ ra đúng khi ảnh nằm trực tiếp trên nền đồng màu: không đặt ảnh trong container có `opacity < 1`, `filter`, hay `isolation: isolate` che nền (tạo stacking context làm mất blend). Ghép với `<Reveal>` cần kiểm: `Reveal` animate `opacity`/transform trên wrapper, đặt wrapper **ngoài** hay bỏ blend trong lúc animate; kiểm sau khi render xong.
- **Ảnh 133045 (`rosa-alpina-pendulina`) nền ngả vàng hơn các ảnh còn lại**: sau multiply vẫn còn quầng vàng trên `#F3EDE3`. Kiểm bằng mắt trên cả hai nền (`paper`, `card`); nếu còn thấy viền hộp thì dùng `mask-image` (gradient radial/linear mờ rìa) hoặc thay bằng tranh khác; không chỉnh file gốc.
- `next/image` qua `components/home/photo.tsx` (fill + `sizes`) hoặc `next/image` trực tiếp với `width/height`. `sizes` gợi ý: hoa góc `(max-width: 480px) 45vw, 220px`; hoa bìa `(max-width: 480px) 80vw, 380px`; hoa đệm `(max-width: 480px) 60vw, 280px`.
- Lazy mọi thứ trừ ảnh bìa (`priority` chỉ cho 1 tranh bìa, dưới ngân sách asset trang đầu ≤ 600KB). Mỗi ảnh webp nên ≤ ~80KB ở kích thước hiển thị (Tony kiểm kích thước file sau fetch).
- Trang trí → `alt=""` (kèm `aria-hidden`). Chỉ giữ alt có nghĩa nếu tranh mang nội dung (hiếm: không có trường hợp nào ở đây).
- Mỗi section chỉ 1 tranh, cắt/đặt lệch ra mép (overflow ẩn) để không che chữ. Không đặt hoa đè lên tên hoặc ngày.
- Thêm 8 tranh (hoặc chỉ những tranh dùng) vào `manifest.assets` với `source` (museumUrl) + `license: "CC0"` (07 §8 Pháp lý).
- Credit: CC0 không bắt buộc nhưng đề xuất một dòng nhỏ cuối thiệp, cạnh `<Watermark>`/`<MusicCredit>`: "Tranh hoa: P.-J. Redouté, Cleveland Museum of Art (CC0)". `text-xs`, màu nhạt vẫn đạt 4.5:1 (dùng `--br-wine` với opacity ≥ 0.75 trên nền giấy; kiểm lại). Ghi đủ trong `CREDITS.md`.

## 5. Đồ hoạ tự vẽ (SVG + CSS, không raster)

| Đồ hoạ | Cách làm | Ghi chú |
|---|---|---|
| Phong bì | SVG inline: thân, nắp tam giác, 2 nếp chéo; màu `--br-card` + bóng nhẹ | Nắp mở bằng CSS `transform: rotateX` / hoặc `clip-path`; thời lượng `durationMs` từ `useEnvelope` (§6.1) |
| Con dấu sáp | SVG: vòng tròn lệch nhẹ, viền gợn, chữ cái đầu tên cặp đôi (Playfair); màu `--br-wine` + highlight vàng mờ | Chữ viết tắt lấy từ `couple.*.shortName`. Hình tròn, họa tiết riêng, **không** dùng hình trái tim (§8) |
| Bao lì xì | SVG: hình chữ nhật đứng bo nhẹ, đỏ đô, viền vàng mảnh, nắp gập; chữ vàng trên đỏ đô (6.09:1) | Mở ra bằng animation nắp, rồi mở GiftSheet (§6.8). Phần chữ "Hỷ" trang trí, không có ý khác |
| Vân giấy | SVG `feTurbulence` (baseFrequency ~0.8, numOctaves 2, `feColorMatrix` về alpha 3–5%) làm `background-image` data URI, hoặc gradient radial 2 lớp rất nhẹ | Một lớp duy nhất trên wrapper, **không** animate, không dùng `filter` trên phần tử lớn đang cuộn. Nếu cuộn giật trên máy yếu: bỏ vân, chỉ giữ màu phẳng |
| Chấm lịch, vòng tròn ngày, trái tim lịch | SVG nhỏ / CSS | Xem §6.5 |

Giữ tổng SVG nhỏ (mỗi cái vài KB), dùng lại bằng component, tránh `filter` blur lớn. Ngân sách: JS theme ≤ 80KB gzip, asset trang đầu ≤ 600KB (07 §8).

## 6. Các section (đúng thứ tự)

> **Tony xác nhận: thiếu 2 section hay đếm gộp?** Tony nói 11 section nhưng chỉ liệt kê 9 mục. Brief ghi đúng 9; không tự thêm. (Nếu cần thêm: ứng viên hiển nhiên là Đếm ngược và Lịch trình, nhưng Lịch trình nằm ở "Để sau".)

Ánh xạ vào contract: `SectionKey` hiện chỉ có `cover | invitation | couple | events | countdown | album | gift | rsvp | thanks`. Section Địa điểm và Dress code **không có key riêng**: Địa điểm nằm trong `events`, Dress code đi theo `options.dressCode` (có/không có thì hiện/ẩn). Section bị tắt hoặc thiếu dữ liệu thì bỏ qua, thứ tự không đổi (07 §10). `supportedSections` dự kiến: `cover, invitation, couple, events, album, rsvp, gift, thanks` (không có `countdown` vì Tony không liệt kê; Tony xác nhận).

Cấu trúc client: một lá `Experience.tsx` (`"use client"`) giữ `useMusic` + `Envelope`/phong bì + `MusicToggle` (hàm `music.unlock` không qua được ranh giới Server → Client), nội dung thiệp là `children` render ở server. Theo mẫu `src/themes/placeholder/Experience.tsx`. Các section còn lại là Server Component, trừ lá cần state (coverflow, lịch, RSVP, GiftSheet).

### 6.1 Bìa — phong bì + ảnh cài, bấm mở

- Mục đích: ấn tượng đầu, cú chạm mở khoá nhạc.
- Dữ liệu: `content.cover` (ảnh cưới), `couple.*.shortName`, `weddingDate`/`events[0].dateLabel`, `guest?.salutation` (chỉ khi có token).
- Primitive: `useEnvelope({ onOpen: music.unlock })` (trạng thái `closed → opening → open`, `durationMs`, `reducedMotion`) để tự vẽ phong bì. Cách nhanh hơn: `<Envelope onOpen={music.unlock}>` (overlay tối giản có sẵn, chỉ truyền cover làm `children`). Vì phong bì ở đây là đồ hoạ riêng nên dùng hook và tự vẽ; `skip()` cho "Bỏ qua" nếu cần. `<MusicToggle music={music} hidden={!musicSrc || mode === "preview"} />`.
- Hoa/đồ hoạ: phong bì SVG, con dấu sáp ở giữa nắp (bấm vào dấu = mở), ảnh cưới cài chéo trên mặt phong bì (khung giấy, bóng nhẹ, hơi nghiêng ~-3°), tranh `rosa-gallica-purpurea-velutina` ló ra từ sau phong bì.
- Hiệu ứng: nắp phong bì lật mở + ảnh nhô lên + phong bì trượt xuống/mờ dần để lộ thiệp, tổng ~900–1200ms. `reducedMotion` → fade 200ms, vẫn phải chạm để mở (gesture cho nhạc). `mode="preview"` mở được nhưng không phát nhạc.
- Mobile: ảnh cưới cắt tỉ lệ 3:4 hoặc 4:5, `priority`, `sizes="(max-width: 480px) 80vw, 380px"`. Phong bì rộng ≤ 90vw. Không có `cover` → phong bì chỉ còn tên + con dấu. `focusAfterOpen` về `main`.
- Mở xong: `useEnvelope` khoá cuộn lúc đóng, mở khoá khi open. Phía dưới phải SSR đầy đủ (progressive enhancement như `Envelope`).

### 6.2 Tên cô dâu chú rể

- Mục đích: tên là trung tâm, chữ viết tay lớn.
- Dữ liệu: `couple.bride/groom.fullName` (+ `brideFirst` quyết thứ tự), `couple.*.photo` (nếu có), `families.*Parents`. Lời dẫn mời dùng `inviteMessage`, `guest?.salutation`.
- Primitive: `<Reveal>`.
- Hoa: `rosa-gallica` ở góc/viền; vân giấy toàn trang.
- Hiệu ứng: tên fade-in lần lượt (`delayMs` 0 / 150 / 300), chữ "&" nhỏ giữa hai tên. Reduced-motion: `Reveal` tự tắt.
- Mobile: Great Vibes ~44–56px, tên dài tự xuống dòng (`text-wrap: balance`), tên dài như "Trần Nguyễn Hoàng Bảo Long" không tràn 390px (dùng `fullName` tách dòng hoặc `shortName` ở cỡ lớn, `fullName` ở cỡ nhỏ bên dưới).

### 6.3 Thẻ lễ cưới (có ngày âm lịch)

- Mục đích: thẻ chính của lễ (vu quy/thành hôn): ngày giờ, địa điểm, âm lịch.
- Dữ liệu: `events[]` kind `vu-quy` / `thanh-hon`: `title`, `dateLabel`, `timeLabel`, `lunarLabel`, `venue`, `address`, `side`. Cha mẹ: `families`.
- Primitive: `<Reveal>`. Âm lịch **đã có sẵn** trong `lunarLabel` (do server tính). Nếu thiếu `lunarLabel` mà có `startsAt` thì dùng `solarToLunar` + `formatLunarDate` từ `_shared/lunar.ts` (cần chuyển ngày sang `Asia/Ho_Chi_Minh` trước, 07 §11) — không tự tính lại ở theme nếu `lunarLabel` có.
- Hoa/đồ hoạ: thẻ `--br-card` viền vàng mảnh (1px), góc tranh `rosa-indica-stelligera`; con dấu sáp nhỏ trang trí ở đáy (hình tròn).
- Hiệu ứng: thẻ trượt lên nhẹ khi vào viewport.
- Mobile: một thẻ/hàng; 1–4 sự kiện đều ổn; ngày to (Playfair), âm lịch nhỏ dưới ("Tức ngày … tháng … năm …"). Hiện `side` thành nhãn nhà trai/nhà gái nếu có. Thẻ cho khách có token chỉ gồm sự kiện được mời (`guest.invitedEventIds`).

### 6.4 Album ảnh — coverflow (vuốt được, bàn phím được)

- Mục đích: lướt ảnh cưới, ảnh giữa nổi, hai bên nghiêng và mờ.
- Dữ liệu: `content.album[]` (`src, alt, width, height, credit?`). Không có ảnh → bỏ section.
- Primitive: `<Reveal>`. **Cần mới: coverflow** (`CoverflowAlbum`, `"use client"`). Nằm trong theme (`src/themes/blush-rose/sections/Album.tsx`); nếu mẫu thứ 2 cũng dùng thì nâng lên `_shared/` sau, không làm sẵn.
- Gợi ý làm: CSS `scroll-snap-type: x mandatory` trên container, mỗi ảnh `scroll-snap-align: center`; hiệu ứng nghiêng/scale bằng `animation-timeline: view()` (nếu hỗ trợ) hoặc IntersectionObserver gắn `data-active`. Không thêm thư viện.
- Truy cập: container `role="region"` + `aria-roledescription="carousel"` + `aria-label`; phím ←/→ chuyển ảnh; nút Trước/Sau có `aria-label`; chỉ báo vị trí "3/8" (`aria-live="polite"`); ảnh có `alt` có nghĩa từ dữ liệu.
- Hiệu ứng: nghiêng `rotateY` ~35°, `scale` 0.85 cho ảnh ngoài rìa. Reduced-motion: bỏ nghiêng/scale, chỉ cuộn ngang snap thường.
- Mobile: ảnh giữa ~70vw, thấy rìa hai ảnh bên; ảnh `loading="lazy"` trừ ảnh đầu; `sizes="70vw"`. Giữ `touch-action: pan-y pinch-zoom` để vuốt ngang không chặn cuộn dọc.
- Lightbox (07 §10 nhắc "mở lightbox"): để sau, không thuộc brief này (thêm vào Để sau).

### 6.5 Thẻ tiệc + lịch trái tim khoanh ngày + thêm vào lịch + RSVP

- Mục đích: thông tin tiệc, hình dung ngày cưới trên lịch tháng, rồi xác nhận tham dự.
- Dữ liệu: `events[]` kind `tiec` / `an-hoi` / `tan-hon` (giờ, địa điểm, âm lịch), `weddingDate`, `guest` (nếu có), `maxAttendees`, `invitedEventIds`, `rsvp`, `mode`.
- Primitive:
  - `<AddToCalendar event={…} />` (client, tạo `.ics` + link Google Calendar; `calendar.ts` gọi `buildIcs`, `googleCalendarUrl`).
  - `<RsvpForm mode events={…} invitedEventIds maxAttendees rsvp />` (nhận trường từ `guest`, **không** truyền cả `guest` hay `token` cho client leaf mới, nhưng `RsvpForm` đã tự xử lý token theo thiết kế của nó). Chỉ hiện khi có `guest` hoặc `mode="demo"` (07 §10 #6). Trạng thái "đã trả lời" lấy từ `rsvp`.
  - `<Reveal>`.
- **Cần mới: lịch tháng hình trái tim** (`HeartCalendar`). Server Component thuần SVG/CSS: lưới tháng 7 cột (T2–CN) từ `weddingDate`, ngày cưới được khoanh bằng đường trái tim (SVG path) màu `--br-wine`, các ngày khác `--br-wine` mờ. Thuần hàm tính lưới tháng đặt ở `src/themes/blush-rose/month-grid.ts` (hoặc `_shared/` nếu dùng lại), kèm test. Phải đúng thứ trong tuần theo Asia/Ho_Chi_Minh, lấy ngày dân sự từ `dateLabel`/`startsAt` đã quy về VN, không `new Date(...)` local. Trái tim ở đây là **khoanh ngày**, khác "con dấu hình trái tim" của mẫu tham khảo (§8) vì ta tự vẽ, và hình mảnh một nét.
  - Cho `aria`: lịch có `role="img"` + `aria-label="Tháng 12 năm 2026, ngày 12 được khoanh"` (không bắt đọc từng ô).
- Hoa/đồ hoạ: `rosa-centifolia-simplex` ở góc thẻ; thẻ `--br-card`.
- Hiệu ứng: nét trái tim vẽ ra (`stroke-dashoffset`) khi vào viewport, ~800ms; reduced-motion: hiện sẵn.
- Mobile: thứ tự thẻ tiệc, lịch, nút thêm vào lịch (rộng full, ≥ 44px), RSVP; lịch rộng ≤ 100% - padding, ô ≥ 36px. Form RSVP: vùng chạm lớn, lỗi hiện rõ; `mode="preview"` không submit.

### 6.6 Địa điểm — chỉ link chỉ đường (chưa nhúng bản đồ)

- Mục đích: dẫn khách tới nơi.
- Dữ liệu: `events[].venue`, `address`, `mapUrl`.
- Primitive: `<MapButton url={event.mapUrl} label="Chỉ đường" />` (Server Component; không `mapUrl` → không render nút).
- Hoa/đồ hoạ: tên + địa chỉ trên thẻ, icon ghim SVG nhỏ viền vàng; có thể dùng `rosa-carolina-corymbosa` rất nhỏ bên cạnh.
- Hiệu ứng: không (hoặc `Reveal`).
- Mobile: nút full-width, ≥ 44px; địa chỉ dài tự xuống dòng. Mỗi sự kiện một dòng chỉ đường nếu có nhiều địa điểm. **Không** nhúng iframe/bản đồ (Để sau).

### 6.7 Dress code — gợi ý màu khách nên mặc (chấm màu)

- Mục đích: gợi ý bảng màu trang phục.
- Dữ liệu: `options.dressCode` (mảng 1–5 hex `#RRGGBB`, schema `dressCodeSchema` đã có trong `_shared/dress-code.ts`, placeholder đã ghép vào `optionsSchema`). Không có `dressCode` → bỏ section.
- Primitive: `dressCodeSchema` (validate options). **Cần mới: UI hiển thị chấm màu** (07 §11 nói chưa có UI): `DressCodeDots` nằm trong theme (`sections/DressCode.tsx`), Server Component. Mỗi chấm là `<li>` tròn ~40px có viền mảnh (để chấm màu nhạt vẫn thấy trên giấy) và nhãn tên màu bằng chữ (tên màu có thể là chuỗi hex hoặc tên do Tony đặt sau; lúc này chỉ hiện hex nhỏ hoặc không hiện). Màu không là tín hiệu duy nhất → có chữ mô tả "Gợi ý màu trang phục: …". Mặc định `defaultOptions.dressCode` = đỏ đô + hồng nhạt + kem (vd `#4A161A`, `#E8B9C3`, `#F3EDE3`).
- Cách để Tony chỉnh màu trong builder: chưa có UI chọn màu (ngoài phạm vi theme).
- Hoa/đồ hoạ: `rosa-alpina-pendulina` (xem lưu ý nền ngả vàng §4) hoặc bỏ hoa.
- Hiệu ứng: chấm hiện lần lượt (`Reveal delayMs`); reduced-motion: tắt.
- Mobile: chấm xếp hàng giữa, tối đa 5 chấm vừa 390px (5×40 + khoảng cách ≤ 300px).

### 6.8 Quà mừng — bao lì xì SVG mở ra GiftSheet/QR

- Mục đích: nút "Gửi quà mừng" cho mọi khách (kể cả trang chung không token).
- Dữ liệu: `content.gifts[]` (`side`, `bankName`, `accountNumber`, `accountName`, `qrSvg`). Không có tài khoản → không render nút/section.
- Primitive: `<GiftButton cards={toGiftCards(gifts)} …>` hoặc `<Gift gifts={gifts}>` (nút + `GiftSheet` bottom sheet có sẵn: QR, ngân hàng, STK, nút Sao chép "Đã sao chép", khoá cuộn, focus trap, Esc). `children` của nút là bao lì xì SVG tự vẽ (xem props `className`, `children` ở `Gift/GiftButton`). STK/QR **không** hiện trên trang trước khi bấm (07 §10).
- Hoa/đồ hoạ: bao lì xì SVG (§5) ở giữa, `rosa-hudsoniana-salicifolia` bên cạnh.
- Hiệu ứng: nắp bao lì xì gập mở ~400ms rồi mở sheet (nếu mở sheet đồng bộ với chạm thì trình duyệt không chặn; animation không chặn `onClick`). Reduced-motion: mở sheet ngay.
- Mobile: bao lì xì ≥ 120×160px, vùng chạm cả bao; nhãn rõ "Gửi quà mừng" bằng chữ (không chỉ icon). Sheet dùng của `_shared`, theme chỉ đổi màu qua class nếu `GiftSheet` cho phép; không sửa `_shared`.

### 6.9 Cảm ơn

- Mục đích: khép thiệp.
- Dữ liệu: tên cặp đôi (`couple.*.shortName`), lời cảm ơn (cố định trong theme hoặc tuỳ chọn sau; không dùng `inviteMessage`).
- Primitive: `<Reveal>`, `<Watermark show={content.showWatermark} />` (Free: **luôn hiện** kể cả khi tắt Cảm ơn, 07 §10), `<MusicCredit track={…} hidden={mode === "preview"} />` (07 §9).
- Hoa/đồ hoạ: `rosa-indica` lớn, con dấu sáp nhỏ với chữ cái đầu; chữ ký bằng Great Vibes ("Cảm ơn" 1–2 từ).
- Hiệu ứng: fade-in; không loop.
- Mobile: chừa `padding-bottom` + `env(safe-area-inset-bottom)` để nút ♪ nổi không che Watermark/credit hoa Redouté. Dòng credit Redouté (CC0, §4) ở cuối, chữ nhỏ.

## 7. Ranh giới

### **KHÔNG dùng**

- **Hình kiến trúc** (cổng, tháp, cầu, nhà thờ…) của mẫu tham khảo.
- **Hoa mẫu đơn** (chỉ dùng hoa hồng Redouté đã chọn).
- **Con dấu hình trái tim** của mẫu tham khảo (con dấu của ta là hình tròn, họa tiết riêng).
- Chỉ lấy cảm hứng bố cục từ mẫu tham khảo; không chép hình, không chép chữ, không chép màu theo từng điểm ảnh.
- Cũng không: chữ vàng `#C4A257` trên nền giấy; chữ Great Vibes cho đoạn dài; ảnh raster cho phong bì/dấu sáp/lì xì; `dangerouslySetInnerHTML` (cấm trong `src/themes/**`); STK/QR hiện sẵn trên trang; thêm thư viện.

### Để sau

- Lịch trình (timeline) trong ngày.
- Bản đồ nhúng (iframe/Maps embed).
- Sổ lưu bút.
- Lightbox cho album; đếm ngược; UI chọn màu dress code trong builder.

## 8. QA checklist (tóm tắt)

Làm đủ `docs/07-THEMES.md` §8 (nội dung & tiếng Việt, thiết bị, hiệu năng, trải nghiệm, pháp lý). Điểm riêng của mẫu này:

- [ ] Great Vibes: ợ ữ ỹ ặ ề đúng dấu, không bị cắt (iOS Safari + Zalo)
- [ ] 2 tên dài mẫu (07 §8) không tràn 390px / 375px, không vỡ dòng xấu
- [ ] Hoa Redouté sau multiply không thấy viền hộp; riêng `rosa-alpina-pendulina` kiểm 2 nền
- [ ] Coverflow: vuốt, bàn phím ←/→, reduced-motion; không chặn cuộn dọc
- [ ] Lịch trái tim đúng thứ ngày trong tuần, khoanh đúng ngày (kể cả ngày đầu/cuối tháng)
- [ ] Bao lì xì mở sheet bằng bàn phím (Enter/Space), focus trap + Esc
- [ ] Dress code: 1 màu và 5 màu đều đẹp; không có `dressCode` thì ẩn
- [ ] Tương phản chữ ≥ 4.5 (xem bảng §2); không chữ vàng trên giấy
- [ ] JS theme ≤ 80KB gzip, asset trang đầu ≤ 600KB, LCP ≤ 2.5s, CLS ≤ 0.1
- [ ] `manifest.assets` liệt kê tranh Redouté (CC0) + `CREDITS.md`
- [ ] `mode="preview"` không phát nhạc, không submit RSVP

Điều kiện `status` catalog `preview → live` (`docs/12-THEME-CATALOG.md`): mẫu **có trong registry** (`src/themes/registry.ts`, slug khớp catalog/thư mục) **và qua QA** (07 §8), manifest `published`; Tony test iPhone + Zalo thật rồi mới chốt. Test của catalog kiểm mọi mẫu `live` đều có trong registry.

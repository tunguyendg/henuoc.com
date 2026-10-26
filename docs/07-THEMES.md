# 07 — Theme Engine & Quy trình sản xuất theme

**Version:** 2.1 · 2026-10-22 · Hành trình khách: §10 · Theme là **sản phẩm chính**. File này quan trọng ngang Architecture.

## 1. Nguyên tắc

1. **Dữ liệu tách khỏi theme.** Theme chỉ nhận props, không query DB, không biết user. Đổi theme = đổi `themeSlug`, dữ liệu giữ nguyên.
2. **Mỗi theme một layout thật.** Khác bố cục, nhịp cuộn, cách mở thiệp, hiệu ứng — không phải cùng khung đổi màu.
3. **Logic dùng chung, giao diện riêng.** RSVP, countdown, âm lịch, QR, nhạc là **headless hook/primitive** dùng chung; theme chỉ lo phần nhìn.
4. **Pin version.** Sửa breaking theme → tăng `version`, giữ code version cũ cho đến khi không còn wedding nào dùng.
5. **Mọi asset có giấy phép thương mại**, ghi trong manifest.

## 2. Hợp đồng (contract)

```ts
// src/themes/types.ts
export type StyleSlug =
  | "hien-dai" | "toi-gian" | "truyen-thong" | "han-quoc"
  | "hoa-la" | "vintage" | "sang-trong";

export type SectionKey =
  | "cover" | "invitation" | "couple" | "events" | "countdown"
  | "album" | "gift" | "rsvp" | "thanks";

export interface ThemeManifest<TOptions = unknown> {
  slug: string;                 // "hong-pastel"
  version: number;              // 1
  name: string;                 // "Hồng Pastel"
  styles: StyleSlug[];
  tier: "free" | "premium";
  status: "draft" | "review" | "published";   // chỉ "published" vào gallery + sitemap
  description: string;          // 80–150 chữ, viết tay, dùng cho SEO
  thumbnail: string;            // /themes/hong-pastel/thumb.webp (3:4, ≤ 120KB)
  ogImage: string;              // 1200×630
  supportedSections: SectionKey[];
  optionsSchema: z.ZodType<TOptions>;   // vd { palette: "rose" | "sage" }
  defaultOptions: TOptions;
  assets: { file: string; source: string; license: string }[];
}

export interface WeddingContent {
  couple: { bride: Person; groom: Person; brideFirst: boolean };
  families: { brideParents?: string; groomParents?: string; brideAddr?: string; groomAddr?: string };
  events: EventView[];          // đã kèm lunarLabel, dateLabel, timeLabel, icsUrl, mapUrl
  inviteMessage: string;
  cover?: ImageView;
  album: ImageView[];
  gifts: GiftView[];            // đã kèm qrSvg
  sections: Record<SectionKey, boolean>;
  music?: { src: string; title: string };
  weddingDate?: string;         // ISO
  showWatermark: boolean;
}

export interface GuestContext {
  salutation: string;           // "Trân trọng kính mời Anh Minh & Gia đình"
  invitedEventIds: string[];
  maxAttendees: number;
  rsvp?: { status: "ATTENDING" | "DECLINED"; attendeeCount: number; eventIds: string[]; message?: string };
  token: string;                // chỉ để submit RSVP; không render ra text
}

export interface ThemeProps<TOptions = unknown> {
  content: WeddingContent;
  guest?: GuestContext;         // undefined ở /thiepcuoi/[slug] và demo
  options: TOptions;
  mode: "live" | "preview" | "demo";   // preview = trong builder (không phát nhạc, không submit RSVP)
}
```

`src/themes/registry.ts`: map `slug → { manifest, load: () => import("./hong-pastel") }` — **dynamic import**, mỗi thiệp chỉ tải JS của đúng theme đó.

## 3. Primitive dùng chung (`src/themes/_shared/`)

| Primitive | Loại | Theme tuỳ biến bằng |
|---|---|---|
| `useEnvelope()` | hook | trạng thái `closed → opening → open`, theme tự vẽ phong bì/màn mở. Hàm `open()` gọi `music.unlock()` **trong cùng handler chạm** (§10) |
| `useMusic(src)` 🔴 | hook | **Tony tự code** (T-013 chỉ tạo interface + hàm rỗng). `unlock()` / `toggle()`; chỉ play sau user gesture; tự dừng khi tab ẩn (`visibilitychange`), quay lại thì phát tiếp nếu khách chưa tắt; nhớ trạng thái tắt |
| `<MusicToggle>` | component | nút ♪ nổi (fixed, safe-area), `aria-pressed`, `className`, icon slot |
| `useCountdown(date)` | hook | trả `{ days, hours, minutes, seconds, isPast }` |
| `<AddToCalendar event>` | component | tạo `.ics` + link Google Calendar |
| `<MapButton url>` | component | |
| `<GiftButton>` + `<GiftSheet gifts>` | component | nút "Gửi quà mừng" mở bottom sheet: QR (SVG có sẵn), ngân hàng, tên, STK + nút sao chép. Theme vẽ nút, sheet dùng chung |
| `useRsvpForm(guest)` | hook | state, validate (zod chung), submit `/api/rsvp`, trạng thái success/error |
| `<RsvpForm>` | component | giao diện form RSVP dùng `useRsvpForm`; T-013 submit giả (chưa có `/api/rsvp`) |
| `<Reveal>` | component | fade/slide khi vào viewport, tự tắt khi `prefers-reduced-motion` |
| `<Watermark>` | component | Free plan |

Theme **bắt buộc** dùng các primitive này cho logic. Theme không tự gọi `fetch` RSVP.

## 4. Cấu trúc một theme

```
src/themes/hong-pastel/
  manifest.ts
  index.tsx              # export default function Theme(props: ThemeProps<Options>)
  fonts.ts               # next/font/google, subsets: ["vietnamese"]
  theme.module.css       # hoặc Tailwind với data-theme scope — không rò style ra ngoài
  sections/
    Cover.tsx  Invitation.tsx  Couple.tsx  Events.tsx  Album.tsx  Gift.tsx  Rsvp.tsx  Thanks.tsx
public/themes/hong-pastel/
  thumb.webp  og.webp  ornaments/*.svg  …
```

Dữ liệu demo dùng chung: `src/themes/_demo/content.ts` (cặp đôi mẫu "Minh Anh & Hoàng Nam", 2 sự kiện vu quy + thành hôn, 8 ảnh có credit).

## 5. Ba theme MVP (M1)

| Slug | Tên | Phong cách | Tier | Ý tưởng layout |
|---|---|---|---|---|
| `blush-rose` (cũ `hong-pastel`) | Blush Rose | lang-man-hoa-la | free | Phong bì hồng mở ra → cuộn dọc, card bo tròn xen hoa watercolor, ảnh bìa khung vòm, chữ script cho tên |
| `song-hy-do-son` (cũ `song-hy`) | Song Hỷ Đỏ Son | truyen-thong-viet | free | Nền đỏ son, viền hoa văn vàng kim, bố cục **đối xứng trung tâm**, chữ Hỷ, lời mời trang trọng kiểu thiệp giấy truyền thống, cuộn như mở cuộn thư |
| `modern-editorial` (cũ `ban-tin`, làm sau 5 mẫu đầu) | Modern Editorial | hien-dai-nghe-thuat, toi-gian | premium | Kiểu tạp chí: typography cực lớn, lưới bất đối xứng, ảnh full-bleed, dải ảnh cuộn ngang, đen–kem, không phong bì (mở bằng "lật trang") |

Danh mục đầy đủ 10 phong cách × 20 mẫu và thứ tự 5 mẫu đầu (song-hy-do-son, ivory-editorial, blush-rose, seoul-romance, royal-gold): `12-THEME-CATALOG.md`.

## 6. Quy trình sản xuất (Tony → Claude → Codex)

```
1. Tony   : gửi 3–6 ảnh reference (Pinterest, thiệp giấy, web) + 1 câu "cảm giác muốn có"
2. Claude : viết docs/themes/<slug>.md theo template §7 (moodboard → token → từng section → motion)
3. Tony   : duyệt spec (sửa chữ, không cần code)
4. Codex  : branch feat/theme-<slug>, implement theo spec, dùng primitive §3
5. Claude : review code + chạy QA checklist §8, gom lỗi
6. Codex  : sửa theo batch lỗi
7. Tony   : test trên iPhone + Zalo thật, chốt status "published"
```

## 7. Template spec theme (`docs/themes/<slug>.md`)

```markdown
# Theme: <Tên> (`<slug>`) · v1

## Cảm giác
1–2 câu. Ví dụ: "Như mở một phong thư hồng buổi sáng — nhẹ, tươi, nữ tính, không sến."

## Reference
- ảnh 1 (link/nguồn) — lấy gì: bảng màu
- ảnh 2 — lấy gì: cách xếp tên cặp đôi

## Tokens
| Token | Giá trị |
| bg | #… | surface | #… | text | #… | accent | #… |
| font display | … (đã kiểm tra subset vietnamese) | font body | … | font script | … |
Options: palette variants (nếu có)

## Mở thiệp
Mô tả trạng thái closed / animation opening (thời lượng) / open. Reduced-motion: thay bằng fade 200ms.

## Sections (theo thứ tự)
### cover — bố cục, ảnh (tỉ lệ, crop), chữ, trang trí, phong bì đóng (xem "Mở thiệp")
### invitation — vị trí lời mời; với guest: dòng danh xưng hiển thị thế nào; cặp đôi + bố mẹ hai bên
### events — card / timeline; hiển thị âm lịch; nút chỉ đường, thêm lịch
### countdown — …
### album — grid / masonry / carousel; lightbox
### rsvp — form style; trạng thái đã trả lời
### gift — kiểu nút "Gửi quà mừng"; nhãn nhà trai / nhà gái trong sheet
### thanks — …

## Motion
Danh sách hiệu ứng, thời lượng, trigger. Tối đa 1 hiệu ứng "wow" (mở thiệp); còn lại tiết chế.

## Asset cần
| File | Nguồn | Giấy phép |

## Không được
Ví dụ: không dùng chữ trắng trên ảnh sáng không overlay; không hoa văn che tên.
```

## 8. QA checklist (bắt buộc trước "published")

**Nội dung & tiếng Việt**
- [ ] Tên dài "Nguyễn Thị Thùy Dương" & "Trần Nguyễn Hoàng Bảo Long" không vỡ dòng xấu, không tràn
- [ ] Dấu tiếng Việt đúng ở mọi font (đặc biệt font script)
- [ ] 1 sự kiện và 4 sự kiện đều đẹp; thiếu ảnh album vẫn đẹp; không có QR vẫn đẹp
- [ ] Danh xưng guest dài "Trân trọng kính mời Cô Chú Năm Hoà & Gia đình" hiển thị tốt
- [ ] Âm lịch hiển thị đúng

**Thiết bị**
- [ ] iPhone SE (375), iPhone 15 (393), Android 412, desktop 1280 (thiệp căn giữa max-width ~480px)
- [ ] Trình duyệt trong Zalo (iOS + Android), Safari, Chrome
- [ ] Notch / safe-area không che nội dung

**Hiệu năng**
- [ ] JS của theme ≤ 80KB gzip; asset trang đầu ≤ 600KB
- [ ] LCP ≤ 2.5s (Lighthouse mobile, throttling 4G)
- [ ] Ảnh lazy-load ngoài màn đầu, có width/height (CLS ≤ 0.1)
- [ ] Font chỉ load weight cần dùng

**Trải nghiệm**
- [ ] Nhạc không tự phát; phát ngay khi chạm mở phong bì (test cả trình duyệt Zalo iOS); nút ♪ luôn thấy được
- [ ] Chuyển tab / khoá màn hình → nhạc dừng; quay lại → phát tiếp, trừ khi khách đã tắt
- [ ] Không thấy STK/QR trên trang cho tới khi bấm "Gửi quà mừng"; nút sao chép báo "Đã sao chép"
- [ ] `prefers-reduced-motion`: không animation lớn
- [ ] Contrast chữ nội dung chính ≥ 4.5 (trên ảnh phải có overlay)
- [ ] RSVP: gửi, sửa, lỗi mạng, vượt số người — đều có phản hồi rõ
- [ ] `mode="preview"` không phát nhạc, không submit

**Pháp lý**
- [ ] Mọi asset có trong `manifest.assets` với nguồn + giấy phép

## 9. Nhạc nền

- Kho nhạc import tĩnh từ `src/content/music/library.json` qua `src/data/music.ts` (`Track`, `getTracks({ enabled: true })`, `getTrack(slug)`). Theme chọn `options.musicSlug`, Zod chỉ chấp nhận slug tồn tại và enabled. Không đọc file lúc render.
- Mỗi bài ghi tác giả + link nguồn + loại giấy phép trong `CREDITS.md` (mục "Nhạc nền"). Bài nào không ghi được giấy phép → không đưa vào.
- **Không cho người dùng upload nhạc** (rủi ro bản quyền, bị gỡ thiệp). Chỉ chọn từ thư viện.
- File phát hiện tại: `public/audio/library/<slug>.m4a`; `preload="none"`. Mọi track enabled phải có file, không có giọng hát. Chỉ track có `license === "CC-BY-4.0"` hiện credit qua `MusicCredit` (`src/themes/_shared/`): một dòng `Nhạc nền (đã chỉnh sửa): <credit>` (CC BY 4.0 bắt buộc ghi đã chỉnh sửa — mình cắt, fade, chuẩn hoá âm lượng), chữ nhỏ (`text-xs`, màu nhạt) ở cuối thiệp cạnh Watermark, giữ đầy đủ nội dung credit và chuẩn hoá xuống dòng thành khoảng trắng. Credit vẫn hiện khi tắt Watermark hoặc phần Cảm ơn; ẩn trong preview. Track PD/CC0/Pixabay không hiện credit. `MusicToggle` chỉ có nút ♪ tròn, không có bong bóng tên bài/credit. Demo placeholder dùng `canon-in-d-usaf`; không sửa hook `useMusic` trong phần tích hợp kho.
- **Không** dùng nhạc trending TikTok/YouTube.

## 10. Trải nghiệm khách

Quyết định của Tony (2026-10-22). Mọi theme đi đúng hành trình này; theme chỉ khác phần nhìn và motion.

### Hành trình 8 phần

| # | Phần | Khách làm gì | Ghi chú |
|---|---|---|---|
| 1 | **Bìa → mở phong bì** | Thấy tên cặp đôi, ngày cưới (và danh xưng nếu có token), chạm để mở nắp | Cú chạm này là **user gesture mở khoá nhạc** |
| 2 | **Lời mời** | Đọc lời mời, danh xưng riêng, cặp đôi + bố mẹ hai bên | Không có token → lời mời chung |
| 3 | **Sự kiện** | Xem giờ, địa điểm, âm lịch; chỉ đường; thêm vào lịch | Có token → chỉ sự kiện khách được mời |
| 4 | **Đếm ngược** | Thấy còn bao lâu | Qua ngày cưới → ẩn hoặc đổi thành "Đã diễn ra" |
| 5 | **Album** | Lướt ảnh, mở lightbox | Không có ảnh → bỏ phần này |
| 6 | **RSVP** | Xác nhận đi / không đi, số người, lời nhắn | Chỉ khi có token. Ngoại lệ: `mode="demo"` hiện form với submit giả để khách xem mẫu |
| 7 | **Mừng cưới** | Bấm "Gửi quà mừng" → bottom sheet | Xem dưới |
| 8 | **Cảm ơn** | Lời cảm ơn khép thiệp | Free: watermark ở cuối thiệp, **luôn hiện kể cả khi tắt phần Cảm ơn** |

Phần bị tắt trong `sections` hoặc thiếu dữ liệu thì bỏ qua; thứ tự không đổi.

### Phong bì & nhạc

- Trình duyệt (Safari, Chrome, webview Zalo) **chặn autoplay có tiếng**. Nhạc chỉ phát được khi `audio.play()` được gọi
  **đồng bộ trong handler của cú chạm**, không qua `setTimeout`, `await` hay sau animation.
- Vì vậy `useEnvelope().open()` gọi `music.unlock()` ngay đầu handler, rồi mới chạy animation mở nắp. `play()` bị từ chối
  (trình duyệt lạ) → nuốt lỗi, nút ♪ hiện trạng thái tắt, thiệp vẫn mở bình thường.
- **Nút ♪ nổi**: luôn thấy (fixed, tránh safe-area), bấm để bật/tắt, có `aria-label`. Khách tắt → nhớ trong
  `sessionStorage` (bọc try/catch), không tự bật lại.
- **Tự dừng khi chuyển tab** (`visibilitychange` → hidden): pause. Quay lại → phát tiếp chỉ khi khách chưa tắt.
- `prefers-reduced-motion`: bỏ animation mở nắp (fade 200ms), **vẫn cần chạm** để mở — cú chạm vẫn là gesture cho nhạc.
- `mode="preview"`: phong bì mở được nhưng không phát nhạc. Không có nhạc (`music` undefined) → không render nút ♪.
- Nhạc chỉ từ thư viện có giấy phép (§9), không upload.

### Mừng cưới

- Nút **"Gửi quà mừng"** hiện cho **mọi khách**, kể cả trang chung `/thiepcuoi/[slug]` không có token.
- **STK và QR không hiện trên trang.** Chỉ hiện trong bottom sheet khi khách bấm nút: tối đa 2 thẻ (nhà trai / nhà gái),
  mỗi thẻ có QR VietQR, ngân hàng, tên chủ tài khoản, STK + nút **Sao chép** (báo "Đã sao chép", fallback chọn chữ nếu
  Clipboard API không có).
- Sheet: đóng bằng nút ×, vuốt xuống hoặc chạm nền; khoá cuộn nền; focus trap; `Esc` đóng.
- Không có tài khoản nào → không render nút.
- ⚠️ Đây là **ẩn trên giao diện, không phải bảo mật**: nếu `gifts` nằm sẵn trong props thì STK vẫn có trong payload trang.
  STK là thông tin cặp đôi chủ động đưa cho khách nên chấp nhận được. Muốn chặn bot cào STK → tải `gifts` khi bấm
  (route riêng, có rate limit), làm sau nếu cần.

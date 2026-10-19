# 07 — Theme Engine & Quy trình sản xuất theme

**Version:** 2.0 · 2026-10-19 · Theme là **sản phẩm chính**. File này quan trọng ngang Architecture.

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
  guest?: GuestContext;         // undefined ở /w/[slug] và demo
  options: TOptions;
  mode: "live" | "preview" | "demo";   // preview = trong builder (không phát nhạc, không submit RSVP)
}
```

`src/themes/registry.ts`: map `slug → { manifest, load: () => import("./hong-pastel") }` — **dynamic import**, mỗi thiệp chỉ tải JS của đúng theme đó.

## 3. Primitive dùng chung (`src/themes/_shared/`)

| Primitive | Loại | Theme tuỳ biến bằng |
|---|---|---|
| `useEnvelope()` | hook | trạng thái `closed → opening → open`, theme tự vẽ phong bì/màn mở |
| `useMusic(src)` | hook | play/pause, chỉ play sau user gesture, nhớ trạng thái tắt |
| `<MusicToggle>` | component | `className`, icon slot |
| `useCountdown(date)` | hook | trả `{ days, hours, minutes, seconds, isPast }` |
| `<AddToCalendar event>` | component | tạo `.ics` + link Google Calendar |
| `<MapButton url>` | component | |
| `<GiftQR gift>` | component | render SVG có sẵn, nút copy STK |
| `useRsvpForm(guest)` | hook | state, validate (zod chung), submit `/api/rsvp`, trạng thái success/error |
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
| `hong-pastel` | Hồng Pastel | hoa-la, hien-dai | free | Phong bì hồng mở ra → cuộn dọc, card bo tròn xen hoa watercolor, ảnh bìa khung vòm, chữ script cho tên |
| `song-hy` | Song Hỷ | truyen-thong | free | Nền đỏ son, viền hoa văn vàng kim, bố cục **đối xứng trung tâm**, chữ Hỷ, lời mời trang trọng kiểu thiệp giấy truyền thống, cuộn như mở cuộn thư |
| `ban-tin` | Bản Tin | toi-gian, sang-trong | premium | Kiểu tạp chí: typography cực lớn, lưới bất đối xứng, ảnh full-bleed, dải ảnh cuộn ngang, đen–kem, không phong bì (mở bằng "lật trang") |

Sau MVP: thêm 2 theme/tuần → mục tiêu 10–12 theme khi launch (Hàn Quốc, Vintage, Tối giản trắng, Xanh sage, Đêm sao…).

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
### cover — bố cục, ảnh (tỉ lệ, crop), chữ, trang trí
### invitation — vị trí lời mời; với guest: dòng danh xưng hiển thị thế nào
### couple — …
### events — card / timeline; hiển thị âm lịch; nút chỉ đường, thêm lịch
### countdown — …
### album — grid / masonry / carousel; lightbox
### gift — 1 hoặc 2 QR; nhãn nhà trai / nhà gái
### rsvp — form style; trạng thái đã trả lời
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
- [ ] Nhạc không tự phát; phát sau chạm "Mở thiệp"; nút tắt luôn thấy được
- [ ] `prefers-reduced-motion`: không animation lớn
- [ ] Contrast chữ nội dung chính ≥ 4.5 (trên ảnh phải có overlay)
- [ ] RSVP: gửi, sửa, lỗi mạng, vượt số người — đều có phản hồi rõ
- [ ] `mode="preview"` không phát nhạc, không submit

**Pháp lý**
- [ ] Mọi asset có trong `manifest.assets` với nguồn + giấy phép

## 9. Nhạc nền

- Thư viện nhạc trong `src/lib/music.ts` (id, tên, nguồn, giấy phép, URL R2). MVP 6–8 bài không lời (piano, acoustic) từ **Pixabay Music** hoặc nguồn có giấy phép thương mại rõ ràng.
- File MP3 128kbps, ≤ 3MB, host trên R2. `preload="none"`.
- **Không** dùng nhạc trending TikTok/YouTube.

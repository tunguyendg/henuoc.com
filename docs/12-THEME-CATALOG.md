# 12 — Danh mục mẫu thiệp: 10 phong cách × 20 mẫu

> Tài liệu kế hoạch, **chưa có code nào đổi theo**. Phần "Ánh xạ cũ → mới" (§3) và "Từ khoá SEO" (§2) là **đề xuất — chờ Tony duyệt**.
> Liên quan: `07-THEMES.md` (engine, contract, QA) · `08-SEO.md` (index/noindex) · `src/data/themes.ts` (dữ liệu catalog hiện tại).

## 1. Hai lớp: catalog ≠ registry

| Lớp | File | Chứa gì | Ai dùng |
| --- | --- | --- | --- |
| **Catalog** | `src/data/themes.ts` | Tên, mô tả, phong cách, nhãn, `status` (`concept` / `published`) của cả 20 mẫu — kể cả mẫu chưa có code | Gallery, trang phong cách, trang chi tiết, sổ SEO |
| **Registry** | `src/themes/registry.ts` | Theme **có code thật** (manifest + component, dynamic import) | Trang thiệp khách, builder, `createWedding` |

Quy tắc: **slug catalog = slug registry = slug thư mục `src/themes/<slug>/`**. Mẫu chỉ được `status: "published"` khi đã có trong registry và qua QA (`07-THEMES.md §8`). Test sẽ kiểm: mọi mẫu `published` trong catalog đều có trong registry (§9).

## 2. Taxonomy: 10 phong cách, 20 mẫu

Slug phong cách và slug mẫu lấy **đúng theo bảng Tony chốt**. Mỗi mẫu có 1 phong cách chính (đứng đầu `styles[]`); có thể thêm phong cách phụ nếu thật sự hợp (xem §5 về ngưỡng index).

| # | Slug phong cách | Tên hiển thị | Từ khoá SEO chính (đề xuất) | Mẫu 1 | Mẫu 2 |
| --- | --- | --- | --- | --- | --- |
| 01 | `truyen-thong-viet` | Truyền thống Việt | thiệp cưới truyền thống | `song-hy-do-son` Song Hỷ Đỏ Son | `dong-duong` Đông Dương |
| 02 | `toi-gian` | Tối giản & Thanh lịch | thiệp cưới tối giản | `ivory-editorial` Ivory Editorial | `black-white` Black & White |
| 03 | `sang-trong` | Sang trọng & Hoàng gia | thiệp cưới sang trọng | `royal-gold` Royal Gold | `champagne` Champagne Elegance |
| 04 | `lang-man-hoa-la` | Lãng mạn & Hoa lá | thiệp cưới hoa lá | `blush-rose` Blush Rose | `botanical-garden` Botanical Garden |
| 05 | `han-quoc-nhat-ban` | Hàn Quốc & Nhật Bản | thiệp cưới Hàn Quốc | `seoul-romance` Seoul Romance | `sakura-zen` Sakura Zen |
| 06 | `thien-nhien-moc-mac` | Thiên nhiên & Mộc mạc | thiệp cưới mộc mạc | `rustic-garden` Rustic Garden | `bohemian` Bohemian Love |
| 07 | `co-dien-hoai-niem` | Cổ điển & Hoài niệm | thiệp cưới vintage | `sai-gon-xua` Sài Gòn Xưa | `vintage-newspaper` Vintage Newspaper |
| 08 | `bien-du-lich` | Biển & Du lịch | thiệp cưới biển | `ocean-promise` Ocean Promise | `travel-postcard` Travel Postcard |
| 09 | `hien-dai-nghe-thuat` | Hiện đại & Nghệ thuật | thiệp cưới hiện đại | `modern-editorial` Modern Editorial | `colorful-pop` Colorful Pop |
| 10 | `de-thuong` | Dễ thương & Cá nhân hóa | thiệp cưới dễ thương | `chibi-couple` Chibi Couple | `illustrated-love` Illustrated Love |

Ghi chú từ khoá:
- `keyword` dùng thẳng trong `<title>` + H1 (test SEO kiểm), nên phải là cụm người Việt thật sự gõ. Cột trên là **đề xuất chưa kiểm volume** — riêng "mộc mạc", "biển", "dễ thương" nên kiểm Google Suggest / Search Console trước khi chốt (có thể là "thiệp cưới rustic", "thiệp cưới chibi").
- Tên hiển thị dài ("Tối giản & Thanh lịch") chỉ dùng cho chip / H2; **title ≤ 60 ký tự** nên title trang phong cách dựng từ `keyword`, không từ tên dài.
- Không 2 phong cách chung 1 từ khoá chính (chống ăn thịt từ khoá, `08-SEO.md`).

## 3. Ánh xạ catalog cũ → mới (đề xuất, Tony duyệt)

Site chưa launch → đổi slug thoải mái, **không cần redirect**. Sau launch mọi đổi slug phải kèm redirect 308.

### Phong cách (7 cũ → 10 mới)

| Cũ | Mới | Hành động |
| --- | --- | --- |
| `truyen-thong` | `truyen-thong-viet` | Đổi slug + tên |
| `toi-gian` | `toi-gian` | Giữ slug, đổi tên "Tối giản & Thanh lịch" |
| `sang-trong` | `sang-trong` | Giữ slug, đổi tên "Sang trọng & Hoàng gia" |
| `hoa-la` | `lang-man-hoa-la` | Đổi slug + tên |
| `han-quoc` | `han-quoc-nhat-ban` | Đổi slug + tên |
| `vintage` | `co-dien-hoai-niem` | Đổi slug + tên (giữ từ khoá "thiệp cưới vintage") |
| `hien-dai` | `hien-dai-nghe-thuat` | Đổi slug + tên |
| — | `thien-nhien-moc-mac`, `bien-du-lich`, `de-thuong` | Thêm mới, viết `intro` tay |

### Mẫu (6 cũ → 20 mới)

| Cũ | Mới | Hành động | Lý do |
| --- | --- | --- | --- |
| `song-hy` Song Hỷ | `song-hy-do-son` | Đổi slug + tên, giữ mô tả | Cùng ý tưởng đỏ son, viền vàng, chữ Hỷ |
| `hong-pastel` Hồng Pastel | `blush-rose` | Đổi slug + tên, viết lại mô tả | Cùng tông hồng phấn, hoa lá |
| `ban-tin` Bản Tin | `modern-editorial` | Đổi slug + tên | Kiểu tạp chí đen–kem, chữ in đậm → hợp "Modern Editorial" hơn "Ivory Editorial" (ivory = sáng, mềm) |
| `seoul` Seoul | `seoul-romance` | Đổi slug + tên | Trùng ý tưởng |
| `xanh-sage` Xanh Sage | `botanical-garden` | Đổi slug + tên | Xanh lá dịu, tiệc vườn |
| `hoai-niem` Hoài Niệm | `sai-gon-xua` | Đổi slug + tên, viết lại mô tả | Giấy cũ, chữ nghiêng, áo dài/phố cổ |
| — | 14 mẫu còn lại | Thêm mới, `status: "concept"` | |

`preview` (kiểu `MiniStyle` trong `components/home/mini-invitation.tsx`) là khoá nội bộ, giữ nguyên cho 6 mẫu cũ (`songhy`, `pastel`, …). 14 mẫu mới cần thêm preview hoặc dùng 1 preview chung theo phong cách cho tới khi có thumbnail thật.

## 4. Nhãn phụ (facet) — để lọc, không tạo trang riêng

| Nhãn | Trường trong `Theme` | Giá trị | Ghi chú |
| --- | --- | --- | --- |
| **Màu** | `colors: ColorTag[]` (mới) | `do`, `hong`, `vang-gold`, `kem-trang`, `den-trang`, `xanh-la`, `xanh-duong`, `nau-be`, `nhieu-mau` | Gán theo **mọi biến thể màu** của mẫu (§5), không chỉ màu mặc định. Giữ `palette` (mã hex) để vẽ chấm màu |
| **Gói** | `tier` (đã có) | `free`, `premium` | Nhãn hiển thị "Miễn phí" / "Premium" |
| **Tính năng** | `features: FeatureTag[]` (đổi từ `string[]` tự do sang danh sách cố định) | `mo-phong-bi`, `nhac-nen`, `lich-am-duong`, `dem-nguoc`, `ban-do`, `album`, `qr-mung-cuoi`, `rsvp`, `le-vu-quy-thanh-hon`, `ten-bo-me` | Mỗi tag có nhãn tiếng Việt trong 1 map; thẻ mẫu hiện nhãn, bộ lọc dùng slug |

Lý do đổi `features` sang danh sách cố định: lọc được, không lệch chính tả giữa các mẫu, test kiểm được.

## 5. Biến thể màu qua `themeOptions`

- **Một mẫu = một slug**, nhiều bảng màu. Biến thể là `options.palette` trong `optionsSchema` của theme (contract `07-THEMES.md §2`), ví dụ `blush-rose`: `z.enum(["blush", "peach", "lavender"])`, `defaultOptions.palette = "blush"`.
- **Không** tạo slug/URL riêng cho biến thể (`blush-rose-peach`) → tránh 20 mẫu thành 60 trang gần trùng.
- Catalog khai báo biến thể để hiển thị: `variants?: { key: string; name: string; palette: string[]; colors: ColorTag[] }[]`. `key` phải khớp enum trong `optionsSchema` (test §9).
- Trang chi tiết mẫu: chấm màu bấm được → đổi preview **phía client**, không đổi URL index. Bấm "Dùng mẫu này" mang theo biến thể (§7).
- Đổi biến thể trong builder = sửa `Wedding.themeOptions` (JSON), registry tự `safeParse` lại và fallback `defaultOptions` nếu dữ liệu cũ không hợp lệ (đã có trong `defineTheme`).

## 6. URL và quy tắc index / noindex

| URL | Index khi | Sitemap | Ghi chú |
| --- | --- | --- | --- |
| `/mau-thiep-cuoi` | Luôn (sau launch) | Có | Trang gallery chính |
| `/mau-thiep-cuoi/phong-cach/<style>` | Có **≥ `MIN_THEMES_FOR_STYLE_INDEX` (= 3) mẫu `published`** thuộc phong cách đó (tính cả phong cách phụ) | Chỉ khi index | Luật cũ, giữ |
| `/mau-thiep-cuoi/<theme>` | Mẫu `published` | Chỉ khi index | `concept` → noindex |
| `/mau-thiep-cuoi?mau-sac=…&goi=…&tinh-nang=…` | **Không bao giờ** | Không | Bộ lọc = facet (§4) |
| `/mau-thiep-cuoi/phong-cach/<style>?…` | Không bao giờ | Không | Lọc trong 1 phong cách |
| `/tao-thiep?mau=<slug>&bien-the=<key>` | Không (app) | Không | Đã noindex trong sổ SEO |

Quy tắc bộ lọc:
- Tên query tiếng Việt không dấu: `mau-sac`, `goi` (`mien-phi` / `premium`), `tinh-nang` (lặp được: `?tinh-nang=rsvp&tinh-nang=nhac-nen`). **Không dùng `mau`** cho màu — `mau` đã dành cho slug mẫu ở `/tao-thiep`.
- Trang có lọc: canonical về trang **không lọc**, `robots: noindex, follow`.
- **Lọc phía client** để trang gallery / phong cách vẫn ○ Static (bài học header T-032: đọc `searchParams` ở server làm cả trang thành động). Server render đủ 20 thẻ; client đọc query, ẩn thẻ không khớp, cập nhật URL bằng `history.replaceState` (không `router.push` → không tạo request RSC mới). Không JS vẫn thấy đủ mẫu.
- Không tạo trang tĩnh kiểu `/mau-thiep-cuoi/mau-do` cho tới khi có dữ liệu Search Console chứng minh có người tìm "thiệp cưới màu đỏ" — lúc đó mới cân nhắc, đi kèm nội dung viết tay.

⚠️ **Mâu thuẫn cần Tony quyết**: mỗi phong cách chỉ có **2 mẫu chính** nhưng ngưỡng index là **3**. Nếu chỉ tính phong cách chính, **không trang phong cách nào được index**, kể cả khi đủ 20 mẫu. Ba hướng:
1. Gán thêm phong cách phụ có thật (vd. `black-white` cũng là `hien-dai-nghe-thuat`) để phong cách đạt 3 — chỉ khi đúng thẩm mỹ, không gán cho đủ số.
2. Hạ ngưỡng xuống 2 — trang mỏng hơn, bù bằng `intro` dài hơn + FAQ phong cách.
3. Giữ 3, chấp nhận trang phong cách noindex tới khi mỗi phong cách có mẫu thứ 3.

Khuyến nghị: **(1) + (3)**. Gallery `/mau-thiep-cuoi` vẫn index nên không mất từ khoá chính.

## 7. Luồng "Dùng mẫu này"

```
/mau-thiep-cuoi/<slug>  ──[Dùng mẫu này]──►  /tao-thiep?mau=<slug>&bien-the=<key>
                                                 │ builder chọn sẵn mẫu + biến thể (client)
                                                 │ chưa đăng nhập: nháp lưu localStorage
                                                 ▼
                                         [Lưu thiệp] → /dang-nhap (nếu cần) → createWedding
```

1. **Nút trên trang chi tiết** (và thẻ mẫu): link thường tới `/tao-thiep?mau=<slug>` (+ `&bien-the=<key>` nếu khách đã bấm chấm màu). Chỉ hiện với mẫu đã có trong registry; mẫu `concept` hiện "Sắp ra mắt" thay cho nút.
2. **`/tao-thiep`** đọc `mau` phía client. Slug lạ / không có trong registry / chưa `published` → bỏ qua, dùng mẫu mặc định, **không** báo lỗi (link cũ hỏng không làm kẹt người dùng). `bien-the` lạ → `defaultOptions`.
3. **`createWedding`** (Tony viết) — thay đổi cần làm:
   - Schema nhận thêm `themeSlug` (+ `themeOptions` nếu có biến thể). **Validate với registry phía server**: `getThemeEntry(slug)` tồn tại **và** manifest `status === "published"`; options parse bằng `manifest.optionsSchema`. Không hợp lệ → dùng mẫu mặc định (không tin client).
   - Không validate bằng catalog `data/themes.ts`: catalog có mẫu `concept` chưa có code → tạo đám cưới trỏ tới theme không render được.
   - Gói: mẫu `premium` mà user chưa có gói → vẫn cho tạo/xem trước, chặn ở bước **xuất bản** (quyết định gói nằm ở `01-PRD.md`; ghi lại ở đây để không quên).
   - Test hiện có "form gửi lén themeSlug bị bỏ qua (mass-assignment)" sẽ phải viết lại: `themeSlug` hợp lệ được nhận; slug lạ / `concept` / `__proto__` → về mặc định. `userId`, `role` vẫn tuyệt đối không nhận từ form.

## 8. Thứ tự làm 5 mẫu đầu

| Thứ tự | Mẫu | Phong cách chính | Vì sao trước |
| --- | --- | --- | --- |
| 1 | `song-hy-do-son` | truyen-thong-viet | Nhu cầu lớn nhất ở VN (khách lớn tuổi); có sẵn spec cũ `song-hy` (T-015) |
| 2 | `ivory-editorial` | toi-gian | Mẫu trung tính, an toàn cho đa số cặp đôi trẻ |
| 3 | `blush-rose` | lang-man-hoa-la | Kế thừa ý tưởng `hong-pastel` (T-014) |
| 4 | `seoul-romance` | han-quoc-nhat-ban | Từ khoá "thiệp cưới Hàn Quốc" có người tìm |
| 5 | `royal-gold` | sang-trong | Ứng viên Premium đầu tiên |

Sau 5 mẫu: 5 phong cách có 1 mẫu published, 5 phong cách có 0 → **toàn bộ trang phong cách noindex** (§6). Gallery và 5 trang chi tiết index được.

Việc cần đổi trong roadmap: T-014/T-015/T-016 (`hong-pastel`, `song-hy`, `ban-tin`) đổi thành `blush-rose`, `song-hy-do-son`, `ivory-editorial` theo bảng trên; `ban-tin` → `modern-editorial` lùi về sau 5 mẫu đầu. `07-THEMES.md §5` cập nhật theo.

## 9. Test cần có khi làm code

- Mọi `theme.styles[i]` tồn tại trong `themeStyles`; mỗi mẫu có đúng 1 phong cách chính (phần tử đầu).
- Slug phong cách và slug mẫu: kebab-case, không trùng nhau, không trùng nhau giữa 2 danh sách.
- Mẫu `published` ⇒ có trong `themeRegistry` và manifest cũng `published`.
- `variants[].key` khớp enum `palette` trong `optionsSchema` của theme (khi theme đã có code).
- `colors`, `features` chỉ dùng giá trị trong danh sách cố định (§4).
- Sổ SEO: title ≤ 60, description 110–160, keyword có trong title + H1 — test `tests/seo.test.ts` đã kiểm, chỉ cần dữ liệu mới qua.

## 10. Bản quyền hình minh hoạ, font, ảnh demo

Mỗi theme ghi nguồn + giấy phép từng asset vào `manifest.assets[]` (contract `07-THEMES.md §2`) và mục "Reference" trong `docs/themes/<slug>.md`. Không ghi được giấy phép → không dùng.

- **Chỉ dùng**: tự vẽ / tự tạo; CC0 / public domain có nguồn rõ; giấy phép cho phép **thương mại + chỉnh sửa + nhúng trong sản phẩm** (đọc kỹ điều khoản "template/print-on-demand" — nhiều kho cấm dùng trong sản phẩm cho người khác tự tạo nội dung).
- **Không**: chép/đồ lại thiệp của dịch vụ khác (Cinelove, iWedding, Canva, Etsy, Pinterest…); ảnh "free" không rõ chủ.
- Rủi ro riêng theo mẫu:
  - `chibi-couple`, `illustrated-love`: không bắt chước nét của họa sĩ/nhân vật có thật (anime, Disney, LINE Friends…). Nếu dùng AI tạo hình: ghi công cụ + prompt + ngày vào `assets`, tự kiểm không giống nhân vật có bản quyền, và kiểm điều khoản thương mại của công cụ.
  - `vintage-newspaper`: không mô phỏng măng-sét / logo báo có thật (Tuổi Trẻ, Thanh Niên, The New York Times…) — đặt tên báo giả.
  - `travel-postcard`: tem, dấu bưu điện tự vẽ, không dùng hình tem thật hay logo hãng bay / bưu chính.
  - `sai-gon-xua`, `dong-duong`: ảnh tư liệu cũ phải xác minh public domain (năm chụp, tác giả); hoạ tiết gạch bông, chữ thư pháp tự vẽ.
  - `royal-gold`: không dùng huy hiệu hoàng gia / quốc huy thật.
  - `song-hy-do-son`: chữ Hỷ là ký tự truyền thống, dùng được; hoạ tiết rồng phượng tự vẽ hoặc có giấy phép.
  - `colorful-pop`: lấy cảm hứng pop art được, không chép tranh cụ thể (Lichtenstein, Warhol).
- **Font**: chỉ font có giấy phép nhúng web (Google Fonts / OFL, hoặc mua bản webfont). Phải có đủ dấu tiếng Việt — kiểm "Nguyễn Đức Hưởng" trước khi chọn.
- **Ảnh demo**: dùng bộ demo chung `src/themes/_demo/content.ts` (Unsplash, đã có credit). Không dùng ảnh cưới thật của khách làm thumbnail/OG khi chưa có đồng ý bằng văn bản.

## 11. File code sẽ phải đổi (cho task sau)

| File | Đổi gì |
| --- | --- |
| `src/data/themes.ts` | 10 `themeStyles` (slug, name, keyword, intro), 20 `themes` theo §2–3; thêm `colors`, `variants`, đổi `features` sang tag cố định; type `ColorTag`, `FeatureTag` + map nhãn |
| `src/components/home/mini-invitation.tsx` | Thêm `miniStyles` cho mẫu mới hoặc preview chung theo phong cách |
| `src/components/home/featured-themes.tsx` | Chọn lại mẫu nổi bật trang chủ (ưu tiên 5 mẫu đầu) |
| `src/components/themes/style-chips.tsx` | 10 chip → cuộn ngang trên mobile, không xuống 3 dòng |
| `src/components/themes/theme-card.tsx` | Nhãn gói, chấm màu biến thể, "Sắp ra mắt" cho `concept` |
| `src/app/(marketing)/mau-thiep-cuoi/page.tsx` | Bộ lọc client (màu / gói / tính năng), giữ ○ Static |
| `src/app/(marketing)/mau-thiep-cuoi/phong-cach/[style]/page.tsx` | `generateStaticParams` theo 10 phong cách mới; bộ lọc trong phong cách |
| `src/app/(marketing)/mau-thiep-cuoi/[slug]/page.tsx` | Nút "Dùng mẫu này" → `/tao-thiep?mau=`; chấm màu đổi preview |
| `src/lib/seo/pages.ts` | Trang phong cách / mẫu tự sinh từ `themes.ts`; kiểm lại `related`, quyết ngưỡng §6; trang có lọc → canonical + noindex |
| `src/app/(marketing)/tao-thiep/page.tsx` | Đọc `?mau=&bien-the=` phía client, fallback mặc định |
| `src/themes/registry.ts` | Thêm theme thật khi code xong (slug = slug catalog) |
| `src/features/wedding/schema.ts`, `actions.ts`, `actions.test.ts` | **(Tony viết)** nhận + validate `themeSlug`/`themeOptions` với registry (§7) |
| `src/features/wedding/mock-repo.ts`, `src/features/admin/mock-repo.ts` (+ test), `src/components/dashboard/card/*` | Cập nhật slug mẫu trong dữ liệu mock |
| `tests/seo.test.ts` + test mới cho catalog | Theo §9 |
| `docs/07-THEMES.md §5`, `docs/05-ROADMAP.md` (T-014..017), `docs/08-SEO.md §3`, `docs/STATUS.md` | Đổi tên mẫu MVP, thêm luật bộ lọc |

Khối lượng > 10 file + đổi route phong cách → khi làm phải tách task: (a) dữ liệu catalog + SEO, (b) gallery + bộ lọc, (c) luồng "Dùng mẫu này" + `createWedding`.

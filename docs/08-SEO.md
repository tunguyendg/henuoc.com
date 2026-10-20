# 08 — SEO: sổ SEO và cách can thiệp

> Tóm tắt: **mọi thứ SEO của trang công khai nằm ở 1 file** — `src/lib/seo/pages.ts`.
> Sửa ở đó → title, description, canonical, breadcrumb, schema, "Xem thêm", sitemap tự đổi theo.
> `npm test` kiểm tra luật; sai luật thì CI đỏ.

## 1. Bản đồ file

| Việc                       | File                                            | Ghi chú                                                           |
| -------------------------- | ----------------------------------------------- | ----------------------------------------------------------------- |
| Sổ SEO (sửa ở đây)         | `src/lib/seo/pages.ts`                          | Trang tĩnh viết tay + trang phong cách / mẫu sinh từ danh mục     |
| Danh mục mẫu & phong cách  | `src/data/themes.ts`                            | Thêm mẫu = thêm 1 object → có ngay trang `/mau-thiep-cuoi/<slug>` |
| `<title>`, meta, canonical | `src/lib/seo/metadata.ts` → `pageMetadata()`    | Mỗi trang: `export const metadata = pageMetadata("/duong-dan")`   |
| Breadcrumb + JSON-LD       | `src/components/seo/breadcrumb.tsx`             | Dựng từ `parent`                                                  |
| Link nội bộ "Xem thêm"     | `src/components/seo/related-links.tsx`          | Dựng từ `related`                                                 |
| Schema khác                | `src/components/seo/json-ld.tsx`                | WebSite (trang chủ), FAQPage (chỉ `/cau-hoi-thuong-gap`, nguồn `src/data/faq.ts`), CollectionPage, ItemPage, AboutPage |
| sitemap.xml / robots.txt   | `src/app/sitemap.ts`, `src/app/robots.ts`       | Sinh tự động                                                      |
| Cảnh sát SEO               | `tests/seo.test.ts`                             | Chạy trong `npm test` + CI                                        |

## 2. Luật (test kiểm tự động)

- `title` ≤ 60 ký tự, không trùng, **chứa từ khoá chính**.
- `description` 100–160 ký tự, không trùng.
- `h1` chứa từ khoá chính. Mỗi trang **đúng 1 H1** (lấy từ sổ, không gõ tay trong component).
- `parent` và mọi `related` phải là path có trong sổ (không link gãy), không tự link chính mình.
- Trang `index: true` phải có ≥ 1 link "Xem thêm".
- Heading xếp đúng tầng: H1 → H2 (section) → H3 (thẻ trong section).

Trang chủ là ngoại lệ: H1 nằm trong `components/home/hero.tsx` — sửa H1 ở sổ thì sửa luôn ở hero.

## 3. Index / noindex

- **Trước launch**: biến `NEXT_PUBLIC_ALLOW_INDEXING` không đặt → mọi trang `noindex`, robots.txt `Disallow: /`, sitemap rỗng.
- **Ngày launch**: đặt `NEXT_PUBLIC_ALLOW_INDEXING=true` (env lúc build) → trang `index: true` mở cho Google, sitemap có link.
- Mẫu `status: "concept"` → noindex. Chuyển `"published"` khi theme thật qua QA.
- Trang phong cách chỉ index khi có ≥ 3 mẫu đã publish (`MIN_THEMES_FOR_STYLE_INDEX`) — tránh "trang mỏng".
- `/tao-thiep`, `/dang-nhap`, dashboard: luôn noindex (là app, không phải nội dung).
- Thiệp khách `/thiepcuoi/...`: luôn noindex, **không** chặn trong robots.txt (Google phải vào được mới đọc được noindex). Không đưa tên khách vào sitemap/OG.
- Slug mẫu không tồn tại → trang 404 kèm `noindex` (do Cache Components, HTTP status có thể là 200 nhưng Google vẫn bỏ qua nhờ noindex).

## 4. Công việc thường gặp

**Đổi title/description một trang** → sửa object trong `staticPages` (pages.ts) → `npm test`.

**Thêm trang mới** (vd `/tinh-nang`):

1. Thêm object vào `staticPages` (path, title, description, h1, keyword, parent, related, index).
2. Tạo `src/app/(marketing)/tinh-nang/page.tsx`: `export const metadata = pageMetadata("/tinh-nang")`, dùng `getSeoPage(PATH).h1` cho H1, đặt `<Breadcrumb path=... />` và `<RelatedLinks path=... />`.
3. Thêm link tới trang mới từ ≥ 1 trang khác (menu, footer hoặc `related`). Trang không ai link tới = trang mồ côi.

**Thêm mẫu thiệp** → thêm object vào `themes` trong `src/data/themes.ts`. Trang chi tiết, thẻ trên gallery, trang phong cách, sitemap tự cập nhật.

**Đổi từ khoá phong cách** → sửa `keyword` trong `themeStyles` (viết đúng hoa/thường, vd "thiệp cưới Hàn Quốc").

## 5. Kiểm tra nhanh trên local

```bash
npm test                       # luật SEO
npm run build && npm start
curl localhost:3000/robots.txt
curl localhost:3000/sitemap.xml
curl -s localhost:3000/mau-thiep-cuoi/song-hy | grep -E '<title>|canonical|robots'
```

Sau launch: Google Search Console → gửi `https://henuoc.com/sitemap.xml`; dùng Rich Results Test để kiểm schema.

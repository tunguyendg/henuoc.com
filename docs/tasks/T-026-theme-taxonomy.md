# T-026 — Đổi taxonomy mẫu thiệp: 10 phong cách × 20 mẫu

**Milestone:** M2 · **Loại:** 🟢 agent · **Branch:** `main` · **Phụ thuộc:** T-022 · **Doc:** `docs/12-THEME-CATALOG.md` §2, §3, §6

## Mục tiêu
Catalog `src/data/themes.ts` chuyển sang 10 phong cách × 20 mẫu đúng slug đã chốt; trang phong cách và sổ SEO chạy theo dữ liệu mới, luật index phong cách mới (≥ 2 mẫu published + intro + ≥ 3 FAQ). Chưa có bộ lọc, chưa đổi luồng tạo thiệp.

## Phạm vi
**Được sửa / tạo:**
- `src/data/themes.ts` (+ test mới `src/data/themes.test.ts`)
- `src/themes/types.ts` (chỉ type `StyleSlug`), `src/themes/placeholder/manifest.ts` (chỉ `styles`)
- `src/app/(marketing)/mau-thiep-cuoi/phong-cach/[style]/page.tsx` (hiện FAQ)
- `src/lib/seo/pages.ts` (chỉ `stylePage` / `themePage` và import liên quan)
- `src/components/home/mini-invitation.tsx`, `src/components/home/featured-themes.tsx`, `src/components/themes/*` — chỉ khi cần để build qua
- `src/features/admin/mock-repo.ts` (+ test): đổi slug mẫu trong dữ liệu mock

**Không được đụng:** `src/features/wedding/**` (Tony), `src/lib/session.ts`, `src/lib/auth*`, `src/proxy.ts`, `src/content/**`, `src/data/articles.ts`, phần cẩm nang trong `pages.ts`.

## Yêu cầu chi tiết
1. `themeStyles`: 10 phong cách theo bảng §2 (slug, name, keyword tạm theo cột đề xuất, `intro` 2–3 câu viết tay tiếng Việt). Thêm `faq: { q: string; a: string }[]` — để **rỗng** (Tony/Claude viết sau), không bịa.
2. `themes`: 20 mẫu theo §2, ánh xạ 6 mẫu cũ theo §3 (giữ mô tả/feature/palette, đổi slug + tên + `styles`). 14 mẫu mới: `status: "concept"`, `summary` 1 câu, `description` 80–150 chữ viết tay, `features` lấy từ danh sách đang dùng, `palette` 3–4 mã hex hợp tên mẫu, `tier` (Premium: `royal-gold`, `champagne`, `modern-editorial`, `seoul-romance`, `sakura-zen`, `illustrated-love`; còn lại free — đề xuất, ghi chú để Tony đổi). `preview`: dùng `MiniStyle` gần nhất đang có. Phong cách phụ chỉ gán khi thật hợp.
3. `MIN_THEMES_FOR_STYLE_INDEX = 2`; thêm `MIN_STYLE_FAQ = 3` và hàm `isStyleIndexable(style)` = published ≥ 2 **và** `intro` không rỗng **và** `faq.length ≥ 3`. `pages.ts` dùng hàm này.
4. Trang phong cách: nếu `faq.length > 0` thì hiện khối "Câu hỏi thường gặp" (`<details>` hoặc dl), H2 rõ ràng. Không thêm JSON-LD mới.
5. Test `src/data/themes.test.ts`: slug kebab-case, không trùng (trong & giữa 2 danh sách); 10 phong cách, 20 mẫu đúng slug bảng §2; mỗi `styles[0]` khớp phong cách chính theo bảng; mọi style tồn tại; mẫu `published` ⇒ có trong `themeRegistry`; `isStyleIndexable` đúng ở các ca biên (1 mẫu, 2 mẫu thiếu FAQ, 2 mẫu đủ FAQ).

## Acceptance criteria
- [ ] `npm run typecheck && npm run lint && npm run format:check && npm test` pass (kể cả `tests/seo.test.ts` với dữ liệu mới)
- [ ] `npm run build`: các trang `/mau-thiep-cuoi/**` vẫn ○ hoặc ◐ như trước, không thành ƒ
- [ ] Không còn slug cũ (`hong-pastel`, `song-hy"`, `ban-tin`, `xanh-sage`, `"seoul"`, `hoai-niem`, `hoa-la`, `truyen-thong"`, `han-quoc"`, `"vintage"`, `"hien-dai"`) trong `src/`

## Ghi chú
- Site chưa launch → không cần redirect slug cũ.
- Từ khoá §2 có thể đổi sau khi Tony kiểm volume — chỉ sửa trường `keyword`.

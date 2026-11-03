# STATUS — bảng tình hình dự án

> Tổng chỉ huy (Claude Code) cập nhật file này sau mỗi việc. Tony đọc file này hoặc gõ `/bao-cao`.
> Cập nhật lần cuối: 2026-11-03 (rà P0: DONE / NEEDS VERIFICATION / TODO)

## Đang ở đâu

**Hướng hiện tại:** frontend MVP chạy local (blush-rose là mẫu `live` đầu tiên), auth đã có; tiếp theo nối dữ liệu thật + deploy tự động.

> Rà P0 ngày 2026-11-03 (chỉ đọc code + git, không chạy app). Phân loại: **DONE** = có code/commit và đã kiểm · **NEEDS VERIFICATION** = có code nhưng chưa ai kiểm trên môi trường thật · **TODO** = chưa làm.

## ✅ DONE

- T-002 `env.client.ts` / `env.server.ts` + `server-only` (Tony code 🔴) · test `env.client.test.ts` (4) + `env.server.test.ts` (3) · T-003 Prisma 7 + Supabase (Tony code 🔴): `prisma.config.ts`, schema auth + migration `init_auth`, `src/lib/db.ts`, `/api/health`, DATABASE_URL bắt buộc (`startsWith("postgres")`) · T-001 scaffold Next 16 · T-004 design tokens + UI primitives · T-005 CI (push main) · T-007 brand
- Brand v3 "Nhẫn Tim" (ADR-003), favicon / apple-icon
- Trang chủ đủ section + ảnh cưới thật (`public/images/wedding/`, Unsplash License)
- Sổ SEO `src/lib/seo/pages.ts`: metadata, canonical, breadcrumb, related links, sitemap, robots, test (docs/08-SEO.md)
- Trang Mẫu thiệp: `/mau-thiep-cuoi`, `/mau-thiep-cuoi/phong-cach/[style]`, `/mau-thiep-cuoi/[slug]`
- Đội agent Claude Code: `.claude/agents/`, `.claude/skills/` (docs/09-AGENTS.md)
- T-024 (một phần) `/tinh-nang` + 4 trang con (rsvp, quan-ly-khach-moi, loi-moi-rieng, checklist-dam-cuoi), menu trỏ `/tinh-nang`
- T-024 phần 2: `/bang-gia` (Miễn phí / Cao cấp "Sắp công bố"), `/cau-hoi-thuong-gap` (FAQPage, nguồn `src/data/faq.ts`), `/gioi-thieu`, `/chinh-sach-bao-mat` + `/dieu-khoan` (DỰ THẢO, noindex), footer
- T-025 Cẩm nang: `@next/mdx` (Tony duyệt), `/cam-nang` + `/cam-nang/[slug]`, 2 bài (cách ghi thiệp cưới, lời mời đám cưới hay), JSON-LD Article; MDX ở `src/content/cam-nang`, metadata ở `src/data/articles.ts`
- Liên hệ = email `hotro@henuoc.com` (Tony chốt 2026-10-22): `/lien-he` thật, nút Cao cấp → mailto, trang pháp lý/FAQ ghi email. Giá: 2 gói Miễn phí / Cao cấp (docs D8, GROWTH, PRD, DESIGN_SYSTEM, enum `Plan` FREE/PREMIUM)
- T-012 VietQR: `src/lib/vietqr.ts` (payload EMVCo + CRC16) + `src/data/banks.{json,ts}` (23 ngân hàng NAPAS, freeze), 26 test
- T-006 **xong phần deploy tay ngày 23/10/2026**: release.yml → artifact zip `henuoc-release`, wrapper Passenger trên AZDIGI hoạt động. Build dùng chung đã tách vào `_build.yml`; release tay giữ hành vi cũ.
- T-050 (phần data + tool public): `src/data/checklist.ts` 42 việc theo 10 mốc (id khoá bằng snapshot test) + `src/lib/checklist-schedule.ts` (tính hạn theo ngày, giờ VN). Công cụ miễn phí: `/cong-cu` (hub), `/cong-cu/checklist-dam-cuoi` (chọn ngày → tự xếp lịch, tick lưu localStorage `henuoc:checklist:v1`, in được), `/cong-cu/mau-loi-moi-dam-cuoi` (5 kiểu · 13 mẫu, sao chép). Có trong sổ SEO, footer "Cẩm nang & công cụ", link từ 2 bài cẩm nang, CTA `/tao-thiep`
- Admin mock `/admin` (Tổng quan · Người dùng · Đám cưới · Mẫu thiệp): `src/features/admin/*` qua `repos.admin`, email luôn che (`mask.ts`), nút nâng gói / công tắc mẫu là nút giả phía client, noindex + robots disallow, **`notFound()` ở production** (`features/admin/guard.ts`)
- T-010 khung theme engine: `src/themes/types.ts` (contract), `registry.ts` (dynamic import, memo, safeParse options), `_demo/content.ts`, theme `placeholder` (draft), route `/demo/[slug]` noindex — draft chỉ xem ở dev, production 404
- Cẩm nang phân trang + chủ đề (2026-10-26): `/cam-nang` = trang 1, `/cam-nang/trang/[page]` (6 bài/trang, `/trang/1` 308 → `/cam-nang`), 4 chủ đề `/cam-nang/chu-de/{phong-tuc,thiep-loi-moi,khach-moi,chi-phi}` (intro + list + link chủ đề khác). Dữ liệu `src/data/article-topics.ts`, mỗi bài có `category`; sổ SEO tự sinh trang/sitemap; bài tự link lên chủ đề của nó
- T-013 primitives `src/themes/_shared/` (Envelope, MusicToggle, useCountdown, AddToCalendar, MapButton, Gift + GiftSheet, Reveal, Watermark, RsvpForm submit giả) + `src/lib/url-allowlist.ts` + `src/lib/qr.ts` (dep `qrcode` 1.5.4) + nhạc demo CC0 `public/audio/` — ghép đủ vào `/demo/placeholder`, 412 test
- T-032 đăng nhập: lõi Tony code (`src/lib/auth.ts`, `auth-client.ts`, `components/auth/login-form.tsx`, `api/auth/[...all]`). **OTP email + domain Resend Verified: DONE (Tony xác nhận 2026-11-03).** Phần phụ: env bắt buộc 5 biến auth + test, `/dang-ky` 308 → `/dang-nhap`, nút Đăng xuất, `/dang-nhap` có phiên → `/dashboard`, header marketing biết đăng nhập ở client (trang vẫn ○ Static), test `proxy.ts`.
- `useMusic` (Tony code, `b2e018e`): phát nhạc sau cú chạm, nhớ trạng thái tắt.
- Dashboard dữ liệu mẫu (mock): ✅ data layer `src/features/*` (repo + mock) · ✅ layout `/dashboard` · ✅ 6 trang Tổng quan / Thiệp / Khách mời / RSVP / Mua sắm / Checklist (tick lưu localStorage). Production: `assertDashboardPreview()` ở MỌI page + component đọc repos (layout guard KHÔNG đủ: layout/page render song song, payload vẫn rò) — gỡ khi có proxy.ts + session/ownership
- T-026 taxonomy 10 phong cách × 20 mẫu + FAQ 10 phong cách; `status` live / preview / planned (planned ẩn khỏi trang công khai, 404 thật qua `proxy.ts`). Hiện: 1 live (blush-rose) · 5 preview · 14 planned.
- ✅ blush-rose (2026-10-27): `src/themes/blush-rose/` (phong bì tự vẽ + dấu sáp, tên Great Vibes, thẻ lễ âm lịch, coverflow, lịch trái tim `month-grid.ts` + 19 test, dress code, bao lì xì → GiftSheet, credit Redouté CC0). Option `palette`: `do-do` (mặc định) / `hong-nhat`. Manifest `published`, catalog `live`. Còn: Tony test iPhone + Zalo, `thumb.webp`/`og.webp`, commit ảnh `public/images/ornaments/redoute/rosa-carolina-corymbosa.webp` (Tony quyết), CSS module bị rule `*.css` trong next.config biến thành global (theme dùng `theme.css` tiền tố `br-`).
- ✅ blush-rose đợt sửa 1 (2026-10-28): thẻ "Thông tin lễ cưới" (cha mẹ 2 cột, Trưởng nam/Út nữ, khối ngày lớn, âm lịch từ `lunar.ts`), thẻ "Thông tin tiệc cưới" (đón khách/khai tiệc, lịch tim, thêm lịch, nút → `#xac-nhan`), lịch trình đỏ đô 5 mốc icon tự vẽ, Địa điểm nhúng Google Maps Embed (`src/lib/maps-embed.ts`, env `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY` optional, GitHub Variables), dress code chỉ chấm màu + aria tên màu. Contract: `birthOrder`, `arrivalTimeLabel`/`banquetTimeLabel`, `timeline?`, SectionKey `timeline`/`dressCode`. Demo: 3 sự kiện TP.HCM (địa chỉ mới sau bỏ quận), album 3 ảnh Bin Thieu cùng cặp đôi + `npm run demo-album:fetch` (Tony thêm ID vào `src/content/demo-album/images.json`). Rủi ro: khi thêm CSP cần `frame-src https://www.google.com`.
- ✅ Thiệp theo BÊN (2026-10-28): `ThemeProps.side` ("nha-trai"/"nha-gai"), `EventView.side` thêm "chung" (khớp enum DB `Side`), bỏ `couple.brideFirst` khỏi contract theme (dashboard/DB vẫn giữ: khi nối DB cần map `Wedding.brideFirst` → không dùng nữa hoặc bỏ cột, Tony quyết). Helper `src/themes/_shared/side.ts` (+19 test): thứ tự tên/ông bà, "Lễ Vu Quy"/"Lễ Tân Hôn", câu báo tin, lọc sự kiện + timeline theo bên. Áp cho blush-rose + placeholder. Demo tĩnh: `/demo/[slug]` = nhà gái, `/demo/[slug]/nha-trai` (render chung `src/components/themes/demo-render.tsx`, pill chuyển bản). Quy tắc bắt buộc mọi theme: docs/07 §2.1.
- ✅ blush-rose đợt sửa 2 (2026-10-29): thẻ lễ/tiệc/lịch trình nền đặc `.br-card` (do-do #4A161A/#F3EDE3/#C4A257, hong-nhat #8C4A5A/#F8EEF0/#E8B9C3; chữ nhấn hồng dùng #F3D0D7 vì #E8B9C3 chỉ 3.75:1), bo 16px, bóng mềm; hoa Redouté nằm SAU thẻ, ló ra trên nền giấy. Thẻ tiệc: ô lịch sáng + tim đặc, nút pill kem, "Google Calendar · Tải .ics" (AddToCalendar thêm prop `labels`/`separator`). Album coverflow tự chạy 3.5s (`coverflow.ts` + test), dừng khi chạm (chạy lại sau 6s), ra khỏi màn hình, tab ẩn, focus bàn phím; reduced-motion không tự chạy. JS route /demo/blush-rose: 235.2 KB gzip (trước 234.6, gồm framework). Tony đã bỏ khối lời mời + cặp đôi lặp (875df23). Chốt 2026-10-31: bìa có guest + `sections.invitation` mới hiện danh xưng (`inviteLine`, `_shared/salutation.ts`, không lặp "kính mời") + `inviteMessage`; không guest thì ẩn hẳn. Demo `/demo/[slug]/khach-moi` có khách giả (mode demo, không ghi DB).
- ✅ Lời mời theo loại thiệp + tên khách có cấu trúc (2026-10-31): `ThemeProps.side: InvitationKind` thêm `bao-hy` (chỉ sự kiện `chung`, không cột ông bà, chú rể trước). `_shared/invitation-wording.ts` (`announceLine`, `inviteLine`, `thanksLine`, `envelopeLine`; xưng "chúng tôi"; `inviteMessage` tuỳ chọn: demo nhà gái, nhà trai để trống, báo hỷ có), `_shared/guest-line.ts` (`parseGuestLine`, `HONORIFICS`). `GuestContext` đổi `salutation` → `honorific`/`name`/`companion`. Bỏ `_shared/salutation.ts`. Demo tĩnh: `/demo/[slug]`, `/nha-trai`, `/bao-hy` và mỗi bản có `/khach-moi`. Chưa nối: `Invitation` trong DB/`features/guest` vẫn `salutationPrefix`/`displayName`/`salutationSuffix` (mock có "& Bạn đời", "& Các cháu" ngoài 2 giá trị companion); khi làm builder/DB phải chốt mapping, và chưa có chỗ chọn loại thiệp `bao-hy` trong dữ liệu đám cưới. Khi nối `parseGuestLine` vào form: thêm Zod `.max()` ở đầu vào vì hàm normalize toàn chuỗi trước khi cắt.
- Kho mẫu dùng ảnh thật + CTA trung thực (`2306917`): production "Sắp mở tạo thiệp" disabled, nút chính "Xem thiệp thực tế" → `/demo/<slug>`.
- Cẩm nang: 18 bài (đạt PRD ≥ 5), có bài "lễ vu quy, thành hôn, tân hôn".

## 🔍 NEEDS VERIFICATION

- T-006 deploy tự động: `deploy.yml` (bật bằng `DEPLOY_ENABLED`), SSH 2210 + host key ghim, rsync → activate → smoke test → rollback qua PREVIOUS. Chưa thử end-to-end: chép `activate.sh` + `rollback.sh` lên host, chuẩn bị CURRENT từ bản deploy tay.
- Panel AZDIGI có đủ biến auth (`BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`=https://henuoc.com, `GOOGLE_CLIENT_ID/SECRET`, `RESEND_API_KEY`) trước khi deploy bản có auth — thiếu là app throw lúc khởi động.
- `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY`: repo Variable (Tony chuyển từ Secret, 2026-11-03), `_build.yml` đọc `vars.`. Kiểm: key giới hạn HTTP referrer `henuoc.com/*` + chỉ Maps Embed API; bản build release có nhúng bản đồ.
- blush-rose trên iPhone + mở trong Zalo (Tony test); ảnh `public/images/ornaments/redoute/rosa-carolina-corymbosa.webp` đã commit chưa.
- Máy dev: đã gỡ `NODE_TLS_REJECT_UNAUTHORIZED=0` khỏi shell profile chưa.

## 📋 TODO

- **Kiểm SSL 25/12/2026**: chứng chỉ Let's Encrypt henuoc.com hết hạn 2027-01-20 → kiểm auto-renew trên AZDIGI trước ngày đó (`curl -vI https://henuoc.com 2>&1 | grep expire`).
- **P5 — đổi tên biến R2** (CHƯA đổi bây giờ): `R2_BUCKET` → `R2_PRIVATE_BUCKET` + `R2_PUBLIC_BUCKET`, `NEXT_PUBLIC_MEDIA_URL` giữ tên; cập nhật `.env.example`, `env.server.ts`, `MEDIA_HOSTS` trong `url-allowlist.ts` (đang giả định `media.henuoc.com`).
- Gỡ `notFound()` production ở `dashboard/layout.tsx` + `assertDashboardPreview()`: cần ownership (`requireWeddingAccess`) + dữ liệu thật thay mock. `getInviteLinkAction` vẫn chỉ chặn bằng NODE_ENV (TODO(auth) trong file).
- `/api/rsvp` (chưa có route; `use-rsvp-form.ts` submit giả).
- Builder `/tao-thiep` + T-028 "Dùng mẫu này" → `createWedding` (validate slug với registry phía server).
- `createWedding` hardening: race 2 request (partial unique index, cần migration), rate limit, `.normalize("NFC")` + chặn `\p{C}`.
- T-006: `prisma migrate deploy` trong deploy (chưa có).
- T-027 gallery + bộ lọc · mẫu tiếp theo (song-hy-do-son, ivory-editorial, seoul-romance, royal-gold).
- Blush Rose V1.1 (danh sách cuối file).
- `NEXT_PUBLIC_ALLOW_INDEXING` chưa có trong `_build.yml` (thêm ngày launch).

## ⚠️ Rủi ro / bảo mật đang theo dõi

- M3 onboarding `/dashboard/bat-dau` (form + test slug/schema/createWedding đã có). Còn mở:
  - Trang nằm trong layout dashboard → người chưa có đám cưới vẫn thấy WeddingHeading/nav/banner (dữ liệu mock). Tony quyết: tách route group `(onboarding)` hay ẩn theo path. Chưa có link/redirect nào dẫn tới trang (dashboard chưa chuyển khi `getMyWedding()` null).
  - `createWedding` (file Tony): race 2 request song song → 2 đám cưới (chặn bằng partial unique index OWNER/userId — cần migration, hỏi trước); chưa rate limit; tên nhận ký tự điều khiển/zero-width → thêm `.normalize("NFC")` + chặn `\p{C}`.
  - Slug ghép từ tên = đoán được → route thiệp công khai `/thiep/[slug]` sau này BẮT BUỘC chỉ hiện `PUBLISHED`, DRAFT trả 404, noindex.

- `wedding-access.ts` (có test IDOR `wedding-access.test.ts`): `getMyWedding` đang `select: { wedding: true }` = mọi cột → đừng truyền nguyên object xuống Client Component, nên select đúng cột. Server Action gọi `requireWeddingAccess` phải parse `weddingId` bằng Zod trước (rỗng/undefined → Prisma lỗi 500 thay vì 404).

- `dashboard/layout.tsx` vẫn `notFound()` ở production → đăng nhập xong bị đẩy sang `/dashboard` là 404, nút Đăng xuất không hiện. Tony quyết gỡ trước khi deploy auth (proxy + requireUser đã có, còn thiếu ownership + dữ liệu thật thay mock).

- Deploy sau T-032: panel AZDIGI phải có đủ `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (https://henuoc.com), `GOOGLE_CLIENT_ID/SECRET`, `RESEND_API_KEY` — thiếu là app throw lúc khởi động. `BETTER_AUTH_URL` hiện nhận cả http/localhost (CI dùng giá trị giả) → cân nhắc chặn lúc runtime production.

- `getInviteLinkAction` (Server Action = endpoint công khai) đang chỉ chặn bằng NODE_ENV. Trước khi mở production: session + ownership, nếu không đoán guestId là lấy được link (có token) của nhà khác.

- DATABASE_URL đã bắt buộc: secret chỉ nằm trong `env.server.ts` (server-only). Tuyệt đối không đặt tên `NEXT_PUBLIC_DATABASE_URL`. Client Component chỉ được import `env.client.ts`. Build/CI phải có DATABASE_URL.

- `NEXT_PUBLIC_ALLOW_INDEXING` để trống (noindex toàn site). Chỉ bật ngày launch. Nhớ thêm vào bước Build của `_build.yml` (đang gán cứng env).
- Zip release phải build bằng workflow, KHÔNG build trên Mac (standalone có thể copy `.env.local` vào bản build).
- Contract theme (`src/themes/types.ts`): `qrSvg` chỉ sinh ở server, không lưu DB, render bằng `<img data:…>`; URL (map/ảnh/nhạc) zod ép https + allowlist; không truyền cả object `guest` (có token) xuống Client Component; cấm `dangerouslySetInnerHTML` trong `src/themes/**`.
- `MEDIA_HOSTS = ["media.henuoc.com"]` trong `url-allowlist.ts` là giả định — sửa khi chốt domain R2, KHÔNG nới thành so hậu tố. `maps.app.goo.gl` cho mọi path (link rút gọn Google).
- STK nằm trong RSC payload trang thiệp (sheet chỉ ẩn giao diện, §10) — chấp nhận; muốn chống cào → tải gifts khi bấm + rate limit.
- `/api/rsvp` chưa có: `use-rsvp-form.ts` submit giả mọi mode. Khi làm: token không qua props client, rate limit, server dựng ctx từ DB.
- Máy dev đặt `NODE_TLS_REJECT_UNAUTHORIZED=0` (tắt kiểm chứng chỉ cho mọi lệnh Node/npm) → Tony gỡ khỏi shell profile.
- Ảnh demo là JPG 1600px (~100–500KB) → theme thật cần bản WebP tối ưu để đạt ngân sách 600KB trang đầu (07-THEMES §8).
- Slug mẫu sai trả 200 + noindex (giới hạn Cache Components) — chấp nhận. Riêng `/cam-nang/trang/*` và `/cam-nang/chu-de/*`: `proxy.ts` rewrite path lạ sang `/_khong-ton-tai` → 404 thật (có test). Nâng Next thì `curl -I` lại `/cam-nang/trang/99`. Thêm path danh sách mới → cập nhật `articleListPaths()`.
- Keyword hub chủ đề ("chi phí đám cưới", "khách mời đám cưới") gần với bài đuôi dài → theo dõi Search Console sau launch, tranh thứ hạng thì đổi title chủ đề.
- VietQR chứa STK dạng rõ: không đưa payload/STK vào URL, title, OG, log, analytics; chỉ render ở `/thiepcuoi/*` noindex. Server Action nhận `bankBin` phải check `findBankByBin` (đừng tin dropdown).
- `/tinh-nang/checklist-dam-cuoi` dùng keyword "lên kế hoạch đám cưới"; "checklist đám cưới" thuộc `/cong-cu/checklist-dam-cuoi`, "mẫu lời mời đám cưới" thuộc tool lời mời (bài cẩm nang giữ "lời mời đám cưới hay").
- Admin thật: thay guard production bằng `requireAdmin()` kiểm `session.user.role === "ADMIN"` ở server, đặt trong mọi page (layout chỉ là lớp thêm); mọi Server Action ghi (đổi gói, bật/tắt mẫu) tự kiểm role lại + Zod. Không tin role từ cookie/JWT phía client.
- Description `/cong-cu/checklist-dam-cuoi` ghi "hơn 40 việc": bớt việc xuống dưới 40 thì sửa câu này.
- Editor `/dashboard` (mock) cho chọn cả mẫu `preview` vì chưa có mẫu `live`. Khi gỡ mock: chỉ cho chọn `live` (+ validate với registry phía server, docs/12 §7).
- Trang pháp lý là dự thảo, `index: false` — Tony duyệt nội dung trước launch; khi đổi kiến trúc dữ liệu phải sửa chính sách cho khớp.
- Nâng cấp Cao cấp qua email + chuyển khoản tay: PHẢI công bố điều khoản chính thức + chính sách hoàn tiền trước khi nhận tiền.
- Xoá dữ liệu qua email: chỉ xoá sau khi chủ tài khoản bấm xác nhận qua email đăng nhập (header From giả được).
- `hotro@henuoc.com` công khai → bật lọc spam, không dùng làm email admin/đăng nhập dịch vụ nào.
- Chưa có backend → chưa có bề mặt tấn công dữ liệu. Khi làm M3/M4: IDOR, token khách, rate limit RSVP là ưu tiên.

## 🚀 Checklist launch

- [ ] Gallery `/mau-thiep-cuoi` chỉ còn mẫu `live` (mẫu `preview` chưa dùng được → chuyển `planned` hoặc làm xong code trước ngày launch)
- [ ] Bật `NEXT_PUBLIC_ALLOW_INDEXING` (cả bước Build trong `_build.yml`)
- [ ] Trang pháp lý Tony duyệt, bỏ `index: false`
- [x] Cẩm nang ≥ 5 bài (PRD) — 18 bài
- [ ] Chốt gói Supabase production (ADR-004)
- [ ] SSL henuoc.com còn hạn (kiểm 25/12/2026, hết hạn 2027-01-20)
- [ ] Mọi CTA `/tao-thiep` phải dẫn tới luồng tạo thiệp chạy được hoặc trạng thái 'Sắp mở' trung thực

## 🧭 Quyết định chờ Tony

- Chống IDOR khi thay mock bằng Prisma: (A) `service.ts` có `requireWeddingAccess(session, weddingId)` trả kiểu branded `AuthorizedWeddingId`, repo chỉ lọc weddingId (khuyên dùng) hay (B) mọi method repo nhận `ctx: { userId }` và tự lọc `members.some.userId`? Phải chốt trước khi viết `prisma-repo.ts`.

- Gói Supabase cho production: Free (auto-pause 7 ngày, không backup) hay Pro? Quyết trước launch (ADR-004).
- Thêm mục "Công cụ" (`/cong-cu`) vào menu chính? Đã có trang; hiện mới link từ footer + bài cẩm nang. (mặc định: có)

## Blush Rose V1.1 (chưa làm — V1 đã chốt 2026-11-01)

- Pill demo dính cố định đè nội dung → chỉ hiện đầu trang
- Nút nhạc đè chữ khi cuộn (timeline, nút Chỉ đường)
- Hoa thẻ tiệc bị thẻ che gần hết; con dấu thẻ lễ chìm nền (palette hồng)
- Quà mừng: chỉ hiện tài khoản bên đứng tên thiệp; gift sheet nhận màu theme
- og.webp cho trang mẫu (thumb.webp đã có, 2026-11-01)
- `manifest.thumbnail` trỏ `/themes/blush-rose/thumb.webp`, file không tồn tại; hiện không ai đọc field này (ảnh thật: `src/themes/blush-rose/thumb.webp`). Sửa khi có nơi đọc
- JS trang demo 235 KB gzip (ngân sách 80 KB) → phân tích bundle trước launch
- Reviewer chưa soát: lọc ký tự vô hình trong guest-line parser, vị trí hoa Venue
- Lời mời: tách xưng hô / tên / kèm theo khi làm bảng khách mời (M4)
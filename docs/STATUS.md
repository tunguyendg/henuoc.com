# STATUS — bảng tình hình dự án

> Tổng chỉ huy (Claude Code) cập nhật file này sau mỗi việc. Tony đọc file này hoặc gõ `/bao-cao`.
> Cập nhật lần cuối: 2026-10-23 (T-006 deploy tay chạy được; chặng deploy tự động đang thử)

## Đang ở đâu

**Hướng hiện tại:** dựng frontend MVP trên local trước (chưa backend), rồi mới M0 backend + deploy.

## ✅ Đã xong

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
- T-013 primitives `src/themes/_shared/` (Envelope, MusicToggle, useCountdown, AddToCalendar, MapButton, Gift + GiftSheet, Reveal, Watermark, RsvpForm submit giả) + `src/lib/url-allowlist.ts` + `src/lib/qr.ts` (dep `qrcode` 1.5.4) + nhạc demo CC0 `public/audio/` — ghép đủ vào `/demo/placeholder`, 412 test

## 🔨 Đang làm

- T-006 chặng tự động **đang thử**: deploy.yml (push main / chạy tay, bật bằng DEPLOY_ENABLED), SSH 2210 + host key đã ghim, rsync → activate → smoke test đúng revision → rollback qua PREVIOUS nếu không đạt. Cần chép lại cả activate.sh và rollback.sh lên host, chuẩn bị CURRENT từ bản deploy tay và thử end-to-end trước khi coi là xong.

- Dashboard dữ liệu mẫu: ✅ data layer `src/features/*` (repo + mock) · ✅ layout `/dashboard` · ✅ 6 trang Tổng quan / Thiệp / Khách mời / RSVP / Mua sắm / Checklist (tick lưu localStorage). Production: `assertDashboardPreview()` ở MỌI page + component đọc repos (layout guard KHÔNG đủ: layout/page render song song, payload vẫn rò) — gỡ khi có proxy.ts + session/ownership

- T-032 đăng nhập (🔴 Tony code lõi `auth.ts` / `auth-client.ts` / `login-form.tsx` / `api/auth`). Phần phụ đã xong: env bắt buộc 5 biến auth + test, biến giả trong CI build, `.env.example` có hướng dẫn, H1 "Đăng nhập hoặc tạo tài khoản", `/dang-ky` 308 → `/dang-nhap`. Đã thêm: nút Đăng xuất (sidebar + header mobile, tải lại trang về `/`), `/dang-nhap` có phiên → `/dashboard`, test `proxy.ts`. Header marketing biết đăng nhập ở CLIENT (`site/header-actions.tsx`, `useSession`) → trang marketing vẫn ○ Static; đã đăng nhập hiện "Vào bảng điều khiển" + chữ cái đầu.

## ⏭️ Tiếp theo (frontend)

1. 🔴 Tony code `useMusic` (`src/themes/_shared/use-music.ts`, TODO trong file + bài học M1-themes Phần 2)
2. T-014/T-015/T-016 theme thật (hong-pastel, song-hy, ban-tin) — chờ spec trải nghiệm Tony chốt
3. Cẩm nang thêm bài (PRD: ≥ 5 bài khi launch) — bài 3 "lễ vu quy, thành hôn, tân hôn" link từ bài ghi thiệp
4. Mock builder `/tao-thiep` + dashboard (dữ liệu localStorage)

## ⏭️ Sau đó (backend — phần lớn 🔴 Tony tự code)

- T-006 việc sau: bổ sung `prisma migrate deploy` sau khi chốt quyền DB, thứ tự migration và chiến lược expand/contract. **Chưa có migrate trong deploy hiện tại.**

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
- Slug mẫu sai trả 200 + noindex (giới hạn Cache Components) — chấp nhận.
- VietQR chứa STK dạng rõ: không đưa payload/STK vào URL, title, OG, log, analytics; chỉ render ở `/thiepcuoi/*` noindex. Server Action nhận `bankBin` phải check `findBankByBin` (đừng tin dropdown).
- `/tinh-nang/checklist-dam-cuoi` dùng keyword "lên kế hoạch đám cưới"; "checklist đám cưới" thuộc `/cong-cu/checklist-dam-cuoi`, "mẫu lời mời đám cưới" thuộc tool lời mời (bài cẩm nang giữ "lời mời đám cưới hay").
- Admin thật: thay guard production bằng `requireAdmin()` kiểm `session.user.role === "ADMIN"` ở server, đặt trong mọi page (layout chỉ là lớp thêm); mọi Server Action ghi (đổi gói, bật/tắt mẫu) tự kiểm role lại + Zod. Không tin role từ cookie/JWT phía client.
- Description `/cong-cu/checklist-dam-cuoi` ghi "hơn 40 việc": bớt việc xuống dưới 40 thì sửa câu này.
- Trang pháp lý là dự thảo, `index: false` — Tony duyệt nội dung trước launch; khi đổi kiến trúc dữ liệu phải sửa chính sách cho khớp.
- Nâng cấp Cao cấp qua email + chuyển khoản tay: PHẢI công bố điều khoản chính thức + chính sách hoàn tiền trước khi nhận tiền.
- Xoá dữ liệu qua email: chỉ xoá sau khi chủ tài khoản bấm xác nhận qua email đăng nhập (header From giả được).
- `hotro@henuoc.com` công khai → bật lọc spam, không dùng làm email admin/đăng nhập dịch vụ nào.
- Chưa có backend → chưa có bề mặt tấn công dữ liệu. Khi làm M3/M4: IDOR, token khách, rate limit RSVP là ưu tiên.

## 🧭 Quyết định chờ Tony

- Chống IDOR khi thay mock bằng Prisma: (A) `service.ts` có `requireWeddingAccess(session, weddingId)` trả kiểu branded `AuthorizedWeddingId`, repo chỉ lọc weddingId (khuyên dùng) hay (B) mọi method repo nhận `ctx: { userId }` và tự lọc `members.some.userId`? Phải chốt trước khi viết `prisma-repo.ts`.

- Gói Supabase cho production: Free (auto-pause 7 ngày, không backup) hay Pro? Quyết trước launch (ADR-004).
- Thêm mục "Công cụ" (`/cong-cu`) vào menu chính? Đã có trang; hiện mới link từ footer + bài cẩm nang. (mặc định: có)

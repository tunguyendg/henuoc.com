# 03 — Architecture

**Version:** 2.0 · 2026-10-19

## 1. Bức tranh tổng thể

```
                    ┌──────────────────────── AZDIGI (Passenger, Node 22) ────────────────────────┐
 Browser / Zalo ───▶│  Next.js 16 standalone server.js                                            │
                    │   ├─ (marketing)  SSG/ISR ── "use cache"                                    │
                    │   ├─ (public) /thiepcuoi/[slug], /thiepcuoi/[slug]/[token]  ── cached wedding + dynamic guest      │
                    │   ├─ (app) /dashboard ── dynamic, auth                                      │
                    │   ├─ Server Actions (mutations)                                             │
                    │   └─ Route Handlers: /api/auth/*, /api/rsvp, /go/[id], /api/cron/*          │
                    └────────┬───────────────┬───────────────┬──────────────┬─────────────────────┘
                             │               │               │              │
                       Neon Postgres    Cloudflare R2     Resend      ACCESSTRADE API
                       (Singapore)      media.henuoc.com  (email)     (tạo link, đơn hàng)
```

**Vì sao như vậy (để học):**
- Một Next app duy nhất, không tách backend riêng như giavang.today. Server Components + Server Actions **chính là backend** — chạy trên server, gọi DB trực tiếp, không lộ ra browser.
- Route Handler (`app/api/*`) chỉ dùng khi **bên ngoài** gọi vào (form RSVP của khách, OAuth callback, cron, redirect affiliate). Mọi thứ người dùng đăng nhập thao tác → Server Action.
- Shared hosting không có Redis / queue → rate limit và job dùng **Postgres** + cron của DirectAdmin.

## 2. Route map

```
src/app/
├─ (marketing)/                         # layout: Header + Footer marketing
│  ├─ page.tsx                          # /
│  ├─ mau-thiep-cuoi/page.tsx           # gallery
│  ├─ mau-thiep-cuoi/[slug]/page.tsx    # chi tiết theme
│  ├─ mau-thiep-cuoi/phong-cach/[style]/page.tsx
│  ├─ thiep-cuoi-online/page.tsx        # landing SEO (+ gui-zalo, co-ten-khach)
│  ├─ checklist-dam-cuoi/page.tsx       # tool public
│  ├─ bang-gia/page.tsx
│  ├─ cau-hoi-thuong-gap/page.tsx
│  ├─ tinh-nang/page.tsx + tinh-nang/<tinh-nang>/page.tsx
│  ├─ gioi-thieu/ · chinh-sach-bao-mat/ · dieu-khoan/
│  └─ cam-nang/page.tsx + cam-nang/[slug]/page.tsx  # MDX ở src/content/cam-nang, metadata ở src/data/articles.ts
├─ (builder)/tao-thiep/page.tsx         # builder, không cần login
├─ (auth)/dang-nhap/page.tsx
├─ (app)/dashboard/                     # layout: sidebar, yêu cầu session
│  ├─ page.tsx                          # tổng quan
│  ├─ thiep/page.tsx                    # mở builder ở chế độ đã lưu
│  ├─ khach-moi/page.tsx
│  ├─ rsvp/page.tsx
│  ├─ checklist/page.tsx
│  ├─ mua-sam/page.tsx
│  └─ cai-dat/page.tsx
├─ (admin)/admin/…                      # role ADMIN
├─ (public)/thiepcuoi/[slug]/page.tsx           # trang cưới chung
├─ (public)/thiepcuoi/[slug]/[token]/page.tsx          # thiệp riêng
├─ (thiep)/demo/[slug]/page.tsx         # demo theme với dữ liệu mẫu (noindex, dùng cho iframe)
├─ go/[productId]/route.ts              # redirect affiliate + log click
├─ api/auth/[...all]/route.ts           # Better Auth
├─ api/rsvp/route.ts                    # POST RSVP từ khách
├─ api/cron/[job]/route.ts              # gọi bởi DirectAdmin cron, bảo vệ bằng CRON_SECRET
├─ sitemap.ts · robots.ts · opengraph-image.tsx
└─ proxy.ts                             # (Next 16: thay middleware.ts) — chặn /dashboard, /admin nếu chưa có session cookie
```

URL tiếng Việt không dấu cho SEO. Route nội bộ dashboard cũng tiếng Việt cho nhất quán.

## 3. Rendering & caching (Next 16 Cache Components)

Bật trong `next.config.ts`: `cacheComponents: true`, `output: "standalone"`.

| Trang | Chiến lược |
|---|---|
| Marketing, gallery, cẩm nang | Static. `"use cache"` + `cacheLife("days")` |
| `/mau-thiep-cuoi/[slug]` | `generateStaticParams` từ theme registry |
| `/thiepcuoi/[slug]` | Hàm `getPublishedWedding(slug)` có `"use cache"` + `cacheTag("wedding:" + id)`. Publish/sửa → `revalidateTag` |
| `/thiepcuoi/[slug]/[token]` | Phần wedding dùng **cùng** cache trên; phần danh xưng + RSVP là dynamic (đọc token) bọc trong `<Suspense>` |
| Dashboard | Dynamic hoàn toàn (đọc session) |

**Next 16.4 (đã kiểm tra trong `node_modules/next/dist/docs`):**
- Trong **Server Action**: dùng `updateTag("wedding:" + id)` (đọc-ngay-sau-khi-ghi). `updateTag` chỉ gọi được trong Server Action.
- Trong **Route Handler / cron / webhook**: `revalidateTag(tag, "max")` — tham số thứ 2 (cache profile) là **bắt buộc**.
- `GET` Route Handler mặc định được **prerender lúc build** như page. Cần chạy mỗi request → `await connection()` (vd `/api/health`).
- `partialPrefetching: true` đi kèm `cacheComponents`.

> **Học:** "Partial Prerendering" = vỏ trang render sẵn, chỗ nào phụ thuộc request (cookie, token) thì stream vào sau. Thiệp 1.000 khách chỉ tốn 1 lần query wedding.

## 4. Module & lớp code

```
features/<name>/
  schema.ts     # Zod: input form + action (dùng chung client & server)
  queries.ts    # đọc DB — luôn nhận ctx { userId } và lọc ownership
  actions.ts    # "use server" — parse → auth → ownership → service → revalidate
  service.ts    # business logic thuần, test được bằng Vitest
lib/
  db.ts         # PrismaClient singleton (adapter-pg)
  auth.ts       # Better Auth instance + getSession()
  crypto.ts     # token tạo/hash/encrypt
  r2.ts         # presigned upload
  accesstrade.ts
  lunar.ts      # dương → âm lịch (thuật toán Hồ Ngọc Đức, UTC+7)
  vietqr.ts     # tạo payload EMVCo + CRC16 → QR
  rate-limit.ts # Postgres-based
```

Feature list: `wedding`, `builder`, `event`, `media`, `invitation`, `rsvp`, `checklist`, `affiliate`, `account`, `admin`.

## 5. Prisma schema (MVP)

Bản file đầy đủ: `docs/reference/schema.prisma` (đã validate). Prisma 7: generator `prisma-client`, URL đặt trong `prisma.config.ts` (không trong schema). **Agent phải đối chiếu docs Prisma hiện hành khi setup** (T-003).

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

// ───────── Auth (Better Auth — sinh bằng `npx @better-auth/cli generate`, giữ đúng tên field) ─────────
model User {
  id            String    @id
  name          String
  email         String    @unique
  emailVerified Boolean   @default(false)
  image         String?
  role          UserRole  @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sessions      Session[]
  accounts      Account[]
  memberships   WeddingMember[]
  @@map("user")
}

model Session {
  id        String   @id
  userId    String
  token     String   @unique
  expiresAt DateTime
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@map("session")
}

model Account {
  id                    String    @id
  userId                String
  accountId             String
  providerId            String
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@map("account")
}

model Verification {
  id         String   @id
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  @@map("verification")
}

enum UserRole {
  USER
  ADMIN
}

// ───────── Wedding ─────────
model Wedding {
  id              String        @id @default(cuid())
  slug            String        @unique              // /thiepcuoi/[slug], vd "minhanh-hoangnam" — tên cặp đôi viết liền, không dấu
  status          WeddingStatus @default(DRAFT)
  plan            Plan          @default(FREE)        // MVP: admin set tay
  themeSlug       String
  themeVersion    Int           @default(1)           // pin version, theme breaking change không làm vỡ thiệp cũ
  themeOptions    Json          @default("{}")        // palette variant, font variant… (validate bằng zod schema của theme)
  brideName       String
  groomName       String
  brideShortName  String?
  groomShortName  String?
  brideFirst      Boolean       @default(true)        // thứ tự hiển thị
  brideParents    String?                              // "Ông Nguyễn Văn A & Bà Trần Thị B"
  groomParents    String?
  brideFamilyAddr String?
  groomFamilyAddr String?
  inviteMessage   String?
  sections        Json          @default("{}")        // { countdown: true, album: true, gift: true, rsvp: true, music: true }
  musicTrackId    String?
  coverMediaId    String?       @unique
  rsvpDeadline    DateTime?
  allowWalkInRsvp Boolean       @default(false)
  tableSize       Int           @default(10)
  weddingDate     DateTime?                             // ngày chính — tính countdown & hạn checklist
  publishedAt     DateTime?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  members      WeddingMember[]
  events       WeddingEvent[]
  media        Media[]         @relation("WeddingMedia")
  cover        Media?          @relation("WeddingCover", fields: [coverMediaId], references: [id])
  giftAccounts GiftAccount[]
  groups       GuestGroup[]
  invitations  Invitation[]
  rsvps        Rsvp[]
  checklist    ChecklistItem[]
  clicks       AffiliateClick[]
}

enum WeddingStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}
enum Plan {
  FREE
  PREMIUM // gói Cao cấp (2026-10-22: gộp WEDDING/SIGNATURE)
}

model WeddingMember {
  weddingId String
  userId    String
  role      MemberRole @default(OWNER)
  createdAt DateTime   @default(now())
  wedding   Wedding    @relation(fields: [weddingId], references: [id], onDelete: Cascade)
  user      User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@id([weddingId, userId])
  @@index([userId])
}

enum MemberRole {
  OWNER
  EDITOR
}

model WeddingEvent {
  id        String    @id @default(cuid())
  weddingId String
  type      EventType
  side      Side      @default(CHUNG)
  title     String?                       // override tên hiển thị
  startsAt  DateTime                      // UTC
  venueName String
  address   String
  mapUrl    String?
  sortOrder Int       @default(0)
  wedding   Wedding   @relation(fields: [weddingId], references: [id], onDelete: Cascade)
  invitations InvitationEvent[]
  rsvps       RsvpEvent[]
  @@index([weddingId])
}

enum EventType {
  AN_HOI
  VU_QUY
  THANH_HON
  TAN_HON
  TIEC
}
enum Side {
  NHA_TRAI
  NHA_GAI
  CHUNG
}

model Media {
  id        String    @id @default(cuid())
  weddingId String
  kind      MediaKind
  key       String    @unique             // R2 object key
  url       String                        // https://media.henuoc.com/<key>
  width     Int
  height    Int
  bytes     Int
  sortOrder Int       @default(0)
  createdAt DateTime  @default(now())
  wedding   Wedding   @relation("WeddingMedia", fields: [weddingId], references: [id], onDelete: Cascade)
  coverOf   Wedding?  @relation("WeddingCover")
  @@index([weddingId, kind])
}

enum MediaKind {
  COVER
  GALLERY
}

model GiftAccount {
  id          String  @id @default(cuid())
  weddingId   String
  side        Side
  bankBin     String                     // mã BIN ngân hàng (Napas)
  accountNo   String
  accountName String
  wedding     Wedding @relation(fields: [weddingId], references: [id], onDelete: Cascade)
  @@unique([weddingId, side])
}

// ───────── Khách mời ─────────
model GuestGroup {
  id        String  @id @default(cuid())
  weddingId String
  side      Side
  name      String                       // "Họ hàng", "Bạn đại học"…
  sortOrder Int     @default(0)
  wedding   Wedding @relation(fields: [weddingId], references: [id], onDelete: Cascade)
  invitations Invitation[]
  @@unique([weddingId, side, name])
}

model Invitation {
  id               String         @id @default(cuid())
  weddingId        String
  groupId          String?
  side             Side
  salutationPrefix String         @default("Trân trọng kính mời")
  displayName      String                     // "Anh Minh", "Cô Chú Tư"
  salutationSuffix String?                    // "& Gia đình"
  maxAttendees     Int            @default(1)
  phone            String?                    // tuỳ chọn, chỉ để mở Zalo
  note             String?                    // ghi chú riêng của chủ tiệc
  tokenHash        String         @unique     // sha256(token) — dùng để tra cứu
  tokenCipher      String                     // AES-256-GCM(token) — để hiện lại link trong dashboard
  deliveryStatus   DeliveryStatus @default(NOT_SENT)
  markedSentAt     DateTime?
  firstOpenedAt    DateTime?
  lastOpenedAt     DateTime?
  openCount        Int            @default(0)
  revokedAt        DateTime?
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt
  wedding          Wedding        @relation(fields: [weddingId], references: [id], onDelete: Cascade)
  group            GuestGroup?    @relation(fields: [groupId], references: [id], onDelete: SetNull)
  events           InvitationEvent[]
  rsvp             Rsvp?
  @@index([weddingId, side])
}

enum DeliveryStatus {
  NOT_SENT
  MARKED_SENT
}

model InvitationEvent {
  invitationId String
  eventId      String
  invitation   Invitation   @relation(fields: [invitationId], references: [id], onDelete: Cascade)
  event        WeddingEvent @relation(fields: [eventId], references: [id], onDelete: Cascade)
  @@id([invitationId, eventId])
}

// ───────── RSVP ─────────
model Rsvp {
  id            String     @id @default(cuid())
  weddingId     String
  invitationId  String?    @unique              // null = khách vãng lai từ /thiepcuoi/[slug]
  source        RsvpSource
  status        RsvpStatus
  attendeeCount Int        @default(0)
  message       String?
  walkInName    String?
  walkInPhone   String?
  respondedAt   DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
  wedding       Wedding    @relation(fields: [weddingId], references: [id], onDelete: Cascade)
  invitation    Invitation? @relation(fields: [invitationId], references: [id], onDelete: Cascade)
  events        RsvpEvent[]
  history       RsvpHistory[]
  @@index([weddingId, status])
}

enum RsvpSource {
  INVITATION
  WALK_IN
}
enum RsvpStatus {
  ATTENDING
  DECLINED
}

model RsvpEvent {
  rsvpId  String
  eventId String
  rsvp    Rsvp         @relation(fields: [rsvpId], references: [id], onDelete: Cascade)
  event   WeddingEvent @relation(fields: [eventId], references: [id], onDelete: Cascade)
  @@id([rsvpId, eventId])
}

model RsvpHistory {
  id        String   @id @default(cuid())
  rsvpId    String
  snapshot  Json                          // { status, attendeeCount, eventIds, message }
  createdAt DateTime @default(now())
  rsvp      Rsvp     @relation(fields: [rsvpId], references: [id], onDelete: Cascade)
  @@index([rsvpId])
}

// ───────── Checklist ─────────
model ChecklistItem {
  id              String    @id @default(cuid())
  weddingId       String
  templateKey     String?                     // null = user tự thêm
  title           String
  dueOffsetDays   Int                         // âm = trước ngày cưới
  productCategory String?                     // gắn danh mục affiliate
  doneAt          DateTime?
  hidden          Boolean   @default(false)
  spentAmount     Int?                        // VND, user tự nhập
  sortOrder       Int       @default(0)
  wedding         Wedding   @relation(fields: [weddingId], references: [id], onDelete: Cascade)
  @@index([weddingId])
}

// ───────── Affiliate ─────────
model AffiliateProduct {
  id            String   @id @default(cuid())
  category      String                      // gia-tien | an-hoi | co-dau | qua-cam-on | trang-tri | chup-anh
  title         String
  imageUrl      String
  originUrl     String                      // link Shopee gốc
  affLink       String                      // từ ACCESSTRADE product_link/create
  shortLink     String?
  priceRef      Int?                        // giá tham khảo lúc thêm — hiển thị "khoảng", không phải giá checkout
  shopName      String?
  note          String?                     // lý do chọn (Tony viết)
  active        Boolean  @default(true)
  sortOrder     Int      @default(0)
  lastCheckedAt DateTime?
  createdAt     DateTime @default(now())
  clicks        AffiliateClick[]
  @@index([category, active])
}

model AffiliateClick {
  id        String           @id @default(cuid())
  productId String
  weddingId String?
  placement String                          // checklist | shop | dashboard-tip
  createdAt DateTime         @default(now())
  product   AffiliateProduct @relation(fields: [productId], references: [id], onDelete: Cascade)
  wedding   Wedding?         @relation(fields: [weddingId], references: [id], onDelete: SetNull)
  @@index([productId, createdAt])
}

model AffiliateConversion {
  id              String   @id @default(cuid())
  transactionId   String   @unique
  merchant        String
  productName     String?
  transactionValue Int
  commission      Int
  status          Int                       // 0 hold · 1 approved · 2 rejected (theo ACCESSTRADE)
  utmContent      String?                   // = AffiliateProduct.id
  transactionTime DateTime
  syncedAt        DateTime @default(now())
}

// ───────── Hạ tầng ─────────
model RateLimit {
  key         String   @id                  // "rsvp:ip:<hash>" | "rsvp:token:<hash>"
  windowStart DateTime
  count       Int
}
```

## 6. Luồng quan trọng

### 6.1 Tạo lời mời & token
```
token = randomBytes(24).base64url          // 32 ký tự, 192 bit
tokenHash   = sha256(token)                // tra cứu khi khách mở /thiepcuoi/[slug]/[token]
tokenCipher = aes256gcm(token, TOKEN_ENC_KEY)  // dashboard giải mã để copy link
```
DB lộ ra ngoài → kẻ tấn công không dựng được link (cần thêm `TOKEN_ENC_KEY` ở env). Revoke = set `revokedAt` + tạo token mới.

### 6.2 Khách mở `/thiepcuoi/[slug]/[token]`
1. `sha256(token)` → tìm Invitation, `revokedAt IS NULL`, wedding `PUBLISHED`. Không thấy → `notFound()`.
   `slug` trong URL chỉ để **dễ đọc** (bạn bè nhìn link là biết thiệp cưới của ai), không dùng để xác thực. Slug sai/cũ mà token đúng → `redirect` 308 sang slug hiện tại.
2. Cập nhật `firstOpenedAt / lastOpenedAt / openCount` (fire-and-forget, `after()` của Next).
3. Render theme với `WeddingContent` (cached) + `GuestContext` (danh xưng, sự kiện được mời, RSVP hiện tại).
4. `metadata`: `robots: noindex`, `title` = "Thiệp cưới Minh Anh & Hoàng Nam" (không tên khách).

### 6.3 RSVP
`POST /api/rsvp` body `{ token, status, attendeeCount, eventIds, message, website /*honeypot*/ }`
1. Zod validate · honeypot rỗng · rate limit (10/phút/IP, 20/ngày/token).
2. Tìm invitation từ token; `attendeeCount <= maxAttendees`; `eventIds ⊆ invitation.events`; trước `rsvpDeadline`.
3. Transaction: upsert `Rsvp` (unique `invitationId` → **không đếm trùng**), thay `RsvpEvent`, thêm `RsvpHistory`.
4. `revalidateTag("rsvp:" + weddingId, "max")`.

> **Học:** vì sao RSVP là Route Handler chứ không phải Server Action? Server Action cũng gọi được từ trang public. Chọn Route Handler để có **endpoint rõ ràng** cho rate limit, CORS, test bằng curl/Playwright và tách biệt với code owner-side. Cả hai đều đúng — đây là lựa chọn thiết kế.

### 6.4 Upload ảnh
1. Client resize bằng canvas → WebP 2 kích thước (1600px, 640px), chất lượng 0.82.
2. Server Action `createUploadUrl({ weddingId, kind, bytes, contentType })` → kiểm tra owner, quota (Free 12 ảnh), type `image/webp|jpeg`, ≤ 2MB → trả presigned PUT URL R2 (hết hạn 5 phút).
3. Browser PUT thẳng lên R2. Gọi `confirmUpload` → tạo record `Media`.
4. Hiển thị qua `media.henuoc.com` (R2 public bucket + Cloudflare CDN). `next/image` với `unoptimized` cho ảnh R2 → **không dùng sharp trên shared hosting** (tốn CPU, dễ bị kill).

### 6.5 Draft chưa đăng nhập → DB
`localStorage["henuoc:draft:v1"]` lưu `BuilderDraft` (cùng Zod schema với server). Sau khi đăng nhập, trang `/tao-thiep?claim=1` gọi `claimDraft(draft)` → tạo Wedding + events → xoá localStorage. Ảnh chưa upload khi chưa login (chỉ preview `URL.createObjectURL`), upload sau khi claim.

### 6.6 Affiliate
- Admin dán URL Shopee → server gọi `POST https://api.accesstrade.vn/v1/product_link/create` (`Authorization: token <ACCESSTRADE_TOKEN>`, body `{ campaign_id, urls: [url], utm_source: "henuoc", utm_campaign: "planner", utm_content: <productId> }`) → lưu `aff_link`, `short_link`.
- User click → `/go/[productId]?p=checklist` → ghi `AffiliateClick` → `302` tới `affLink`. Có `rel="sponsored noopener"`.
- Cron hằng ngày `/api/cron/sync-conversions` → `GET /v1/transactions?since=…&until=…&utm_source=henuoc` (rate limit 10 req/phút) → upsert `AffiliateConversion`.
- `GET /v1/datafeeds?domain=shopee.vn&…` dùng trong admin để **tìm ý tưởng** sản phẩm; không dùng giá datafeed làm giá hiển thị chính thức.

### 6.7 VietQR mừng cưới
Tự sinh payload EMVCo (Napas 247) trong `lib/vietqr.ts`: TLV tag `00, 01, 38 (A000000727 + BIN + STK + QRIBFTTA), 53=704, 58=VN, 62 (nội dung "Mung cuoi …"), 63=CRC16-CCITT`. Render bằng package `qrcode` (SVG). Danh sách ngân hàng (BIN, tên, logo) commit dạng JSON tĩnh. **Không gọi API bên thứ ba** → không rò STK, không phụ thuộc uptime.

## 7. Bảo mật — checklist

| Mối đe doạ | Biện pháp |
|---|---|
| IDOR (đoán `weddingId`) | Mọi query owner-side: `where: { id, members: { some: { userId } } }`. Test AT-10 |
| Đoán token khách | 192-bit random, tra bằng hash, rate limit 404 theo IP |
| Lộ PII | noindex + không sitemap + OG không tên khách + analytics không PII + log không token |
| Spam RSVP | Rate limit Postgres, honeypot, giới hạn độ dài |
| CSRF | Server Action có kiểm tra Origin sẵn; Route Handler RSVP kiểm tra `Origin` = `henuoc.com` |
| Upload độc hại | Presigned PUT giới hạn content-type + size, key do server sinh, chỉ ảnh |
| XSS từ lời mời tự viết | Render text thuần (React escape), không `dangerouslySetInnerHTML`; xuống dòng bằng CSS `white-space: pre-line` |
| Secret | Chỉ trong env panel AZDIGI + GitHub Secrets, `.env*` gitignore |
| Dữ liệu tài khoản ngân hàng | Chỉ hiển thị trên thiệp đã publish; chủ tiệc chủ động bật |

## 8. Env vars (`.env.example`)

```bash
# App
NEXT_PUBLIC_SITE_URL=https://henuoc.com
NEXT_PUBLIC_MEDIA_URL=https://media.henuoc.com

# Database (Neon — dùng pooled URL cho app, direct URL cho migrate)
DATABASE_URL=postgresql://...-pooler.ap-southeast-1.aws.neon.tech/henuoc?sslmode=require
DIRECT_URL=postgresql://....ap-southeast-1.aws.neon.tech/henuoc?sslmode=require

# Auth
BETTER_AUTH_SECRET=        # openssl rand -base64 32
BETTER_AUTH_URL=https://henuoc.com
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Crypto
TOKEN_ENC_KEY=             # openssl rand -base64 32 (32 bytes)

# R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=henuoc-media

# Email
RESEND_API_KEY=
EMAIL_FROM="Hẹn Ước <xinchao@henuoc.com>"

# ACCESSTRADE
ACCESSTRADE_TOKEN=
ACCESSTRADE_SHOPEE_CAMPAIGN_ID=

# Cron
CRON_SECRET=               # openssl rand -hex 24
```

Validate env lúc khởi động bằng Zod trong `src/lib/env.ts` — thiếu biến là crash ngay, không chạy "nửa vời".

## 9. Testing

| Lớp | Công cụ | Phạm vi |
|---|---|---|
| Unit | Vitest | `service.ts`, `lunar.ts`, `vietqr.ts` (CRC), `crypto.ts`, zod schema, tính số bàn/quà |
| Integration | Vitest + Neon branch test | actions/queries với DB thật (ownership!) |
| E2E | Playwright (mobile viewport 390×844) | AT-01 → AT-13 trong PRD |
| Visual | Playwright screenshot | 3 theme × 2 viewport |

CI chạy unit + e2e trên Neon branch tạm (tạo/xoá qua Neon API) hoặc Postgres service container của GitHub Actions.

## 10. Analytics

Umami tự host (v2) hoặc Plausible. MVP: bảng event đơn giản không cần — dùng log server + Search Console. Event funnel định nghĩa ở `04-GROWTH.md`; **không** gửi tên khách, token, SĐT.

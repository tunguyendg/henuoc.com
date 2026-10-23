# 06 — Deployment: Local → AZDIGI → CI/CD

**Version:** 2.2 · 2026-10-23 · Hosting: **AZDIGI DirectAdmin + CloudLinux "Setup Node.js App" (Passenger), Node 22**

## 1. Bức tranh

```
 Mac (dev)                      GitHub                                   AZDIGI (user yvltjpca)
 ─────────                      ──────                                   ─────────────────────
 npm run dev ── git push main ─▶ Deploy (khi DEPLOY_ENABLED=true):
                                 1. _build.yml: npm ci · kiểm tra · next build
                                 2. đóng gói zip → artifact henuoc-release
                                 3. tải artifact · giải nén release/
                                 4. rsync SSH cổng 2210 ──────────▶ ~/deploy/henuoc/<sha>/
                                 5. activate.sh ─────────────────▶ ~/henuoc-app/app/ + restart Passenger
                                 6. curl /api/health ◀───────────── https://henuoc.com
                                 7. sai ok/revision sau 10 lần → rollback.sh → job fail

 GitHub → Run Release (build tay) → cùng _build.yml → tải zip để deploy tay
 Chưa có prisma migrate trong deploy; bổ sung sau khi chốt quy trình migration.
```

**Vì sao build trên GitHub, không build trên host hay trên Mac (để học):**
- Host shared bị giới hạn RAM/CPU (CloudLinux LVE) → `next build` dễ bị kill giữa chừng.
- Mac là ARM (Apple Silicon); host là Linux x64. Package có binary native (sharp, esbuild…) build trên Mac sẽ **không chạy** trên host.
- GitHub Actions `ubuntu-latest` = Linux x64 giống host → build xong là chạy được. Lại tự động, lặp lại được, có log.

## 2. Next.js config

```ts
// next.config.ts
import type { NextConfig } from "next";

const config: NextConfig = {
  output: "standalone",        // build ra .next/standalone/server.js + node_modules tối thiểu
  cacheComponents: true,
  images: { unoptimized: true }, // không chạy sharp trên shared host — ảnh tối ưu sẵn (WebP) + R2/Cloudflare CDN
  poweredByHeader: false,
};
export default config;
```

`output: "standalone"` tạo `.next/standalone/` gồm `server.js` + đúng những file trong `node_modules` mà app cần. **Không** chứa `public/` và `.next/static/` → phải copy vào (bước đóng gói).

## 3. Cấu trúc trên host

```
/home/yvltjpca/
├─ henuoc-app/                 ← "Application root" trong Setup Node.js App
│  ├─ server.js                ← "Application startup file" (wrapper 2 dòng)
│  ├─ package.json             ← để Node selector nhận diện app
│  ├─ tmp/restart.txt          ← touch để Passenger restart
│  └─ app/                     ← bản standalone (server.js thật, node_modules, .next, public)
├─ deploy/henuoc/
│  ├─ <sha1>/  <sha2>/  <sha3>/   ← giữ 3 release gần nhất để rollback
│  ├─ CURRENT                     ← sha đang chạy
│  └─ PREVIOUS                    ← sha dùng khi rollback
└─ nodevenv/henuoc-app/22/     ← do CloudLinux tạo, không đụng
```

**Vì sao có thư mục con `app/`:** CloudLinux Node selector quản lý `node_modules` ở app root (symlink sang `nodevenv`). Bản standalone có `node_modules` riêng → đặt trong `app/` để không đụng nhau. File wrapper:

```js
// henuoc-app/server.js — Passenger entry
process.env.NODE_ENV = "production";
import("./app/server.js"); // import() thay require để qua lint, vẫn nạp được file CJS
```

```json
// henuoc-app/package.json
{ "name": "henuoc-app", "private": true, "main": "server.js" }
```

Hai file này có sẵn trong repo: `scripts/deploy/host/server.js` + `scripts/deploy/host/package.json` → upload thẳng vào `henuoc-app/`.

> Passenger tự gán cổng cho app (nó chặn lệnh `listen()`), nên **không** cần set `PORT`. Không bấm "Run NPM Install" trong panel.

## 4. Setup một lần trên AZDIGI (T-006, Tony làm cùng Claude)

1. **DNS** — đề xuất chuyển nameserver `henuoc.com` sang **Cloudflare** (free), vì R2 custom domain `media.henuoc.com` yêu cầu domain nằm trên Cloudflare.
   - `A  henuoc.com  → <IP hosting AZDIGI>` (proxy bật / tắt đều được; nếu bật: SSL mode **Full (strict)**)
   - `CNAME www → henuoc.com`
   - `media` → kết nối trong R2 → Custom Domains
2. **DirectAdmin → Domains**: thêm `henuoc.com` (nếu chưa). **SSL/TLS Certificates** → Let's Encrypt cho `henuoc.com` + `www`.
3. **Setup Node.js App → Create**:
   - Node.js version: **22.x** · Mode: **Production**
   - Application root: `henuoc-app` · URL: `henuoc.com` · Startup file: `server.js`
   - **Environment variables**: thêm toàn bộ biến trong `03-ARCHITECTURE §8` (giá trị production). Đổi env → phải Restart.
   - **Database ở runtime chỉ cần `DATABASE_URL`** = Supabase **pooler cổng 6543** (transaction mode, ADR-004). `DIRECT_URL` (5432) chỉ dùng cho `prisma migrate deploy` → để ở GitHub Secrets, **không** đặt trên host.
4. **SSH Keys**: tạo cặp key riêng cho deploy trên Mac:
   ```bash
   ssh-keygen -t ed25519 -C "github-deploy-henuoc" -f ~/.ssh/henuoc_deploy -N ""
   cat ~/.ssh/henuoc_deploy.pub   # dán vào DirectAdmin → SSH Keys → Authorize
   ssh -i ~/.ssh/henuoc_deploy -p 2210 -o StrictHostKeyChecking=yes yvltjpca@<HOST> 'node -v; echo ok'
   ```
   Cổng SSH: **2210**. Xác nhận fingerprint host key với AZDIGI trước khi tin cậy. Lưu dòng known_hosts tương ứng `[<HOST>]:2210` vào secret `SSH_KNOWN_HOSTS`; workflow không tự lấy host key từ mạng.
   Có thể lấy ứng viên bằng `ssh-keyscan -p 2210 <HOST> > azdigi-known-hosts`, xem fingerprint bằng `ssh-keygen -lf azdigi-known-hosts`, rồi đối chiếu qua kênh AZDIGI đã tin cậy trước khi lưu secret.
5. Tạo thư mục: `mkdir -p ~/henuoc-app/tmp ~/deploy/henuoc` + upload `scripts/deploy/activate.sh`, `rollback.sh` vào `~/deploy/`.
6. **GitHub → repo → Settings → Environments → `production`** → secrets:

| Secret | Giá trị |
|---|---|
| `SSH_HOST` | hostname / IP SSH của AZDIGI |
| `SSH_PORT` | `2210` |
| `SSH_USER` | `yvltjpca` |
| `SSH_KEY` | toàn bộ private key deploy, gồm header/footer và xuống dòng |
| `SSH_KNOWN_HOSTS` | dòng host key đã xác minh cho `[SSH_HOST]:2210` |

GitHub → Settings → Secrets and variables → Actions → **Variables**: đặt repository variable `DEPLOY_ENABLED=true` để bật cả job build và deploy. Để trống hoặc `false` sẽ bỏ qua deploy tự động, kể cả khi bấm workflow_dispatch. Không đặt biến này chỉ trong environment `production`, vì job gọi reusable build chưa vào environment đó.

Giữ `DEPLOY_ENABLED=false` trong lúc cấu hình SSH, chép script host và chuẩn bị bản rollback. Build dùng URL công khai `https://henuoc.com` trong `_build.yml`; không cần SSH secret cho job build. Biến bí mật runtime (DB, auth, R2…) giữ ở panel AZDIGI. Chưa dùng `DATABASE_URL` / `DIRECT_URL` production trong deploy; migration là chặng sau.

## 4b. Deploy tay lần đầu (chưa có rsync SSH)

Dùng workflow `.github/workflows/release.yml` (chạy tay): build trên Ubuntu x64 → zip `release/` → artifact `henuoc-release` (giữ 7 ngày).

1. **Build**: GitHub → Actions → *Release (build tay)* → Run workflow (nhánh `main`). Hoặc: `gh workflow run release.yml`.
2. **Tải về Mac**:
   ```bash
   gh run list --workflow release.yml --status success -L 1   # lấy <run-id> của bản build THÀNH CÔNG
   gh run download <run-id> -n henuoc-release -D ~/Downloads/henuoc-release
   # → ~/Downloads/henuoc-release/henuoc-release.zip (trong zip có REVISION = git sha)
   ```
3. **Lần đầu**: DirectAdmin → File Manager → tạo `henuoc-app/app/` và `henuoc-app/tmp/`; upload `scripts/deploy/host/server.js` + `package.json` vào `henuoc-app/`.
4. **Xoá bản cũ** (từ lần 2): bật hiện file ẩn trong File Manager, xoá sạch nội dung `henuoc-app/app/` (kể cả `.next/`). **Không** đụng `henuoc-app/server.js`, `package.json`, `tmp/`.
5. **Upload + giải nén**: upload `henuoc-release.zip` vào `henuoc-app/app/` → Extract ngay tại đó → xoá file zip. Kiểm tra có `app/server.js`, `app/.next/static/`, `app/public/`, `app/REVISION`.
6. **Restart**: nút Restart trong Setup Node.js App (hoặc tạo/sửa `henuoc-app/tmp/restart.txt`).
7. **Kiểm tra**: mở `https://henuoc.com/api/health` → `"ok":true` và `revision` đúng sha.

> `NEXT_PUBLIC_*` được gán cứng trong `_build.yml` (không lấy từ Secrets) và chưa có `NEXT_PUBLIC_ALLOW_INDEXING` → bản build luôn noindex. **Ngày launch**: thêm `NEXT_PUBLIC_ALLOW_INDEXING: "true"` vào bước Build rồi build lại.

> Không chạy `prisma migrate deploy` trong luồng này. Có migration mới → chạy tay từ Mac với `DIRECT_URL` production trước khi upload (§6), hoặc đợi bổ sung quy trình migrate sau. Cả release tay và deploy tự động hiện đều không chạy migrate.

## 5. Workflow

### 5.1 Build dùng chung — `_build.yml`

Reusable workflow `on: workflow_call`, được gọi ở cấp job ([tài liệu GitHub](https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows)). Checkout → Node 22 theo `.nvmrc` → `npm ci` → typecheck/lint/format/test → build standalone. Giữ nguyên env build của release tay: URL công khai và DATABASE_URL giả để validate, không dùng DB production.

Đóng gói standalone + `.next/static` + `public`, bỏ các gói sharp không dùng, ghi `REVISION=$GITHUB_SHA`, zip thành `henuoc-release.zip`. Upload artifact `henuoc-release`, giữ 7 ngày; reusable workflow xuất output `artifact-name`. `release.yml` vẫn chỉ chạy tay, giữ concurrency `release` và tải zip như §4b. CI riêng không đổi.

### 5.2 Deploy — `deploy.yml`

1. Push `main` hoặc chạy tay, chỉ khi repository variable `DEPLOY_ENABLED == 'true'`. Quyền `contents: read`; concurrency `deploy-production`, không huỷ job đang deploy.
2. Job `build` gọi `_build.yml`. Job `deploy` chờ build, dùng environment `production` để nhận SSH secrets.
3. Tải artifact của cùng workflow run, giải zip vào `release/`, kiểm tra `server.js` và `REVISION` khớp SHA.
4. Ghi private key vào `~/.ssh/deploy_key` với quyền `600`, ghi host key đã xác minh vào `~/.ssh/known_hosts`. Secret đi qua env, không được in ra log. Mọi SSH/rsync dùng key này, port secret (`2210`) và `StrictHostKeyChecking=yes`.
5. `rsync -az --delete release/` tới `~/deploy/henuoc/<sha>/`, rồi SSH chạy `bash ~/deploy/activate.sh <sha>`.
6. Smoke test `https://henuoc.com/api/health`: tối đa 10 lần, cách nhau 6 giây. Chỉ pass khi JSON có `ok: true` **và** `revision` đúng SHA của lần chạy. HTTP lỗi, JSON sai hoặc revision cũ đều phải thử lại.
7. Hết 10 lần: SSH chạy `bash ~/deploy/rollback.sh`, job vẫn fail để báo bản mới không đạt. Nếu rollback cũng lỗi, kiểm tra host ngay; không coi đó là rollback thành công.
8. Bước cuối `if: always()` xoá private key trên runner, kể cả khi upload, activate hoặc smoke test lỗi.

Chặng tự động đang thử, chưa xác nhận production end-to-end. **Không có bước prisma migrate.**

### 5.3 Script host và chuẩn bị rollback lần đầu

**Chép lại cả `scripts/deploy/activate.sh` và `scripts/deploy/rollback.sh` lên `~/deploy/` trước khi bật deploy tự động.** Có thể upload bằng File Manager. Khi gọi qua SSH, workflow dùng `bash`, không phụ thuộc executable bit.

`activate.sh` kiểm tra SHA và REVISION, rsync vào `~/henuoc-app/app/`, giữ wrapper/package.json/tmp ngoài app, cập nhật CURRENT/PREVIOUS và restart bằng `touch ~/henuoc-app/tmp/restart.txt`. Kích hoạt lại cùng SHA giữ nguyên PREVIOUS. Chỉ giữ 3 release; CURRENT và PREVIOUS luôn được bảo vệ khi dọn.

Nếu bản đang chạy được upload tay thẳng vào `henuoc-app/app/`, nó chưa có CURRENT/release để rollback. Trước lần deploy tự động đầu tiên, SSH vào host và lưu bản đang chạy:

```bash
release_sha="$(cat ~/henuoc-app/app/REVISION)"
[[ "$release_sha" =~ ^[0-9a-f]{40}$ ]] || exit 1
mkdir -p "$HOME/deploy/henuoc/$release_sha"
rsync -a "$HOME/henuoc-app/app/" "$HOME/deploy/henuoc/$release_sha/"
printf '%s\n' "$release_sha" > "$HOME/deploy/henuoc/CURRENT"
```

Khi kích hoạt bản mới, CURRENT cũ sẽ thành PREVIOUS. Nếu chưa có PREVIOUS, rollback báo rõ và fail.

### 5.4 Rollback tay

```bash
ssh -i ~/.ssh/henuoc_deploy -p 2210 -o StrictHostKeyChecking=yes \
  yvltjpca@<HOST> 'bash ~/deploy/rollback.sh'
```

Script mặc định đọc `~/deploy/henuoc/PREVIOUS`, rồi gọi activate để phục hồi code và restart Passenger. Có thể chọn một release vẫn còn bằng `bash ~/deploy/rollback.sh <sha>`. Sau đó kiểm tra `/api/health` có `ok=true`, revision đúng bản vừa phục hồi. Rollback code không rollback DB.

### 5.5 Health check — `src/app/api/health/route.ts`

Trả `{ ok, database, revision, time }`; `ok=true` khi truy vấn DB thành công. Có `Cache-Control: no-store`. Smoke test kiểm cả ok và revision để không nhầm một process Passenger cũ vẫn còn sống với bản mới.

## 6. Database migration an toàn

**Hiện chưa tích hợp migration trong deploy.** Khi bổ sung, migration chạy **trước** khi code mới lên → trong vài chục giây, **code cũ chạy trên schema mới**. Quy tắc **expand → contract**:

| Muốn | Làm đúng |
|---|---|
| Thêm cột | Thêm cột **nullable** hoặc có default → deploy |
| Đổi tên cột | (1) thêm cột mới + code ghi cả 2 → deploy (2) backfill (3) code chỉ đọc cột mới → deploy (4) xoá cột cũ → deploy |
| Xoá cột | (1) code thôi dùng → deploy (2) migration xoá → deploy |

Không bao giờ sửa file migration đã merge. Dev dùng **project Supabase riêng** hoặc Postgres local, không bao giờ trỏ `migrate dev` vào DB production.

## 7. Cron (DirectAdmin → Cron Jobs)

```bash
# 02:00 hằng ngày — đồng bộ đơn ACCESSTRADE
0 2 * * *  curl -fsS -H "Authorization: Bearer <CRON_SECRET>" https://henuoc.com/api/cron/sync-conversions >/dev/null
# 20:00 hằng ngày — email tóm tắt RSVP
0 20 * * * curl -fsS -H "Authorization: Bearer <CRON_SECRET>" https://henuoc.com/api/cron/rsvp-digest >/dev/null
# Chủ nhật 03:00 — kiểm tra link Shopee chết
0 3 * * 0  curl -fsS -H "Authorization: Bearer <CRON_SECRET>" https://henuoc.com/api/cron/check-products >/dev/null
```
Route `/api/cron/[job]` so sánh header bằng `timingSafeEqual`.

## 8. Vận hành

| Việc | Cách |
|---|---|
| Xem log app | DirectAdmin → Setup Node.js App → app → log; hoặc `~/henuoc-app/stderr.log` (tuỳ cấu hình CloudLinux) |
| Restart tay | `touch ~/henuoc-app/tmp/restart.txt` hoặc nút Restart trong panel |
| Cold start | Passenger tắt app khi rảnh → request đầu chậm 2–5s. **UptimeRobot** ping `/api/health` mỗi 5 phút (free) để giữ ấm + báo downtime |
| Giới hạn tài nguyên | DirectAdmin → Resource Usage (RAM, CPU, entry processes). Vượt thường xuyên → nâng gói hoặc chuyển VPS |
| Backup DB | GitHub Action hằng tuần `pg_dump` (qua `DIRECT_URL`) → R2 (T-064). Supabase Free không có backup tải về; PITR là add-on trả phí |
| Backup media | R2 bền vững sẵn; bật Object versioning nếu cần |
| Secret rotate | Đổi trong panel + GitHub Secrets → restart |

## 9. Local development

```bash
# 1 lần
brew install node@22            # hoặc nvm install 22
cp .env.example .env.local      # DATABASE_URL / DIRECT_URL = project Supabase dev
npm ci
npx prisma migrate dev
npm run dev
```
Không bắt buộc Docker. Muốn DB offline: `docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=dev postgres:17`.

## 10. Đường nâng cấp (khi nào rời shared hosting)

Chuyển sang **AZDIGI Cloud VPS + Docker Compose + Caddy** khi gặp 1 trong: RAM/CPU limit thường xuyên · cần websocket/job dài · cần Postgres self-host · traffic > ~50k lượt/ngày.
Bản standalone chạy y nguyên trong Docker (`node server.js`) → **không sửa code**, chỉ thay bước deploy.

## 11. Rủi ro cần kiểm chứng ở T-006

- [ ] CloudLinux chấp nhận cấu trúc wrapper + `app/node_modules` (mục §3). Nếu không: thử đặt standalone trực tiếp ở root và báo Claude.
- [ ] Xác minh rsync qua SSH cổng **2210** và host key cho workflow tự động.
- [ ] Passenger đọc env từ panel cho process Node (kiểm tra bằng `/api/health` hiển thị `revision`).
- [ ] Kết nối Supabase từ host và từ GitHub Actions: outbound 6543 + 5432 không bị chặn, có IPv4 tới pooler (host direct chỉ IPv6). Bị chặn → hỏi AZDIGI mở cổng.

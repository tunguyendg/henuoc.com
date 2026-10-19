# 06 — Deployment: Local → AZDIGI → CI/CD

**Version:** 2.0 · 2026-10-19 · Hosting: **AZDIGI DirectAdmin + CloudLinux "Setup Node.js App" (Passenger), Node 22**

## 1. Bức tranh

```
 Mac (dev)                      GitHub                                   AZDIGI (user yvltjpca)
 ─────────                      ──────                                   ─────────────────────
 npm run dev ── git push ──▶  PR: CI (typecheck·lint·test·build)
                              merge main ─▶ Deploy workflow (Ubuntu x64):
                                 1. npm ci · test
                                 2. prisma migrate deploy ───────────▶ Neon (Singapore)
                                 3. next build (standalone)
                                 4. đóng gói release/
                                 5. rsync SSH ─────────────────────▶ ~/deploy/henuoc/<sha>/
                                 6. ssh activate.sh ───────────────▶ ~/henuoc-app/ + restart Passenger
                                 7. curl /api/health  ◀────────────── https://henuoc.com
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
│  └─ CURRENT                     ← sha đang chạy
└─ nodevenv/henuoc-app/22/     ← do CloudLinux tạo, không đụng
```

**Vì sao có thư mục con `app/`:** CloudLinux Node selector quản lý `node_modules` ở app root (symlink sang `nodevenv`). Bản standalone có `node_modules` riêng → đặt trong `app/` để không đụng nhau. File wrapper:

```js
// henuoc-app/server.js — Passenger entry
process.env.NODE_ENV = "production";
require("./app/server.js");
```

```json
// henuoc-app/package.json
{ "name": "henuoc-app", "private": true, "main": "server.js" }
```

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
4. **SSH Keys**: tạo cặp key riêng cho deploy trên Mac:
   ```bash
   ssh-keygen -t ed25519 -C "github-deploy-henuoc" -f ~/.ssh/henuoc_deploy -N ""
   cat ~/.ssh/henuoc_deploy.pub   # dán vào DirectAdmin → SSH Keys → Authorize
   ssh -i ~/.ssh/henuoc_deploy -p <PORT> yvltjpca@<HOST> 'node -v; echo ok'
   ```
   Cần biết từ AZDIGI: **SSH host + port** (hỏi support nếu panel không hiện).
5. Tạo thư mục: `mkdir -p ~/henuoc-app/tmp ~/deploy/henuoc` + upload `scripts/deploy/activate.sh`, `rollback.sh` vào `~/deploy/`.
6. **GitHub → repo → Settings → Environments → `production`** → secrets:

| Secret | Giá trị |
|---|---|
| `SSH_HOST` / `SSH_PORT` / `SSH_USER` | host AZDIGI / port / `yvltjpca` |
| `SSH_KEY` | nội dung `~/.ssh/henuoc_deploy` (private) |
| `DATABASE_URL` / `DIRECT_URL` | Neon production |
| `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_MEDIA_URL` | `https://henuoc.com` / `https://media.henuoc.com` |

> Biến `NEXT_PUBLIC_*` được **nhúng vào JS lúc build** → phải có ở GitHub. Biến bí mật (auth, R2, ACCESSTRADE…) chỉ cần lúc **chạy** → để ở panel AZDIGI.

## 5. Workflow

### 5.1 CI — `.github/workflows/ci.yml`
```yaml
name: CI
on:
  pull_request:
  push: { branches-ignore: [main] }
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npx prisma generate
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run test
      - run: npm run build
        env:
          SKIP_ENV_VALIDATION: "1"
          NEXT_PUBLIC_SITE_URL: https://henuoc.com
          NEXT_PUBLIC_MEDIA_URL: https://media.henuoc.com
```

### 5.2 Deploy — `.github/workflows/deploy.yml`
```yaml
name: Deploy production
on:
  push: { branches: [main] }
  workflow_dispatch:
concurrency: { group: deploy-production, cancel-in-progress: false }

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }

      - run: npm ci
      - run: npx prisma generate
      - run: npm run typecheck && npm run lint && npm run test

      - name: Migrate database
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          DIRECT_URL: ${{ secrets.DIRECT_URL }}

      - name: Build
        run: npm run build
        env:
          SKIP_ENV_VALIDATION: "1"
          NEXT_PUBLIC_SITE_URL: ${{ secrets.NEXT_PUBLIC_SITE_URL }}
          NEXT_PUBLIC_MEDIA_URL: ${{ secrets.NEXT_PUBLIC_MEDIA_URL }}

      - name: Assemble release
        run: |
          mkdir -p release
          cp -r .next/standalone/. release/
          mkdir -p release/.next
          cp -r .next/static release/.next/static
          cp -r public release/public
          # images.unoptimized → không cần sharp (~46MB): 68MB → 22MB (đã test T-001)
          rm -rf release/node_modules/sharp release/node_modules/@img release/node_modules/@emnapi release/node_modules/detect-libc
          echo "${{ github.sha }}" > release/REVISION

      - name: Configure SSH
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.SSH_KEY }}" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh-keyscan -p ${{ secrets.SSH_PORT }} ${{ secrets.SSH_HOST }} >> ~/.ssh/known_hosts

      - name: Upload release
        run: |
          rsync -az --delete \
            -e "ssh -i ~/.ssh/deploy_key -p ${{ secrets.SSH_PORT }}" \
            release/ ${{ secrets.SSH_USER }}@${{ secrets.SSH_HOST }}:deploy/henuoc/${{ github.sha }}/

      - name: Activate
        run: |
          ssh -i ~/.ssh/deploy_key -p ${{ secrets.SSH_PORT }} \
            ${{ secrets.SSH_USER }}@${{ secrets.SSH_HOST }} \
            "bash ~/deploy/activate.sh ${{ github.sha }}"

      - name: Smoke test
        run: |
          sleep 10
          curl -fsS --retry 6 --retry-delay 10 --retry-all-errors \
            "${{ secrets.NEXT_PUBLIC_SITE_URL }}/api/health" | grep -q '"ok":true'
```

### 5.3 Script trên host — `scripts/deploy/activate.sh`
```bash
#!/usr/bin/env bash
set -euo pipefail
SHA="${1:?usage: activate.sh <sha>}"
APP="$HOME/henuoc-app"
REL="$HOME/deploy/henuoc"

[ -d "$REL/$SHA" ] || { echo "release $SHA not found"; exit 1; }

# Đồng bộ release vào app/ (giữ nguyên server.js wrapper, package.json, tmp/ ở app root)
mkdir -p "$APP/app" "$APP/tmp"
rsync -a --delete "$REL/$SHA/" "$APP/app/"

# Passenger restart
touch "$APP/tmp/restart.txt"

# Ghi lại release hiện tại, giữ 3 bản gần nhất
[ -f "$REL/CURRENT" ] && cp "$REL/CURRENT" "$REL/PREVIOUS"
echo "$SHA" > "$REL/CURRENT"
ls -1dt "$REL"/*/ | tail -n +4 | xargs -r rm -rf
echo "activated $SHA"
```

### 5.4 Rollback — `scripts/deploy/rollback.sh`
```bash
#!/usr/bin/env bash
set -euo pipefail
REL="$HOME/deploy/henuoc"
SHA="${1:-$(cat "$REL/PREVIOUS")}"
bash "$HOME/deploy/activate.sh" "$SHA"
```
Chạy: `ssh ... 'bash ~/deploy/rollback.sh'`. **Lưu ý:** rollback code không rollback DB → xem §6.

### 5.5 Health check — `src/app/api/health/route.ts`
Trả `{ ok: true, revision, db: "up" }` sau `SELECT 1`. Không lộ thông tin nhạy cảm.

## 6. Database migration an toàn

Migration chạy **trước** khi code mới lên → trong vài chục giây, **code cũ chạy trên schema mới**. Quy tắc **expand → contract**:

| Muốn | Làm đúng |
|---|---|
| Thêm cột | Thêm cột **nullable** hoặc có default → deploy |
| Đổi tên cột | (1) thêm cột mới + code ghi cả 2 → deploy (2) backfill (3) code chỉ đọc cột mới → deploy (4) xoá cột cũ → deploy |
| Xoá cột | (1) code thôi dùng → deploy (2) migration xoá → deploy |

Không bao giờ sửa file migration đã merge. Dev dùng **Neon branch** riêng (`dev`), production là branch `main`.

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
| Backup DB | Neon PITR (7 ngày, free 24h — kiểm tra gói) + GitHub Action hằng tuần `pg_dump` → R2 (T-064) |
| Backup media | R2 bền vững sẵn; bật Object versioning nếu cần |
| Secret rotate | Đổi trong panel + GitHub Secrets → restart |

## 9. Local development

```bash
# 1 lần
brew install node@22            # hoặc nvm install 22
cp .env.example .env.local      # DATABASE_URL = Neon branch "dev"
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
- [ ] Cổng SSH + rsync có sẵn trên host.
- [ ] Passenger đọc env từ panel cho process Node (kiểm tra bằng `/api/health` hiển thị `revision`).
- [ ] Kết nối Neon từ host (outbound 5432 không bị chặn). Nếu bị chặn → dùng Neon serverless driver qua HTTPS/WebSocket (`@prisma/adapter-neon`).

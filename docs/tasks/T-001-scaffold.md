# T-001 — Scaffold repo mới

**Milestone:** M0 · **Loại:** 🟢 agent · **Branch:** `chore/T-001-scaffold` · **Phụ thuộc:** —

## Mục tiêu
Repo `henuoc` có bộ khung Next.js 16 sạch, đúng cấu trúc `AGENTS.md`, đủ script kiểm tra để mọi task sau dùng chung.

## Phạm vi
**Tạo:** toàn bộ file khởi tạo ở root, `src/app/(marketing)/page.tsx` (trang "sắp ra mắt"), `src/app/layout.tsx`, cấu trúc thư mục rỗng có `.gitkeep`.
**Không:** Prisma, auth, theme, UI primitives (task khác).

## Yêu cầu chi tiết
1. `npx create-next-app@latest henuoc --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack` rồi pin version chính xác trong `package.json` (bỏ `^` cho `next`, `react`, `react-dom`).
2. `tsconfig.json`: `"strict": true`, `"noUncheckedIndexedAccess": true`.
3. Scripts:
   ```json
   "dev": "next dev",
   "build": "next build",
   "start": "node .next/standalone/server.js",
   "typecheck": "tsc --noEmit",
   "lint": "eslint .",
   "test": "vitest run",
   "test:watch": "vitest",
   "format": "prettier --write ."
   ```
4. Cài dev: `vitest`, `@vitejs/plugin-react`, `prettier`, `prettier-plugin-tailwindcss`. 1 test mẫu `src/lib/utils.test.ts` cho hàm `cn()`.
5. `next.config.ts` theo `docs/06-DEPLOYMENT.md §2`.
6. Tạo thư mục theo `AGENTS.md §2` (rỗng, `.gitkeep`).
7. `.gitignore` thêm: `.env*` (trừ `!.env.example`), `*.zip`, `*.tar.gz`, `release/`, `.DS_Store`.
8. `layout.tsx`: `lang="vi"`, font Be Vietnam Pro + Playfair Display (`subsets: ["vietnamese"]`), metadata cơ bản (`metadataBase`, title template `%s · Hẹn Ước`).
9. Trang `/`: logo chữ "Hẹn Ước", dòng "Thiệp cưới online — sắp ra mắt", nền `#FBFAF8`. `robots: noindex` tạm thời.
10. Copy toàn bộ `docs/`, `AGENTS.md`, `CLAUDE.md`, `README.md` từ gói tài liệu vào repo.

## Acceptance criteria
- [ ] `npm run dev` hiện trang sắp ra mắt, dấu tiếng Việt đúng ở cả 2 font
- [ ] `npm run typecheck && npm run lint && npm run test && npm run build` pass
- [ ] `.next/standalone/server.js` tồn tại sau build
- [ ] `node .next/standalone/server.js` chạy được (sau khi copy static theo §5.2 deployment) — ghi lệnh test vào PR
- [ ] Không có file thừa từ template create-next-app (svg mặc định, nội dung mẫu)

## Kiến thức cần hiểu
- App Router: `layout.tsx` vs `page.tsx`, route group `(marketing)` không tạo URL
- Server Component là mặc định — trang này không cần `"use client"`
- `next/font` tải font lúc build, tự host, không gọi Google lúc chạy
- `output: "standalone"` tạo ra gì và vì sao thiếu `public/` + `.next/static`

## Câu hỏi tự kiểm tra
1. Vì sao `(marketing)` có ngoặc mà URL vẫn là `/`?
2. Nếu thêm `onClick` vào trang `/` thì chuyện gì xảy ra, sửa thế nào?
3. `npm run start` chạy file nào, và trên AZDIGI file nào là startup file?

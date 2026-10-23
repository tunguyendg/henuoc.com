# Learning log — học qua dự án

Mục tiêu: Tony hiểu được **vì sao** code chạy như vậy, đủ để tự sửa lỗi production và trả lời phỏng vấn.

## Cách học mỗi milestone

1. **Trong mỗi PR:** mục "Kiến thức đáng chú ý" (agent viết, 3–5 ý gắn với code).
2. **Task 🔴:** Tony tự code. Kẹt → hỏi Claude: dán code + lỗi, Claude giải thích, **không viết hộ toàn bộ**.
3. **Cuối milestone:** Claude viết `Mx-<chu-de>.md` gồm:
   - Sơ đồ luồng request của tính năng vừa làm (browser → server → DB → về)
   - 5–8 khái niệm chính, mỗi khái niệm: là gì · trong code mình nằm ở đâu · sai thì hỏng gì
   - Những chỗ **production khác bài học** (cache, bảo mật, lỗi mạng, giới hạn host)
   - 5 câu hỏi tự kiểm tra kiểu phỏng vấn — Tony trả lời ngay trong file, Claude chấm
4. **Thử phá:** mỗi milestone 1 bài "cố tình làm hỏng" (vd: bỏ check ownership → viết test chứng minh lỗ hổng → sửa lại).

## Danh sách dự kiến

| File | Chủ đề |
|---|---|
| `M0-foundation.md` | App Router, Server/Client Component, env, Prisma client, standalone, Passenger, CI/CD |
| `M1-themes.md` | Composition, custom hook, dynamic import, CSS scoping, next/font, a11y motion, thuật toán âm lịch. **Đã viết:** Phần 1 — khung theme engine (T-010): hợp đồng `ThemeProps`, registry + `import()`, `defineTheme` và chiều gán tham số hàm, memo Promise, `safeParse`, `params` Promise + 404 tĩnh, `Object.hasOwn`. **Phần 2 (T-013):** primitive trải nghiệm khách: user activation và autoplay nhạc, `useSyncExternalStore` với server snapshot, ranh giới Server/Client = ranh giới serialize, progressive enhancement, validate URL allowlist, SVG data URI, bẫy `"\;"`, bài tập tự code `useMusic` |
| `M2-seo.md` | SSG/dynamic, Cache Components, metadata, sitemap, OG, Core Web Vitals |
| `M3-auth-data.md` | Cookie/session, OAuth, Server Actions an toàn, ownership/IDOR, presigned URL, revalidate |
| `M4-rsvp.md` | Route Handler, transaction, upsert idempotent, rate limit, hash vs encrypt |
| `M5-integrations.md` | Gọi API ngoài, retry/backoff, cron, đồng bộ idempotent |
| `M6-production.md` | Monitoring, backup/restore, rollback, expand–contract migration |

Không giảng lại JS/React cơ bản đã học trong khoá.

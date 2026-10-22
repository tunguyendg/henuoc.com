---
name: viet-bai
description: Viết 1 bài Cẩm nang chuẩn SEO cho henuoc.com từ một chủ đề/từ khoá, rồi commit. Dùng khi Tony gõ /viet-bai.
argument-hint: "[chủ đề hoặc từ khoá chính]"
disable-model-invocation: true
---

Chủ đề: $ARGUMENTS

1. **Chống trùng**: đọc `src/data/articles.ts` + `src/content/cam-nang/`. Nếu đã có bài cùng từ khoá chính → dừng, đề xuất góc khác.
2. **Dàn ý** (báo Tony 5 dòng rồi viết luôn, không chờ): từ khoá chính, 2–3 từ khoá phụ, H1, các H2, ý định người tìm (họ muốn biết gì).
3. **Viết** theo đúng định dạng 2 bài đã có: MDX trong `src/content/cam-nang/<slug>.mdx`, metadata trong `articles.ts`.
   - 1.000–1.800 chữ, tiếng Việt tự nhiên, xưng hô nhất quán, câu ngắn, có ví dụ thực tế đám cưới Việt.
   - H1 chứa từ khoá; mở bài trả lời ngay câu hỏi chính trong 2–3 câu.
   - ≥ 3 link nội bộ: 1 tới `/mau-thiep-cuoi` hoặc trang phong cách, 1 tới `/tinh-nang/*` liên quan, 1 tới bài cẩm nang khác. Cuối bài có CTA `/tao-thiep`.
   - KHÔNG bịa số liệu, khảo sát, trích dẫn chuyên gia. Phong tục vùng miền khác nhau thì nói rõ là khác nhau.
4. **Kiểm**: `npx vitest run tests/seo.test.ts && npm run typecheck && npm run lint && npm run format:check`.
5. Commit `content(cam-nang): <tiêu đề>` — chỉ file của bài. Không push.

Báo Tony: link localhost để đọc, 3 dòng tóm tắt, chỗ nào cần Tony kiểm lại kiến thức phong tục.
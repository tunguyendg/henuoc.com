---
name: codex
description: Giao một việc rõ spec cho Codex CLI chạy không tương tác, rồi review kết quả. Dùng cho việc lặp, khối lượng lớn, ít quyết định thiết kế.
argument-hint: "[việc giao cho Codex]"
disable-model-invocation: true
---

Việc: $ARGUMENTS

1. Kiểm tra Codex có sẵn: `codex --version`. Không có → báo Tony cài (`npm i -g @openai/codex` rồi `codex login`), dừng.
2. Kiểm `git status --short` sạch (hoặc commit trước) để diff của Codex tách bạch.
3. Viết spec vào `.claude/codex-task.md` (file tạm, đã gitignore): mục tiêu, file được sửa, file cấm đụng
   (`.env*`, `.github/`, `prisma/migrations/`, `public/images/`), tiêu chí xong, nhắc Codex đọc `AGENTS.md`
   và chạy `npm run typecheck && npm run lint && npm test`.
4. Chạy (sandbox chỉ ghi trong repo, không mạng):
   `codex exec --sandbox workspace-write -o .claude/codex-result.md "$(cat .claude/codex-task.md)"`
5. Đọc `.claude/codex-result.md` + `git diff`. Gọi `code-reviewer` và `security-reviewer`.
   Không đạt → sửa nhỏ tự làm, sửa lớn thì `git restore` và giao lại với spec rõ hơn.
6. Báo Tony: Codex đã làm gì, review nói gì, đã giữ hay bỏ.

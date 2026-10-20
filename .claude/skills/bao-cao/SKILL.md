---
name: bao-cao
description: Báo cáo tình hình dự án henuoc.com cho Tony — tiến độ, sức khoẻ code, bảo mật, việc tiếp theo. Dùng khi Tony hỏi "đang tới đâu rồi".
disable-model-invocation: true
allowed-tools: Bash(git status *) Bash(git log *) Bash(git diff *) Bash(npm run typecheck) Bash(npm run lint) Bash(npm test)
---

Thu thập (chạy thật, không đoán):
- `docs/STATUS.md`, `docs/05-ROADMAP.md`
- `git log --oneline -15`, `git status --short`
- `npm run typecheck`, `npm run lint`, `npm test` (chỉ ghi pass/fail + lỗi đầu tiên)
- Quét nhanh bảo mật: `git ls-files | grep -E '\.env($|\.)' | grep -v example` (phải rỗng);
  grep `dangerouslySetInnerHTML`, `"use client"` file import từ `@/lib/db` hoặc `@/lib/env`.

Gọi `security-reviewer` nếu có thay đổi chưa commit.

Báo cáo dạng (ngắn, tiếng Việt):
## Tình hình henuoc.com — <ngày>
**Milestone:** Mx · x/y task xong
**Sức khoẻ:** typecheck ✅/❌ · lint ✅/❌ · test n/n · build lần cuối
**Bảo mật:** các điểm đạt / cần xử lý (mỗi điểm 1 dòng, giải thích vì sao quan trọng)
**Cấu trúc:** thư mục nào mới thêm, có gì lệch AGENTS.md §2 không
**Tiếp theo:** 3 việc ưu tiên, đánh dấu 🔴 việc Tony tự code
**Tony cần quyết:** câu hỏi đang chờ (nếu có)

Cập nhật mục "Cập nhật lần cuối" trong `docs/STATUS.md`.

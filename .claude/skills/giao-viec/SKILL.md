---
name: giao-viec
description: Tổng chỉ huy nhận việc từ Tony, chia bước, giao agent chuyên biệt (hoặc Codex), review bảo mật + code, cập nhật STATUS, báo cáo và giảng lại. Dùng khi Tony giao một việc build.
argument-hint: "[mô tả việc hoặc T-xxx]"
disable-model-invocation: true
---

Việc Tony giao: $ARGUMENTS

Làm đúng thứ tự, mỗi bước báo Tony 1 dòng:

1. **Nắm tình hình**: đọc `docs/STATUS.md`, `git log --oneline -10`, `git status --short`. Nếu là `T-xxx` → đọc
   `docs/tasks/T-xxx-*.md` và kiểm ký hiệu trong `docs/05-ROADMAP.md`. Task 🔴 → dừng ở chế độ giảng/review,
   không viết code hộ.
2. **Kế hoạch**: liệt kê ≤ 6 bước, mỗi bước: agent nào · file nào · vì sao. Việc mơ hồ hoặc tốn công
   (> 10 file, đổi schema, thêm dependency, đổi route) → hỏi Tony duyệt kế hoạch trước. Việc rõ ràng → làm luôn.
3. **Giao việc**: gọi subagent theo bảng trong `CLAUDE.md`. Prompt cho agent phải tự đủ: mục tiêu, file được sửa,
   file cấm đụng, tiêu chí xong. Việc lặp/rõ spec có thể dùng skill `/codex`.
4. Gác cổng 1 lần cuối task theo luật tiết kiệm token trong CLAUDE.md.
5. **Kiểm tra**: `npm run typecheck && npm run lint && npm run format:check && npm test`.
6. **Ghi sổ**: cập nhật `docs/STATUS.md` (Đã xong / Đang làm / Tiếp theo / Rủi ro). Có khái niệm mới → gọi `teacher`.
7. **Commit** thẳng `main` bằng Conventional Commit. **Hỏi Tony trước khi `git push`.**

Báo cáo cuối (≤ 8 dòng):
- ✅ Đã làm (file chính)
- 🔐 Bảo mật: kết quả security-reviewer, giải thích 1 câu
- 🧱 Cấu trúc: file mới nằm đâu, vì sao ở đó
- 📚 Kiến thức đáng chú ý (2–3 ý)
- 👉 Tony cần làm: lệnh test local / xem trang nào / có push không

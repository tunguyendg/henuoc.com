---
name: kiem-tra
description: Kiểm tra trước khi commit/push — Definition of Done + review bảo mật + review code. Dùng trước mỗi lần commit hoặc khi Tony gõ /kiem-tra.
disable-model-invocation: true
allowed-tools: Bash(npm run typecheck) Bash(npm run lint) Bash(npm run format:check) Bash(npm test) Bash(npm run build) Bash(git status *) Bash(git diff *)
---

1. `npm run typecheck && npm run lint && npm run format:check && npm test`. Nếu đối số là `build`: thêm `npm run build`. ($ARGUMENTS)
2. Gọi song song `security-reviewer` và `code-reviewer` trên thay đổi hiện tại.
3. Kết luận 1 dòng: **SẴN SÀNG COMMIT** hoặc **CHƯA** + danh sách việc phải sửa (mỗi việc 1 dòng, kèm vì sao).
Không tự sửa — hỏi Tony có muốn giao agent sửa không.

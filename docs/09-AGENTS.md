# 09 — Đội agent: ai làm gì, Tony dùng thế nào

## 1. Sơ đồ

```
                    Tony (giao việc, duyệt, push)
                              │  /giao-viec  /bao-cao  /kiem-tra  /codex
                              ▼
               ┌──── Claude Code = TỔNG CHỈ HUY (CLAUDE.md) ────┐
               │   đọc STATUS → lên kế hoạch → giao → gác cổng  │
               └───┬──────────┬──────────┬──────────┬──────────┬┘
       THỢ (sửa code)                                 GÁC CỔNG (chỉ đọc)
   frontend-builder  backend-builder  seo-guardian    code-reviewer
   test-writer       Codex (/codex)                   security-reviewer
                              │
                         teacher → docs/learning/  (giảng cho Tony)
```

- **Thợ** được sửa file. **Gác cổng** chỉ có quyền đọc (`tools: Read, Glob, Grep, Bash`) → không thể "tự sửa cho qua".
- Mỗi subagent chạy trong **context riêng**: nó chỉ biết prompt của nó + những gì tổng chỉ huy đưa. Vì vậy prompt giao việc phải tự đủ.

## 2. File nằm đâu

| File | Là gì |
|---|---|
| `CLAUDE.md` | Luật cho tổng chỉ huy (Claude Code đọc tự động mỗi phiên) |
| `AGENTS.md` | Luật chung cho mọi agent (Codex đọc file này) |
| `.claude/agents/*.md` | 7 agent chuyên biệt: frontmatter (tên, mô tả, tools) + prompt |
| `.claude/skills/*/SKILL.md` | Lệnh `/giao-viec`, `/bao-cao`, `/kiem-tra`, `/codex` |
| `.claude/settings.json` | Quyền: tự chạy / phải hỏi / cấm hẳn |
| `docs/STATUS.md` | Bảng tình hình — nguồn để báo cáo |

## 3. Lệnh dùng hằng ngày

| Gõ | Kết quả |
|---|---|
| `/giao-viec làm trang /tinh-nang` | Lên kế hoạch → giao agent → review → test → commit → báo cáo |
| `/giao-viec T-012` | Làm theo spec `docs/tasks/T-012-*.md` (task 🔴 thì chỉ giảng/review) |
| `/bao-cao` | Tiến độ, sức khoẻ code, bảo mật, việc tiếp theo |
| `/kiem-tra` hoặc `/kiem-tra build` | Kiểm trước khi commit/push |
| `/codex viết test cho lib/vietqr.ts` | Giao Codex, Claude review lại |
| `@security-reviewer xem diff này` | Gọi thẳng 1 agent |

## 4. Bảo mật của chính đội agent (`.claude/settings.json`)

- **Tự chạy**: typecheck, lint, test, build, format, `git status/diff/log/add/commit`.
- **Phải hỏi Tony**: `git push`, `npm install`, `prisma migrate`, chạy Codex, sửa `.github/`, `prisma/migrations/`, settings.
- **Cấm**: đọc `.env` / `.env.local` / `.env.production`, `*.pem`, `printenv`, `git push --force`, `git reset --hard`,
  `rm -rf`, `prisma migrate reset`, ghi vào `public/images/`.

Vì sao: agent đọc được file nào thì nội dung file đó đi vào context của model. Secret không bao giờ được vào đó.
`deny` thắng `allow` — kể cả khi agent "tưởng" mình cần.

`.claude/settings.local.json` (đã gitignore) là chỗ Tony tự nới quyền trên máy mình mà không ảnh hưởng repo.

## 5. Codex phối hợp thế nào

Codex là CLI riêng của OpenAI, đọc `AGENTS.md`. Skill `/codex` gọi `codex exec --sandbox workspace-write`
(chỉ ghi trong repo, không mạng), lấy kết quả rồi cho `code-reviewer` + `security-reviewer` soát.
Hợp với việc lặp, rõ spec (viết test, chuyển dữ liệu, tạo nhiều trang giống nhau). Việc thiết kế / bảo mật → Claude.

## 6. Thêm / sửa agent

Tạo `.claude/agents/<ten>.md`:

```markdown
---
name: ten-agent
description: Khi nào tổng chỉ huy nên gọi agent này (viết rõ — Claude dựa vào câu này để chọn)
tools: Read, Glob, Grep        # bỏ trống = mọi tool; gác cổng thì chỉ cho đọc
---
Prompt: vai trò, phải đọc gì trước, luật, cách báo cáo.
```

Thư mục `.claude/agents/` mới tạo lần đầu → khởi động lại Claude Code.

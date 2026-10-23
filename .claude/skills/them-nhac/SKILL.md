---
name: them-nhac
description: Thêm 1 bài nhạc nền thiệp vào kho src/content/music/library.json từ link trang nguồn, xác minh giấy phép, tải + xử lý bằng music:fetch. Dùng khi Tony gõ /them-nhac.
argument-hint: "<link trang nguồn của bài nhạc>"
disable-model-invocation: true
---

Link: $ARGUMENTS

1. **Mở trang nguồn** (WebFetch; Commons thì dùng API `action=query&prop=imageinfo|extmetadata`). Đọc nguyên văn: tên bài, nghệ sĩ/người thu, thời lượng, giấy phép, có lời hay không, Content ID.
2. **Xác minh giấy phép** — chỉ nhận:
   - `PD` (Commons ghi public domain cho **bản thu**, không chỉ bản nhạc), `CC0`,
   - `Pixabay` (Pixabay Content License), `CC-BY-4.0` (vd. Kevin MacLeod / incompetech).
   **Từ chối và báo lý do** nếu: CC BY-SA / NC / ND, GFDL; YouTube hoặc link reupload; "no copyright", "free music" không rõ chủ sở hữu; bài có lời tiếng Việt có bản quyền (nhạc V-pop, nhạc cưới quen thuộc); trang không ghi giấy phép rõ; không mở được trang để kiểm.
3. **Chống trùng**: đọc `src/content/music/library.json`; trùng `sourceUrl` hoặc cùng bản thu → dừng.
4. **Lấy `downloadUrl` thật** (không đoán):
   - Commons: `imageinfo.url` từ API (bỏ query `utm_*`), host `upload.wikimedia.org`.
   - incompetech: `filename` trong `incompetech.com/music/royalty-free/pieces.json` → `https://incompetech.com/music/royalty-free/mp3-royaltyfree/<filename URL-encode>`, kiểm bằng `curl -I` ra 200.
   - Pixabay hoặc host khác chặn tải → `downloadUrl: null` (script chỉ cho tải từ `upload.wikimedia.org`, `incompetech.com`; host mới phải hỏi Tony trước khi thêm vào `allowedHosts`).
5. **Thêm entry** cuối `library.json`, đủ trường: `slug` (kebab-case), `title`, `artist`, `mood` (`trang-trong`|`lang-man`|`vui-tuoi`), `license`, `licenseUrl`, `sourceUrl`, `downloadUrl`, `contentId`, `credit` (CC-BY bắt buộc đúng mẫu 3 dòng như các bài Kevin MacLeod có sẵn), `hasVocals`, `enabled: true`.
6. **Chạy** `npm run music:fetch`. Nếu bài cần tải tay → nhắc Tony lưu file vào `~/Downloads/henuoc-music/<slug>.mp3` rồi chạy lại.
7. `npx prettier --check src/content/music/library.json public/audio/CREDITS.md` rồi commit `content(music): them <tên bài>` gồm `library.json` + `public/audio/CREDITS.md`. **Không commit file `.m4a`** (Tony nghe trước). Không push.

Báo Tony ≤ 5 dòng: tên bài · giấy phép (trích nguyên văn) · có lời/Content ID · đã tải hay cần tải tay · đường dẫn file `.m4a` để nghe.

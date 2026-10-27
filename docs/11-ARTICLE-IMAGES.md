# 11 — Ảnh cẩm nang

Manifest: `src/content/cam-nang/images.json`, mảng các object:

```json
[
  {
    "slug": "ten-bai",
    "role": "cover",
    "file": "anh-bia",
    "cdnPath": "photo-…",
    "photographer": "Tên tác giả",
    "photographerUrl": "https://unsplash.com/@tai-khoan",
    "unsplashUrl": "https://unsplash.com/photos/ma-anh",
    "alt": "Mô tả ảnh bằng tiếng Việt"
  }
]
```

- Mọi bài trong `src/data/articles.ts` bắt buộc có đúng một ảnh `role: "cover"`; file WebP phải có trong `public/images/cam-nang/<slug>/`. Test SEO kiểm cả manifest và file trên đĩa.
- `file` nhận tên kebab-case, có hoặc không có `.webp`; cũng nhận đường dẫn `cam-nang/<slug>/<tên>.webp`. Không nhận đường dẫn ra ngoài thư mục bài.
- `role` bắt buộc là `cover` hoặc `inline`. Trang bài, thẻ bài và metadata chọn ảnh bìa theo role, không theo vị trí trong manifest. OG dùng ảnh gốc rộng 1600px; Twitter dùng `summary_large_image`; `Article.image` là URL tuyệt đối của cùng ảnh bìa.
- Trong MDX, chèn ảnh sau ở vị trí biên tập muốn:

```mdx
<ArticleImage file="anh-trong-bai" />
```

Component tự lấy alt và credit từ manifest, chỉ tra ảnh thuộc bài hiện tại. Mỗi ảnh hiển thị `figure`, ảnh responsive và caption: ảnh Unsplash có link tác giả / Unsplash; ảnh tự chụp dùng `caption` riêng.

## Nguồn ảnh — luật cho agent

- Mỗi ảnh Unsplash (`cdnPath`) chỉ dùng **một lần** trong manifest: bìa không trùng bìa bài khác, cũng không trùng ảnh trong bài. `tests/seo.test.ts` kiểm luật này.
- Agent (Claude, Codex, subagent) **KHÔNG chép, tạo, ghi đè hay xoá file trong `public/images/`**, kể cả `CREDITS.md`. Ảnh chỉ vào thư mục đó qua script dưới đây, do Tony chạy.
- Bài mới cần ảnh: agent chọn ảnh Unsplash (giấy phép Unsplash, không phải Unsplash+) chưa dùng ở đâu trong dự án, đúng nội dung bài, rồi chỉ sửa `images.json`. Thiếu mạng hoặc chưa tìm được ảnh phù hợp → để trống entry, báo Tony; test ảnh bìa đỏ là đúng, không "chữa" bằng cách chép file.
- Đổi ảnh của một bài đã có: script giữ file cũ và không ghi lại credit trùng marker, nên Tony xoá file `.webp` cũ và khối credit `<!-- image: … -->` tương ứng trong `CREDITS.md` trước khi chạy lại.

Chạy bằng Node 22:

```bash
npm run images:cam-nang
```

Script dùng fetch có sẵn của Node, không cần dependency. Ảnh tải từ `images.unsplash.com` với `w=1600&q=75&fm=webp&fit=max`, lưu tại `public/images/cam-nang/<slug>/<tên>.webp`. File đã có được giữ nguyên. Chỉ ghi file mới khi HTTP thành công, content-type là `image/webp` và dung lượng lớn hơn 20 KiB. Lỗi ghi rõ tên ảnh, trả exit code 1; các ảnh hợp lệ khác vẫn được xử lý.

Credit của các file tải thành công hoặc đã có được ghi vào `public/images/cam-nang/CREDITS.md`, giữ nội dung cũ và không lặp credit khi chạy lại. Không dùng fixture kiểm thử làm nguồn ảnh thật.

Thiếu manifest: script báo lỗi rõ và ứng dụng không build được. Thiếu ảnh role cover hoặc file ảnh bìa: test SEO fail. Manifest có lỗi: cần sửa trước khi build. Sau khi cập nhật manifest, chạy tải ảnh trước khi build / deploy.

## Ảnh tự chụp

Manifest hỗ trợ `{ slug, file, source: "own", role, alt, caption }`. Không thêm trường Unsplash vào ảnh tự chụp. Tony đặt WebP tại cùng thư mục `public/images/cam-nang/<slug>/`; `file` nhận tên gốc, tên `.webp` hoặc đường dẫn `cam-nang/<slug>/<file>.webp` như ảnh Unsplash.

Script bỏ qua ảnh `source: "own"`, không tải và không ghi credit Unsplash. Component hiển thị caption riêng, dùng `object-contain` cho screenshot dọc. Test SEO kiểm sự tồn tại của tất cả file, kể cả ảnh inline tự chụp. Chỉ chụp dữ liệu demo, không chụp dữ liệu thật của khách.

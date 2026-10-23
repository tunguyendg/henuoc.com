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

Component tự lấy alt và credit từ manifest, chỉ tra ảnh thuộc bài hiện tại. Mỗi ảnh hiển thị `figure`, ảnh responsive và caption có link tác giả / Unsplash.

Chạy bằng Node 22:

```bash
npm run images:cam-nang
```

Script dùng fetch có sẵn của Node, không cần dependency. Ảnh tải từ `images.unsplash.com` với `w=1600&q=75&fm=webp&fit=max`, lưu tại `public/images/cam-nang/<slug>/<tên>.webp`. File đã có được giữ nguyên. Chỉ ghi file mới khi HTTP thành công, content-type là `image/webp` và dung lượng lớn hơn 20 KiB. Lỗi ghi rõ tên ảnh, trả exit code 1; các ảnh hợp lệ khác vẫn được xử lý.

Credit của các file tải thành công hoặc đã có được ghi vào `public/images/cam-nang/CREDITS.md`, giữ nội dung cũ và không lặp credit khi chạy lại. Không dùng fixture kiểm thử làm nguồn ảnh thật.

Thiếu manifest: script báo lỗi rõ và ứng dụng không build được. Thiếu ảnh role cover hoặc file ảnh bìa: test SEO fail. Manifest có lỗi: cần sửa trước khi build. Sau khi cập nhật manifest, chạy tải ảnh trước khi build / deploy.

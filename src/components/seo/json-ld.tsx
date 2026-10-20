/**
 * In dữ liệu có cấu trúc (schema.org) cho Google. `<` được escape để không thể chèn thẻ <script>.
 * Chỉ truyền dữ liệu do code mình tạo — không bao giờ truyền nội dung người dùng nhập.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

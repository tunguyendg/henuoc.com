/** "Nguyễn Minh Anh" → "nguyenminhanh". Bỏ dấu, viết liền, chỉ còn a-z0-9. */
export function toSlug(input: string): string {
  return input
    .normalize("NFD") // tách "ễ" thành "e" + các dấu rời
    .replace(/[\u0300-\u036f]/g, "") // xoá các dấu rời đó
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D") // "đ" không phải chữ có dấu nên NFD không tách được → xử lý riêng
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/** Slug thiệp: "minhanh-hoangnam". Tên toàn emoji/ký tự lạ → rỗng → dùng "thiep". */
export function weddingSlug(brideName: string, groomName: string): string {
  const parts = [toSlug(brideName), toSlug(groomName)].filter(Boolean);
  return parts.length ? parts.join("-") : "thiep";
}

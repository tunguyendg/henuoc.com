/** Chữ cái đầu để vẽ avatar: ưu tiên tên, không có thì lấy email; rỗng → "?". */
export function userInitial(user: { name?: string | null; email: string }): string {
  const source = user.name?.trim() || user.email.trim();
  // NFC: gộp chữ + dấu đang tách rời (NFD, hay gặp khi gõ trên macOS) để không rơi mất dấu.
  // Array.from tách theo code point nên emoji / ký tự ngoài BMP không bị cắt đôi.
  const first = Array.from(source.normalize("NFC"))[0];
  return first ? first.toLocaleUpperCase("vi") : "?";
}

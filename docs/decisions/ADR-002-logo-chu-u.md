# ADR-002 — Logo: chữ "Ư" với dấu râu trái tim

**Ngày:** 2026-10-19 · **Trạng thái:** Accepted · **Người quyết:** Tony

## Bối cảnh
Logo tạm (hai vòng nhẫn) quá phổ biến trong ngành cưới, nét mảnh, mờ ở 16 px, không gắn với tên thương hiệu. Đã so sánh 4 hướng: A Tơ Hồng, B Phong Thư, C Chữ Ư, D Khung Vòm.

## Quyết định
Chọn **C — chữ "Ư" có dấu râu là trái tim**.
- "Ư" là ký tự riêng của tiếng Việt và có ngay trong "Hẹn **Ư**ớc" → khó bị sao chép, gắn với tên.
- Nét phải thấp hơn nét trái, trái tim tách khỏi thân chữ → đọc đúng là "Ư" kể cả ở 32 px.
- Biểu tượng luôn đặt trong ô vuông bo góc màu Rose `#BD6477` ở header, footer, favicon, app icon → một hình duy nhất ở mọi nơi.

## File
| File | Dùng cho |
|---|---|
| `src/app/icon.svg` | Favicon chính (trình duyệt hiện đại, sắc nét mọi cỡ) |
| `src/app/favicon.ico` | Favicon dự phòng 16/32/48 px (bản 16 px nét dày hơn) |
| `src/app/apple-icon.png` | 180 px, khi thêm vào màn hình chính iPhone |
| `public/brand/icon-192.png`, `icon-512.png` | PWA (sau này) |
| `public/brand/mark.svg` | Biểu tượng nền trong suốt, màu Rose |
| `src/components/site/logo.tsx` | `LogoMark` (SVG inline, `currentColor`) + `Logo` (ô vuông + chữ) |

Hình gốc: path SVG trong `logo.tsx` là nguồn sự thật; các file icon xuất từ cùng path đó.

## Còn mở
Chưa kiểm tra trùng nhãn hiệu. Chữ "Hẹn Ước" vẫn dùng Playfair Display — có thể thay bằng wordmark vẽ riêng sau.

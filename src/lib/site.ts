import { env } from "@/lib/env";

export const site = {
  name: "Hẹn Ước",
  domain: "henuoc.com",
  url: env.NEXT_PUBLIC_SITE_URL,
  tagline: "Thiệp cưới online đẹp, gửi đúng tên từng khách",
  description:
    "Tạo thiệp cưới online đẹp trong vài phút, gửi lời mời mang tên từng khách qua Zalo và quản lý khách mời, RSVP dễ dàng.",
} as const;

/** Menu chính — dùng chung cho header desktop và menu mobile. */
export const mainNav = [
  { href: "/mau-thiep-cuoi", label: "Mẫu thiệp" },
  { href: "/tinh-nang", label: "Tính năng" },
  { href: "/bang-gia", label: "Bảng giá" },
  { href: "/cam-nang", label: "Cẩm nang" },
] as const;

export const footerNav = [
  {
    title: "Sản phẩm",
    links: [
      { href: "/mau-thiep-cuoi", label: "Mẫu thiệp cưới" },
      { href: "/tinh-nang", label: "Tính năng" },
      { href: "/bang-gia", label: "Bảng giá" },
      { href: "/tao-thiep", label: "Tạo thiệp miễn phí" },
    ],
  },
  {
    title: "Phong cách",
    links: [
      { href: "/mau-thiep-cuoi/phong-cach/truyen-thong", label: "Thiệp cưới truyền thống" },
      { href: "/mau-thiep-cuoi/phong-cach/toi-gian", label: "Thiệp cưới tối giản" },
      { href: "/mau-thiep-cuoi/phong-cach/hoa-la", label: "Thiệp cưới hoa lá" },
      { href: "/mau-thiep-cuoi/phong-cach/han-quoc", label: "Thiệp cưới Hàn Quốc" },
    ],
  },
  {
    title: "Cẩm nang",
    links: [
      { href: "/cam-nang", label: "Cách ghi thiệp cưới" },
      { href: "/cam-nang", label: "Lời mời đám cưới hay" },
      { href: "/cam-nang", label: "Checklist chuẩn bị đám cưới" },
    ],
  },
  {
    title: "Hẹn Ước",
    links: [
      { href: "/gioi-thieu", label: "Giới thiệu" },
      { href: "/cau-hoi-thuong-gap", label: "Câu hỏi thường gặp" },
      { href: "/lien-he", label: "Liên hệ" },
    ],
  },
] as const;

/** Legal links on the bottom row of the footer. */
export const legalNav = [
  { href: "/chinh-sach-bao-mat", label: "Chính sách bảo mật" },
  { href: "/dieu-khoan", label: "Điều khoản" },
] as const;

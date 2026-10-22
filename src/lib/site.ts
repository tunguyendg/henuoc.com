import { clientEnv } from "@/lib/env.client";

export const site = {
  name: "Hẹn Ước",
  domain: "henuoc.com",
  url: clientEnv.NEXT_PUBLIC_SITE_URL,
  /** The only official support channel. Always read it from here, never hard-code it. */
  supportEmail: "hotro@henuoc.com",
  tagline: "Thiệp cưới online đẹp, gửi đúng tên từng khách",
  description:
    "Tạo thiệp cưới online đẹp trong vài phút, gửi lời mời mang tên từng khách qua Zalo và quản lý khách mời, RSVP dễ dàng.",
} as const;

/** `mailto:` link to the support inbox, with an optional pre-filled subject. */
export function supportMailto(subject?: string) {
  const base = `mailto:${site.supportEmail}`;
  return subject ? `${base}?subject=${encodeURIComponent(subject)}` : base;
}

/** Anti-impersonation rule for deletion requests sent by email. Shared by /lien-he and the privacy policy. */
export const dataDeletionVerification =
  "Để bảo vệ bạn, Hẹn Ước chỉ xử lý yêu cầu xoá tài khoản khi email được gửi từ đúng địa chỉ dùng để đăng nhập; trường hợp khác, chúng mình sẽ gửi một liên kết xác nhận tới email tài khoản trước khi xoá. Với khách mời, chúng mình sẽ xác nhận với cặp đôi quản lý danh sách hoặc qua liên kết thiệp của bạn trước khi gỡ thông tin.";

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
    title: "Cẩm nang & công cụ",
    links: [
      { href: "/cam-nang/cach-ghi-thiep-cuoi", label: "Cách ghi thiệp cưới" },
      { href: "/cam-nang/loi-moi-dam-cuoi-hay", label: "Lời mời đám cưới hay" },
      { href: "/cong-cu/checklist-dam-cuoi", label: "Checklist đám cưới" },
      { href: "/cong-cu/mau-loi-moi-dam-cuoi", label: "Mẫu lời mời đám cưới" },
      { href: "/cong-cu", label: "Công cụ miễn phí" },
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

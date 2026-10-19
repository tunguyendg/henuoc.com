export const site = {
  name: "Hẹn Ước",
  domain: "henuoc.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  tagline: "Thiệp cưới online đẹp, gửi đúng tên từng khách",
  description:
    "Tạo thiệp cưới online đẹp trong vài phút, gửi lời mời mang tên từng khách qua Zalo và quản lý khách mời, RSVP dễ dàng.",
} as const;

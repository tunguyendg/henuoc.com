import { getTrack } from "@/data/music";
import "server-only"; // imports the QR renderer, which must never reach a client bundle
import { cache } from "react";
import { findBankByBin } from "@/data/banks";
import { qrSvgDataUri } from "@/lib/qr";
import { buildVietQrPayload } from "@/lib/vietqr";
import type { GiftView, ImageView, WeddingContent } from "../types";

// Shared sample data for /demo/[slug] and theme QA.
// ENTIRELY FICTIONAL: people, addresses and bank accounts are made up. The account numbers and QR
// payloads are placeholders only and must never be used for real transfers.

function demoGift(
  id: string,
  side: GiftView["side"],
  bankBin: string,
  accountNumber: string,
  accountName: string,
): GiftView {
  const bank = findBankByBin(bankBin);
  if (!bank) throw new Error(`Unknown bank BIN in demo content: ${bankBin}`);
  return {
    id,
    side,
    bankName: bank.shortName,
    accountNumber,
    accountName,
    qrPayload: buildVietQrPayload({
      bankBin,
      accountNumber,
      message: "MAU DEMO Mung cuoi",
    }),
  };
}

const LICENSE = "Unsplash License";

const album: ImageView[] = [
  {
    src: "/images/wedding/album-1.jpg",
    alt: "Ảnh đen trắng chú rể hôn cô dâu trên đồi, cô dâu cầm bó hoa",
    width: 1600,
    height: 2400,
    credit: `Bin Thieu · ${LICENSE}`,
  },
  {
    src: "/images/wedding/album-2.jpg",
    alt: "Cô dâu ngồi bên bờ biển, tay cầm bó hoa hồng nhạt",
    width: 1600,
    height: 1067,
    credit: `Trái Đất Nhân · ${LICENSE}`,
  },
  {
    src: "/images/wedding/album-3.jpg",
    alt: "Chú rể vest xanh ôm cô dâu trong căn phòng trang trí hoa trắng",
    width: 1600,
    height: 1067,
    credit: `Địa Cầu Nhân · ${LICENSE}`,
  },
  {
    src: "/images/wedding/album-4.jpg",
    alt: "Ảnh đen trắng chú rể mỉm cười trong xe hoa, tay cầm bó hoa",
    width: 1600,
    height: 1067,
    credit: `HACA Wedding · ${LICENSE}`,
  },
  {
    src: "/images/wedding/album-5.jpg",
    alt: "Cô dâu và chú rể cầm thư thề nguyện trong lễ cưới",
    width: 1600,
    height: 2399,
    credit: `Duong Ngan · ${LICENSE}`,
  },
  {
    src: "/images/wedding/album-6.jpg",
    alt: "Cô dâu chú rể đứng trên đồi cát nhìn về phía chân trời",
    width: 1600,
    height: 1067,
    credit: `Bin Thieu · ${LICENSE}`,
  },
  {
    src: "/images/wedding/hero.jpg",
    alt: "Cô dâu và chú rể trong ngày cưới",
    width: 1600,
    height: 1067,
    credit: `Bin Thieu · ${LICENSE}`,
  },
  {
    src: "/images/wedding/band.jpg",
    alt: "Cô dâu chú rể bên hồ trong ngày cưới",
    width: 1600,
    height: 1067,
    credit: `Tanny Do · ${LICENSE}`,
  },
];

export const demoContent: WeddingContent = {
  couple: {
    bride: {
      fullName: "Nguyễn Minh Anh",
      shortName: "Minh Anh",
      parents: "Ông Nguyễn Văn Hùng · Bà Lê Thị Thu",
    },
    groom: {
      fullName: "Trần Hoàng Nam",
      shortName: "Hoàng Nam",
      parents: "Ông Trần Quốc Bảo · Bà Phạm Thị Lan",
    },
    brideFirst: true,
  },
  families: {
    brideParents: "Ông Nguyễn Văn Hùng · Bà Lê Thị Thu",
    groomParents: "Ông Trần Quốc Bảo · Bà Phạm Thị Lan",
    brideAddr: "12 Đường Hoa Sen, Phường Mẫu, TP. Demo",
    groomAddr: "45 Đường Cúc Vàng, Phường Mẫu, TP. Demo",
  },
  events: [
    {
      id: "demo-vu-quy",
      kind: "vu-quy",
      title: "Lễ Vu Quy",
      startsAt: "2027-10-16T02:00:00.000Z",
      dateLabel: "Thứ Bảy, 16.10.2027",
      timeLabel: "09:00",
      lunarLabel: "Ngày 17 tháng 9 năm Đinh Mùi",
      venue: "Tư gia nhà gái",
      address: "12 Đường Hoa Sen, Phường Mẫu, TP. Demo",
      side: "nha-gai",
    },
    {
      id: "demo-thanh-hon",
      kind: "thanh-hon",
      title: "Lễ Thành Hôn",
      startsAt: "2027-10-17T11:00:00.000Z",
      dateLabel: "Chủ Nhật, 17.10.2027",
      timeLabel: "18:00",
      lunarLabel: "Ngày 18 tháng 9 năm Đinh Mùi",
      venue: "Trung tâm tiệc cưới Mẫu",
      address: "88 Đại lộ Hạnh Phúc, Phường Thử, TP. Demo",
      // Fictional address: the search link only exists to show the "Chỉ đường" button.
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=88+%C4%90%E1%BA%A1i+l%E1%BB%99+H%E1%BA%A1nh+Ph%C3%BAc",
      side: "nha-trai",
    },
  ],
  inviteMessage:
    "Trân trọng kính mời bạn đến chung vui cùng gia đình chúng mình trong ngày trọng đại. Sự hiện diện của bạn là niềm vui lớn nhất với chúng mình.",
  cover: album[6],
  album,
  gifts: [
    demoGift("demo-gift-nha-gai", "nha-gai", "970436", "0123456789", "NGUYEN MINH ANH"),
    demoGift("demo-gift-nha-trai", "nha-trai", "970422", "9876543210", "TRAN HOANG NAM"),
  ],
  sections: {
    cover: true,
    invitation: true,
    couple: true,
    events: true,
    countdown: true,
    album: true,
    gift: true,
    rsvp: true,
    thanks: true,
  },
  music: { src: getTrack("canon-in-d-usaf")!.src, title: getTrack("canon-in-d-usaf")!.title },
  weddingDate: "2027-10-17T11:00:00.000Z",
  showWatermark: true,
};

/**
 * Demo content with `qrSvg` filled in from each gift's `qrPayload` (server-side, like production).
 * `cache` dedupes within one render pass; the QR output is deterministic so it is also safe to reuse.
 */
export const getDemoContent = cache(async (): Promise<WeddingContent> => {
  const gifts = await Promise.all(
    demoContent.gifts.map(async (gift) => ({
      ...gift,
      qrSvg: await qrSvgDataUri(gift.qrPayload),
    })),
  );
  return { ...demoContent, gifts };
});

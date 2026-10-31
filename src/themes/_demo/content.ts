import { getTrack } from "@/data/music";
import "server-only"; // imports the QR renderer, which must never reach a client bundle
import { cache } from "react";
import { findBankByBin } from "@/data/banks";
import { qrSvgDataUri } from "@/lib/qr";
import { buildVietQrPayload } from "@/lib/vietqr";
import demoAlbum from "@/content/demo-album/images.json";
import type { GiftView, GuestContext, ImageView, TimelineItem, WeddingContent } from "../types";

// Shared sample data for /demo/[slug] (nhà gái) and /demo/[slug]/nha-trai, and theme QA.
// Each side has its own rite + reception; the theme shows only the side's events (_shared/side.ts).
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

interface DemoAlbumEntry {
  file: string;
  existing?: string;
  photographer: string;
  alt: string;
  width: number;
  height: number;
}

// Source of truth for the demo album: src/content/demo-album/images.json (filled by `fetch-demo-album`).
const album: ImageView[] = (demoAlbum as DemoAlbumEntry[]).map((entry) => ({
  src: entry.existing ?? `/images/wedding/demo-album/${entry.file}.jpg`,
  alt: entry.alt,
  width: entry.width,
  height: entry.height,
  credit: `${entry.photographer} · ${LICENSE}`,
}));

// Fictional venues, real-looking TP.HCM wards (no street numbers). Search link only: no coordinates.
const mapSearch = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
const BRIDE_ADDR = "Phường Đức Nhuận, TP. Hồ Chí Minh";
const GROOM_ADDR = "Phường Gia Định, TP. Hồ Chí Minh";
const BRIDE_RECEPTION_ADDR = "Đường Phan Xích Long, Phường Cầu Kiệu, TP. Hồ Chí Minh";
const GROOM_RECEPTION_ADDR = "Đường Nguyễn Văn Trỗi, Phường Phú Nhuận, TP. Hồ Chí Minh";

const RECEPTION_STEPS: Omit<TimelineItem, "id" | "eventId">[] = [
  {
    timeLabel: "17:30",
    title: "Đón khách & chụp ảnh",
    description: "Chúng mình đón bạn ở sảnh, chụp một tấm ảnh kỷ niệm trước khi vào tiệc.",
    icon: "camera",
  },
  {
    timeLabel: "18:00",
    title: "Lễ cưới trên sân khấu",
    description: "Hai đứa trao nhẫn và đọc lời hứa trước sự chứng kiến của hai họ.",
    icon: "rings",
  },
  {
    timeLabel: "18:30",
    title: "Khai tiệc",
    description: "Cả nhà nâng ly chúc mừng và bắt đầu bữa tiệc.",
    icon: "glasses",
  },
  {
    timeLabel: "19:30",
    title: "Cắt bánh cưới",
    description: "Khoảnh khắc ngọt ngào của cô dâu chú rể, mời bạn cùng chụp ảnh.",
    icon: "cake",
  },
  {
    timeLabel: "20:30",
    title: "Giao lưu & tiễn khách",
    description: "Chút nhạc, vài câu chuyện và lời cảm ơn trước khi chia tay.",
    icon: "music",
  },
];

export const demoContent: WeddingContent = {
  couple: {
    bride: {
      fullName: "Nguyễn Minh Anh",
      shortName: "Minh Anh",
      parents: "Ông Nguyễn Văn Hùng · Bà Lê Thị Thu",
      birthOrder: "Út nữ",
    },
    groom: {
      fullName: "Trần Hoàng Nam",
      shortName: "Hoàng Nam",
      parents: "Ông Trần Quốc Bảo · Bà Phạm Thị Lan",
      birthOrder: "Trưởng nam",
    },
  },
  families: {
    brideParents: "Ông Nguyễn Văn Hùng · Bà Lê Thị Thu",
    groomParents: "Ông Trần Quốc Bảo · Bà Phạm Thị Lan",
    brideAddr: BRIDE_ADDR,
    groomAddr: GROOM_ADDR,
  },
  events: [
    {
      id: "demo-vu-quy",
      kind: "vu-quy",
      title: "Lễ Vu Quy",
      startsAt: "2027-10-16T02:00:00.000Z",
      dateLabel: "Thứ Bảy, 16.10.2027",
      timeLabel: "09:00",
      venue: "Tư gia nhà gái",
      address: BRIDE_ADDR,
      mapUrl: mapSearch(BRIDE_ADDR),
      side: "nha-gai",
    },
    {
      id: "demo-tiec-nha-gai",
      kind: "tiec",
      title: "Tiệc Cưới Nhà Gái",
      startsAt: "2027-10-16T11:00:00.000Z",
      dateLabel: "Thứ Bảy, 16.10.2027",
      timeLabel: "18:00",
      arrivalTimeLabel: "17:30",
      banquetTimeLabel: "18:30",
      venue: "Nhà hàng tiệc cưới Ngọc Lan",
      address: BRIDE_RECEPTION_ADDR,
      mapUrl: mapSearch(`Nhà hàng tiệc cưới Ngọc Lan, ${BRIDE_RECEPTION_ADDR}`),
      side: "nha-gai",
    },
    {
      id: "demo-tan-hon",
      kind: "tan-hon",
      title: "Lễ Tân Hôn",
      startsAt: "2027-10-17T03:00:00.000Z",
      dateLabel: "Chủ Nhật, 17.10.2027",
      timeLabel: "10:00",
      venue: "Tư gia nhà trai",
      address: GROOM_ADDR,
      mapUrl: mapSearch(GROOM_ADDR),
      side: "nha-trai",
    },
    {
      id: "demo-tiec-nha-trai",
      kind: "tiec",
      title: "Tiệc Cưới Nhà Trai",
      startsAt: "2027-10-17T11:00:00.000Z",
      dateLabel: "Chủ Nhật, 17.10.2027",
      timeLabel: "18:00",
      arrivalTimeLabel: "17:30",
      banquetTimeLabel: "18:30",
      venue: "Trung tâm tiệc cưới Hồng Ngà",
      address: GROOM_RECEPTION_ADDR,
      mapUrl: mapSearch(`Trung tâm tiệc cưới Hồng Ngà, ${GROOM_RECEPTION_ADDR}`),
      side: "nha-trai",
    },
  ],
  // Same evening programme at each family's reception.
  timeline: ["demo-tiec-nha-gai", "demo-tiec-nha-trai"].flatMap((eventId) =>
    RECEPTION_STEPS.map((step, index) => ({ ...step, id: `${eventId}-tl-${index + 1}`, eventId })),
  ),
  inviteMessage:
    "Trân trọng kính mời bạn đến chung vui cùng gia đình chúng mình trong ngày trọng đại. Sự hiện diện của bạn là niềm vui lớn nhất với chúng mình.",
  cover: album.find((image) => image.src.endsWith("/hero.jpg")) ?? album[0],
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
    timeline: true,
    dressCode: true,
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

// A made-up guest for /demo/[slug]/khach-moi: fictional name, and the token is NOT a real secret.
export const demoGuest: GuestContext = {
  salutation: "Trân trọng kính mời Cô Chú Năm Hoà & Gia đình",
  invitedEventIds: ["demo-vu-quy", "demo-tiec-nha-gai"],
  maxAttendees: 2,
  token: "demo-khong-phai-token-that",
};

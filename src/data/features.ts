import { ClipboardList, ListChecks, MailOpen, UsersRound, type LucideIcon } from "lucide-react";

export interface FeatureEntry {
  path: string; // must exist in src/lib/seo/pages.ts
  icon: LucideIcon;
  title: string;
  text: string;
}

/** The four feature pages under /tinh-nang, in display order. */
export const featureCatalog: FeatureEntry[] = [
  {
    path: "/tinh-nang/loi-moi-rieng",
    icon: MailOpen,
    title: "Lời mời riêng từng khách",
    text: "Mỗi khách một link thiệp với đúng danh xưng và chỉ hiện những lễ được mời.",
  },
  {
    path: "/tinh-nang/rsvp",
    icon: ListChecks,
    title: "Xác nhận tham dự (RSVP)",
    text: "Khách bấm “Sẽ đến” ngay trên thiệp, chọn số người, không cần đăng nhập.",
  },
  {
    path: "/tinh-nang/quan-ly-khach-moi",
    icon: UsersRound,
    title: "Quản lý khách mời",
    text: "Chia nhà trai, nhà gái, nhóm bạn bè; biết ai đã gửi, ai chưa phản hồi.",
  },
  {
    path: "/tinh-nang/checklist-dam-cuoi",
    icon: ClipboardList,
    title: "Checklist đám cưới",
    text: "Việc cần làm xếp theo mốc trước ngày cưới, hạn tự tính, tick xong là nhẹ lòng.",
  },
];

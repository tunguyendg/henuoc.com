import {
  FeatureFaq,
  FeatureHero,
  FeatureJsonLd,
  FeatureSteps,
} from "@/components/feature-pages/feature-page";
import { GuestTableMock } from "@/components/feature-pages/mockups";
import { FinalCta } from "@/components/home/final-cta";
import { RelatedLinks } from "@/components/seo/related-links";
import { pageMetadata } from "@/lib/seo/metadata";

const PATH = "/tinh-nang/quan-ly-khach-moi";

export const metadata = pageMetadata(PATH);

const steps = [
  {
    title: "Thêm khách theo bên và nhóm",
    text: "Mỗi khách thuộc nhà trai hoặc nhà gái, xếp vào nhóm hai bạn tự đặt: họ hàng, bạn đại học, đồng nghiệp…",
  },
  {
    title: "Nhập nhanh từ file CSV",
    text: "Đã có danh sách sẵn? Tải file lên, xem trước từng dòng, dòng nào sai sẽ được chỉ ra để sửa.",
  },
  {
    title: "Đặt danh xưng và số người",
    text: "Mỗi lời mời có danh xưng riêng, số người tối đa và những lễ được mời. Sửa ngay trên bảng, không cần mở trang khác.",
  },
  {
    title: "Đánh dấu đã gửi",
    text: "Gửi xong thì tự đánh dấu, từng người hoặc cả loạt. Lọc nhanh ai chưa gửi, ai chưa phản hồi.",
  },
  {
    title: "Chốt số với nhà hàng",
    text: "Xem tổng người sẽ đến, số bàn ước tính (mặc định 10 người một bàn, chỉnh được) và xuất CSV gửi nhà hàng.",
  },
];

const faqs = [
  {
    q: "Hai vợ chồng cùng quản lý danh sách được không?",
    a: "Được. Hai bạn mời thêm một người cùng quản lý bằng email, cả hai cùng xem và sửa danh sách khách.",
  },
  {
    q: "Có cần nhập số điện thoại của khách không?",
    a: "Không bắt buộc. Có số điện thoại thì nút “Mở Zalo” mở thẳng cuộc trò chuyện với khách đó, không có thì hai bạn sao chép tin nhắn rồi tự gửi.",
  },
  {
    q: "Thông tin khách có bị lộ ra ngoài không?",
    a: "Danh sách khách chỉ hai bạn xem được trong trang quản lý. Tên khách không xuất hiện trên ảnh chia sẻ hay trong kết quả tìm kiếm.",
  },
];

export default function Page() {
  return (
    <>
      <FeatureHero
        path={PATH}
        eyebrow="Quản lý khách mời"
        lead="Bỏ file Excel chuyền tay giữa hai nhà. Khách nhà trai, nhà gái, ai đã nhận thiệp, ai sẽ đến đều nằm trong một bảng hai bạn cùng xem."
        highlights={[
          "Chia khách theo nhà trai, nhà gái và nhóm",
          "Lọc nhanh ai chưa gửi, ai chưa phản hồi",
          "Xuất CSV cho nhà hàng chỉ một lần bấm",
        ]}
        visual={<GuestTableMock />}
      />
      <FeatureSteps title="Từ danh sách khách đến số bàn" steps={steps} />
      <FeatureFaq items={faqs} />
      <FinalCta />
      <RelatedLinks path={PATH} />
      <FeatureJsonLd path={PATH} />
    </>
  );
}

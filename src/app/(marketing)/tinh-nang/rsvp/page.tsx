import {
  FeatureFaq,
  FeatureHero,
  FeatureJsonLd,
  FeatureSteps,
} from "@/components/feature-pages/feature-page";
import { RsvpPhoneMock } from "@/components/feature-pages/mockups";
import { FinalCta } from "@/components/home/final-cta";
import { RelatedLinks } from "@/components/seo/related-links";
import { pageMetadata } from "@/lib/seo/metadata";

const PATH = "/tinh-nang/rsvp";

export const metadata = pageMetadata(PATH);

const steps = [
  {
    title: "Khách mở link thiệp",
    text: "Từ Zalo hay tin nhắn, khách bấm link là xem được thiệp. Không cần tài khoản, không cần cài ứng dụng.",
  },
  {
    title: "Bấm “Sẽ đến” hoặc “Không đến được”",
    text: "Chọn số người đi cùng, trong giới hạn hai bạn đặt cho lời mời đó. Mời nhiều lễ thì khách chọn lễ mình dự.",
  },
  {
    title: "Gửi kèm lời nhắn",
    text: "Khách có thể viết vài dòng chúc mừng. Đổi ý thì mở lại link và sửa trước hạn xác nhận.",
  },
  {
    title: "Hai bạn thấy ngay trên bảng",
    text: "Tổng số người sẽ đến theo từng tiệc, lọc theo nhà trai, nhà gái, nhóm khách và xuất CSV khi cần.",
  },
];

const faqs = [
  {
    q: "Khách lớn tuổi có dùng được không?",
    a: "Được. Khách chỉ cần mở link và bấm nút, không phải đăng nhập hay nhớ mật khẩu gì cả.",
  },
  {
    q: "Khách sửa câu trả lời thì số liệu có bị đếm hai lần không?",
    a: "Không. Mỗi lời mời chỉ có một câu trả lời hiện hành, các lần sửa được lưu lại thành lịch sử để hai bạn xem.",
  },
  {
    q: "Người nhận thiệp chung (không có link riêng) có xác nhận được không?",
    a: "Có thể, nếu hai bạn bật. Khách nhập tên và số điện thoại, câu trả lời nằm chờ để hai bạn duyệt hoặc gộp với khách đã có.",
  },
];

export default function Page() {
  return (
    <>
      <FeatureHero
        path={PATH}
        eyebrow="RSVP"
        lead="Không còn cảnh nhắn từng người hỏi “có đi không”. Khách trả lời ngay trên tấm thiệp, hai bạn biết chính xác ai sẽ đến và đi bao nhiêu người."
        highlights={[
          "Không cần đăng nhập, không cần cài ứng dụng",
          "Giới hạn số người theo từng lời mời",
          "Khách sửa lại được, số liệu không bị đếm trùng",
        ]}
        visual={<RsvpPhoneMock />}
      />
      <FeatureSteps title="Khách xác nhận trong vài giây" steps={steps} />
      <FeatureFaq items={faqs} />
      <FinalCta />
      <RelatedLinks path={PATH} />
      <FeatureJsonLd path={PATH} />
    </>
  );
}

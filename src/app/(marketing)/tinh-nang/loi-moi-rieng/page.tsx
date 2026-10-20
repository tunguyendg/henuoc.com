import {
  FeatureFaq,
  FeatureHero,
  FeatureJsonLd,
  FeatureSteps,
} from "@/components/feature-pages/feature-page";
import { PersonalInviteMock } from "@/components/feature-pages/mockups";
import { FinalCta } from "@/components/home/final-cta";
import { RelatedLinks } from "@/components/seo/related-links";
import { pageMetadata } from "@/lib/seo/metadata";

const PATH = "/tinh-nang/loi-moi-rieng";

export const metadata = pageMetadata(PATH);

const steps = [
  {
    title: "Chọn danh xưng cho từng khách",
    text: "Ghép từ mẫu có sẵn như “Kính mời”, “Thân mời” với tên và “& Gia đình”, “& Người thương”, hoặc tự sửa tay cho đúng vai vế.",
  },
  {
    title: "Chọn lễ khách được mời",
    text: "Lễ vu quy, lễ thành hôn hay tiệc cưới: khách chỉ thấy những lễ của mình, không bị rối giờ giấc.",
  },
  {
    title: "Nhận link riêng và tin nhắn mẫu",
    text: "Mỗi lời mời có một link riêng. Sao chép tin nhắn mẫu đã kèm link, dán vào Zalo là gửi được.",
  },
  {
    title: "Khách mở thiệp thấy đúng tên mình",
    text: "Thiệp hiện danh xưng riêng và nút xác nhận tham dự gắn với đúng lời mời đó.",
  },
];

const faqs = [
  {
    q: "Hẹn Ước có tự gửi thiệp qua Zalo không?",
    a: "Không. Hai bạn sao chép tin nhắn rồi tự gửi qua Zalo như nhắn tin bình thường, sau đó đánh dấu “Đã gửi” để theo dõi.",
  },
  {
    q: "Lỡ gửi nhầm link cho người khác thì sao?",
    a: "Hai bạn thu hồi link đó và tạo link mới. Link cũ sẽ không mở được nữa.",
  },
  {
    q: "Khách khác có xem được lời mời của nhau không?",
    a: "Không. Mỗi link riêng là một mã khó đoán, và tên khách không bao giờ hiện trên ảnh xem trước khi chia sẻ link.",
  },
];

export default function Page() {
  return (
    <>
      <FeatureHero
        path={PATH}
        eyebrow="Lời mời riêng"
        lead="Ông bà, cô chú hay bạn thân đều nhận một tấm thiệp mang đúng tên và đúng cách xưng hô. Vẫn là một mẫu thiệp, nhưng mỗi người một lời mời."
        highlights={[
          "Mẫu xưng hô có sẵn, sửa tay được",
          "Chỉ hiện lễ vu quy hay thành hôn mà khách được mời",
          "Mỗi khách một link riêng, gửi qua Zalo",
        ]}
        visual={<PersonalInviteMock />}
      />
      <FeatureSteps title="Một mẫu thiệp, mỗi khách một lời mời" steps={steps} />
      <FeatureFaq items={faqs} />
      <FinalCta />
      <RelatedLinks path={PATH} />
      <FeatureJsonLd path={PATH} />
    </>
  );
}

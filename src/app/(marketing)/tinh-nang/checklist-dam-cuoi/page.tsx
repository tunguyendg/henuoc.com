import {
  FeatureFaq,
  FeatureHero,
  FeatureJsonLd,
  FeatureSteps,
} from "@/components/feature-pages/feature-page";
import { ChecklistMock } from "@/components/feature-pages/mockups";
import { FinalCta } from "@/components/home/final-cta";
import { RelatedLinks } from "@/components/seo/related-links";
import { pageMetadata } from "@/lib/seo/metadata";

const PATH = "/tinh-nang/checklist-dam-cuoi";

export const metadata = pageMetadata(PATH);

const steps = [
  {
    title: "Nhập ngày cưới",
    text: "Hạn của từng việc tự tính ngược từ ngày cưới của hai bạn, không phải ngồi đếm lịch.",
  },
  {
    title: "Nhận danh sách việc theo mốc",
    text: "Khoảng 40 việc mẫu xếp theo mốc 12, 6, 3, 1 tháng, 2 tuần, 1 tuần trước và ngày cưới.",
  },
  {
    title: "Thêm, ẩn cho vừa đám cưới của mình",
    text: "Việc nào nhà mình không làm thì ẩn đi, thiếu việc gì thì thêm vào.",
  },
  {
    title: "Tick xong là nhẹ lòng",
    text: "Đánh dấu việc đã xong. Trang tổng quan luôn nhắc “Việc tuần này” theo số ngày còn lại.",
  },
];

const faqs = [
  {
    q: "Đổi ngày cưới thì hạn các việc có đổi theo không?",
    a: "Có. Hạn được tính từ ngày cưới, nên khi hai bạn đổi ngày thì các mốc tự dịch theo.",
  },
  {
    q: "Checklist có gợi ý đồ cần mua không?",
    a: "Một số việc có kèm vài gợi ý sản phẩm trên Shopee. Đó là liên kết tiếp thị và luôn được ghi rõ nhãn để hai bạn biết.",
  },
];

export default function Page() {
  return (
    <>
      <FeatureHero
        path={PATH}
        eyebrow="Checklist cưới"
        lead="Từ ngày chốt ngày cưới đến hôm rước dâu có cả trăm việc lớn nhỏ. Hẹn Ước xếp chúng theo từng mốc để hai bạn biết tuần này cần lo gì."
        highlights={[
          "Việc cần làm xếp theo mốc trước ngày cưới",
          "Hạn mỗi việc tự tính từ ngày cưới",
          "Nhắc “Việc tuần này” ngay trên trang tổng quan",
        ]}
        visual={<ChecklistMock />}
      />
      <FeatureSteps title="Kế hoạch cưới tự xếp theo ngày của hai bạn" steps={steps} />
      <FeatureFaq items={faqs} />
      <FinalCta />
      <RelatedLinks path={PATH} />
      <FeatureJsonLd path={PATH} />
    </>
  );
}

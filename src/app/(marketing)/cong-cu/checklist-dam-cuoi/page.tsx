import { Lock } from "lucide-react";
import { FeatureJsonLd } from "@/components/feature-pages/feature-page";
import { RelatedLinks } from "@/components/seo/related-links";
import { ChecklistControls } from "@/components/tools/checklist-interactive";
import { ChecklistList } from "@/components/tools/checklist-list";
import { ToolCta } from "@/components/tools/tool-cta";
import { ToolHero } from "@/components/tools/tool-hero";
import { Container } from "@/components/ui/container";
import { checklistItems, checklistPhases } from "@/data/checklist";
import { pageMetadata } from "@/lib/seo/metadata";

const PATH = "/cong-cu/checklist-dam-cuoi";

export const metadata = pageMetadata(PATH);

export default function Page() {
  return (
    <>
      <section className="pt-8 pb-10 md:pt-10 print:p-0">
        <Container width="prose">
          <ToolHero path={PATH} eyebrow="Công cụ miễn phí">
            <p>
              {checklistItems.length} việc cần lo trước đám cưới, xếp theo {checklistPhases.length}{" "}
              mốc từ 12 tháng trước đến ngày cưới. Chọn ngày cưới là mỗi việc có hạn cụ thể, tick
              việc nào xong thì gạch việc đó.
            </p>
            <p className="mt-3 flex items-center gap-2 text-base text-ink">
              <Lock aria-hidden className="size-4 shrink-0 text-rose-700" />
              Lưu trên máy này, không cần đăng nhập.
            </p>
          </ToolHero>
          <div className="mt-8 print:mt-4">
            <ChecklistControls />
          </div>
        </Container>
      </section>

      <section aria-labelledby="danh-sach-viec" className="pb-16 md:pb-20 print:pb-0">
        <Container width="prose">
          <h2
            id="danh-sach-viec"
            className="font-display text-2xl font-extrabold tracking-[-0.03em] text-ink md:text-3xl print:hidden"
          >
            Danh sách việc theo từng mốc
          </h2>
          <p className="mt-2 mb-8 text-muted print:hidden">
            Mốc thời gian chỉ là gợi ý. Mỗi nhà một phong tục, việc nào không làm thì cứ bỏ qua.
          </p>
          <ChecklistList />
        </Container>
      </section>

      <ToolCta
        title="Lo xong checklist, đến lượt thiệp mời"
        text="Tạo thiệp cưới online, gửi đúng tên từng khách qua Zalo và nhận xác nhận tham dự ngay trên điện thoại."
      />
      <div className="print:hidden">
        <RelatedLinks path={PATH} />
      </div>
      <FeatureJsonLd path={PATH} />
    </>
  );
}

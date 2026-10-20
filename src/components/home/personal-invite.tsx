import { Container } from "@/components/ui/container";
import { MiniInvitation } from "./mini-invitation";
import { PhoneFrame } from "./phone-frame";
import { FeatureList, SectionHeading } from "./section-heading";

export function PersonalInvite() {
  return (
    <section id="tinh-nang" className="scroll-mt-20 overflow-hidden bg-surface py-20 md:py-28">
      <Container className="grid items-center gap-14 md:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Lời mời riêng" title="Mỗi khách một tấm thiệp mang đúng tên">
            Không còn một tấm thiệp chung cho tất cả. Ông bà, cô chú hay bạn thân đều nhận lời mời
            với đúng danh xưng và đúng lễ mình được mời.
          </SectionHeading>
          <FeatureList
            items={[
              "Mẫu xưng hô có sẵn: Kính mời, Thân mời, & Gia đình…",
              "Mỗi khách một link riêng, không ai thấy thông tin của người khác",
              "Chỉ hiện lễ vu quy hay thành hôn mà khách được mời",
            ]}
          />
        </div>

        <div className="flex justify-center gap-4 sm:gap-6">
          <PhoneFrame className="w-[148px] rotate-[-4deg] border-8 sm:w-[220px]">
            <MiniInvitation style="songhy" salutation="Trân trọng kính mời Ông Bà Nội & Gia đình" />
          </PhoneFrame>
          <PhoneFrame className="mt-10 w-[148px] rotate-[4deg] border-8 sm:w-[220px]">
            <MiniInvitation style="songhy" salutation="Thân mời bạn Lan & Người thương" />
          </PhoneFrame>
        </div>
      </Container>
    </section>
  );
}

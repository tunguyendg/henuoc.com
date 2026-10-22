import { FeatureJsonLd } from "@/components/feature-pages/feature-page";
import { RelatedLinks } from "@/components/seo/related-links";
import { InvitationBuilder } from "@/components/tools/invitation-builder";
import { ToolCta } from "@/components/tools/tool-cta";
import { ToolHero } from "@/components/tools/tool-hero";
import { Container } from "@/components/ui/container";
import { invitationStyles, renderInvitation } from "@/data/invitation-templates";
import { pageMetadata } from "@/lib/seo/metadata";

const PATH = "/cong-cu/mau-loi-moi-dam-cuoi";

export const metadata = pageMetadata(PATH);

export default function Page() {
  return (
    <>
      <section className="pt-8 pb-16 md:pt-10 md:pb-20">
        <Container>
          <ToolHero path={PATH} eyebrow="Công cụ miễn phí">
            <p>
              Chọn kiểu lời mời hợp với người nhận, điền tên khách, ngày giờ và địa điểm, rồi bấm
              sao chép để dán vào thiệp hoặc tin nhắn. Không cần đăng nhập, không lưu lại gì.
            </p>
          </ToolHero>
          <div className="mt-10">
            <InvitationBuilder />
          </div>
        </Container>
      </section>

      <section aria-labelledby="tat-ca-mau" className="bg-surface py-16 md:py-20">
        <Container width="prose">
          <h2
            id="tat-ca-mau"
            className="font-display text-2xl font-extrabold tracking-[-0.03em] text-ink md:text-3xl"
          >
            Tất cả mẫu lời mời đám cưới
          </h2>
          <p className="mt-3 text-muted">
            Phần trong ngoặc vuông là chỗ thay bằng thông tin của hai bạn. Với ông bà, cô chú nên
            dùng lời trang trọng; bạn bè thân thì cứ tự nhiên như cách hai bạn vẫn nói chuyện.
          </p>
          <div className="mt-10 space-y-12">
            {invitationStyles.map((style) => (
              <div key={style.id}>
                <h3 className="text-xl font-bold text-ink">{style.label}</h3>
                <p className="mt-1 text-muted">{style.description}</p>
                <ol className="mt-5 space-y-4">
                  {style.templates.map((t, i) => (
                    <li
                      key={t.id}
                      className="rounded-(--radius-card) border border-border bg-canvas p-5"
                    >
                      <p className="text-xs font-bold tracking-[0.16em] text-rose-700 uppercase">
                        Mẫu {i + 1}
                      </p>
                      <blockquote className="mt-2 text-ink">
                        {renderInvitation(t.text, {})}
                      </blockquote>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <ToolCta
        title="Gửi lời mời đúng tên từng khách"
        text="Với thiệp cưới online, mỗi khách nhận một link riêng có sẵn lời mời và tên của họ. Hai bạn chỉ việc gửi qua Zalo."
      />
      <RelatedLinks path={PATH} />
      <FeatureJsonLd path={PATH} />
    </>
  );
}

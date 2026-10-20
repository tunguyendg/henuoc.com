import { Container } from "@/components/ui/container";
import { Photo } from "./photo";

/** Dải ảnh cưới + 1 câu cảm xúc. Nằm trong khung bo góc như các section khác, phủ tông hồng để không lạc màu. */
export function PhotoBand() {
  return (
    <section className="py-10 md:py-14">
      <Container>
        <div className="relative isolate overflow-hidden rounded-[2rem]">
          <Photo
            src="/images/wedding/band.jpg"
            alt="Cô dâu chú rể bên hồ trong ngày cưới"
            sizes="(min-width: 1152px) 1088px, 100vw"
            position="50% 80%"
            className="h-[300px] md:h-[420px]"
          />
          {/* Phủ hồng ấm: kéo màu xanh của ảnh về tông brand */}
          <div aria-hidden className="absolute inset-0 bg-rose-700/25 mix-blend-multiply" />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent"
          />
          <p className="absolute inset-x-0 bottom-0 max-w-2xl p-6 font-display text-2xl leading-tight font-extrabold tracking-[-0.03em] text-white md:p-10 md:text-4xl">
            Ngày vui của hai bạn, gói trọn trong một đường link.
          </p>
        </div>
      </Container>
    </section>
  );
}

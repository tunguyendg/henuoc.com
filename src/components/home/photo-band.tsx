import { Photo } from "./photo";

/** Dải ảnh cưới tràn màn hình + 1 câu cảm xúc — tạo nhịp "nhìn là biết đám cưới". */
export function PhotoBand() {
  return (
    <section className="relative">
      <Photo
        src="/images/wedding/band.jpg"
        alt="Cô dâu chú rể nắm tay nhau trong ngày cưới"
        sizes="100vw"
        className="h-[52vh] min-h-[340px] md:h-[64vh]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-5 pb-10 md:px-8 md:pb-14">
        <p className="max-w-2xl font-display text-3xl leading-tight font-extrabold tracking-[-0.03em] text-white md:text-5xl">
          Ngày vui của hai bạn, gói trọn trong một đường link.
        </p>
      </div>
    </section>
  );
}

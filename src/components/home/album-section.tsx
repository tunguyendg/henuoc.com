import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { Photo } from "./photo";
import { SectionHeading } from "./section-heading";

// Lưới ảnh kiểu album: ô to – ô nhỏ xen kẽ, khít không hở (desktop 4 cột, mobile 2 cột).
const photos = [
  { src: "/images/wedding/album-1.jpg", span: "col-span-2 row-span-2" },
  { src: "/images/wedding/album-2.jpg", span: "row-span-2" },
  { src: "/images/wedding/album-3.jpg", span: "" },
  { src: "/images/wedding/album-4.jpg", span: "" },
  { src: "/images/wedding/album-5.jpg", span: "col-span-2" },
  { src: "/images/wedding/album-6.jpg", span: "col-span-2" },
];

export function AlbumSection() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <SectionHeading eyebrow="Album ảnh cưới" title="Ảnh cưới đẹp nhất, ngay trong tấm thiệp">
          Tải ảnh lên một lần, thiệp tự xếp thành album gọn gàng. Khách xem trên điện thoại mượt mà,
          không cần tải về.
        </SectionHeading>

        <ul className="mt-12 grid auto-rows-[140px] grid-cols-2 gap-3 md:auto-rows-[190px] md:grid-cols-4 md:gap-4">
          {photos.map((p, i) => (
            <li key={p.src} className={cn(p.span)}>
              <Photo
                src={p.src}
                alt={`Ảnh cưới minh hoạ ${i + 1}`}
                sizes="(min-width: 768px) 25vw, 50vw"
                className="h-full rounded-(--radius-card)"
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

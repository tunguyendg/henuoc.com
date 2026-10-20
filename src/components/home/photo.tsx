import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Ảnh cưới lấp đầy khung (object-cover). Khung quyết định tỉ lệ → ảnh gốc cao/thấp khác nhau
 * vẫn đều nhau, không làm nhảy layout (CLS).
 * `sizes`: cho trình duyệt biết ảnh rộng bao nhiêu trên màn hình — bắt buộc khi dùng `fill`.
 */
export function Photo({
  src,
  alt,
  sizes,
  className,
  priority,
  position = "center",
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  position?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-rose-100", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        style={{ objectPosition: position }}
      />
    </div>
  );
}

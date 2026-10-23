import Image from "next/image";
import { articleImageFile, articleImageSrc, type ArticleImageData } from "@/lib/article-images";
import { cn } from "@/lib/utils";

export function ArticleImage({
  image,
  card = false,
  className,
}: {
  image: ArticleImageData;
  card?: boolean;
  className?: string;
}) {
  return (
    <figure className={cn("my-8", className)}>
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-canvas">
        <Image
          src={articleImageSrc(image)}
          alt={image.alt}
          fill
          sizes={
            card
              ? "(max-width: 767px) calc(100vw - 88px), (max-width: 1152px) calc(50vw - 106px), 470px"
              : "(max-width: 767px) calc(100vw - 40px), 700px"
          }
          className="object-cover"
        />
      </div>
      <figcaption className="mt-2 text-sm leading-relaxed text-muted">
        {image.alt}
        {" · Ảnh: "}
        <a
          className="relative z-10 underline underline-offset-2"
          href={image.photographerUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {image.photographer}
        </a>
        {" / "}
        <a
          className="relative z-10 underline underline-offset-2"
          href={image.unsplashUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Unsplash
        </a>
      </figcaption>
    </figure>
  );
}

/** Bind the slug's manifest entries so MDX only needs <ArticleImage file="..." />. */
export function createArticleImage(images: ArticleImageData[]) {
  return function InlineArticleImage({ file }: { file: string }) {
    const image = images.find((entry) => entry.file === articleImageFile(entry.slug, file));
    if (!image)
      throw new Error(`ArticleImage: không tìm thấy ảnh "${file}" trong manifest của bài.`);
    return <ArticleImage image={image} />;
  };
}

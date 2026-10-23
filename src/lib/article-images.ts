import { z } from "zod";
import manifest from "@/content/cam-nang/images.json";

const segment = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export function articleImageFile(slug: string, file: string) {
  const prefix = `cam-nang/${slug}/`;
  const filename = file.startsWith(prefix) ? file.slice(prefix.length) : file;
  return segment.parse(filename.endsWith(".webp") ? filename.slice(0, -5) : filename);
}
const unsplashUrl = z.url().refine((value) => {
  const url = new URL(value);
  return (
    url.protocol === "https:" && url.hostname === "unsplash.com" && !url.username && !url.password
  );
});
const imageSchema = z.object({
  slug: segment,
  file: z.string().min(1),
  cdnPath: z.string().regex(/^photo-[a-zA-Z0-9-]+$/),
  photographer: z.string().trim().min(1),
  photographerUrl: unsplashUrl,
  unsplashUrl,
  alt: z.string().trim().min(1),
});

export type ArticleImageData = z.infer<typeof imageSchema>;

export function parseArticleImages(value: unknown): ArticleImageData[] {
  const images = z
    .array(imageSchema)
    .parse(value)
    .map((image) => ({
      ...image,
      file: articleImageFile(image.slug, image.file),
    }));
  const keys = images.map((image) => `${image.slug}/${image.file}`);
  if (new Set(keys).size !== keys.length) throw new Error("images.json: trùng slug/file.");
  return images;
}

// Static import bundles the manifest at build time; a runtime `await readFile()` would count as
// uncached data under Cache Components and block the article pages from prerendering.
const articleImages = parseArticleImages(manifest);

export function getArticleImages(): ArticleImageData[] {
  return articleImages;
}

export function articleImageSrc(image: ArticleImageData) {
  return `/images/cam-nang/${image.slug}/${image.file}.webp`;
}

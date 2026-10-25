interface BaseImage {
  slug: string;
  file: string;
  alt: string;
  role?: "cover" | "inline";
}
interface UnsplashImage extends BaseImage {
  source?: "unsplash";
  cdnPath: string;
  photographer: string;
  photographerUrl: string;
  unsplashUrl: string;
}
interface OwnImage extends BaseImage {
  source: "own";
  role: "cover" | "inline";
  caption: string;
}
export type ManifestImage = UnsplashImage | OwnImage;

export function parseImageManifest(value: unknown): ManifestImage[];
export function fetchArticleImages(options?: {
  manifestPath?: string;
  outputDir?: string;
  fetchImpl?: typeof fetch;
  report?: (message: string) => void;
}): Promise<void>;

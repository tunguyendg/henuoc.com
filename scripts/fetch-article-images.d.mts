export interface ManifestImage {
  slug: string;
  file: string;
  cdnPath: string;
  photographer: string;
  photographerUrl: string;
  unsplashUrl: string;
  alt: string;
}

export function parseImageManifest(value: unknown): ManifestImage[];
export function fetchArticleImages(options?: {
  manifestPath?: string;
  outputDir?: string;
  fetchImpl?: typeof fetch;
  report?: (message: string) => void;
}): Promise<void>;

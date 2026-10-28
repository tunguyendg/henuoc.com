export interface DemoAlbumItem {
  file: string;
  existing?: string;
  unsplashId: string;
  photographer: string;
  photographerUrl: string;
  unsplashUrl: string;
  alt: string;
  width: number;
  height: number;
}

export function parseDemoAlbumManifest(value: unknown): DemoAlbumItem[];
export function fetchDemoAlbum(options?: {
  manifestPath?: string;
  outputDir?: string;
  creditsPath?: string;
  fetchImpl?: typeof fetch;
  report?: (message: string) => void;
}): Promise<void>;

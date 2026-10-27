export interface OrnamentArtist {
  name: string;
  role: string;
}
export interface OrnamentItem {
  id: string;
  accessionNumber: string;
  file: string;
  palette: "do-do" | "hong";
  title: string;
  date: string;
  artists: OrnamentArtist[];
  license: "CC0";
  imageUrl: string;
  museumUrl: string;
  width: number;
  height: number;
}
export interface ConvertArgs {
  input: string;
  output: string;
  width: number;
  height: number;
}

export function parseOrnamentManifest(value: unknown): OrnamentItem[];
export function resizeArgs(width: number, height: number): string[];
export function fetchOrnaments(options?: {
  manifestPath?: string;
  outputDir?: string;
  fetchImpl?: typeof fetch;
  convert?: (args: ConvertArgs) => Promise<void>;
  report?: (message: string) => void;
}): Promise<void>;

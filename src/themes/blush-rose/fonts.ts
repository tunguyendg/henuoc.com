import { Great_Vibes, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";

// Loaded only by this theme (not the root layout) → other themes never pay for these files.
// Variable names differ from the app's own --font-playfair so the two never collide.
const title = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-br-title",
});

// Self-hosted: next/font/google fails on a clean build for this family (it receives /l/font? URLs).
// Google's files are variable, so one file per subset serves both weights. next/font/local cannot set
// unicode-range: the browser finds each glyph by trying the faces in turn.
const body = localFont({
  src: [
    {
      path: "../../assets/fonts/cormorant-garamond/cormorant-garamond-vietnamese.woff2",
      weight: "500 600",
      style: "normal",
    },
    {
      path: "../../assets/fonts/cormorant-garamond/cormorant-garamond-latin-ext.woff2",
      weight: "500 600",
      style: "normal",
    },
    {
      path: "../../assets/fonts/cormorant-garamond/cormorant-garamond-latin.woff2",
      weight: "500 600",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-br-body",
  adjustFontFallback: "Times New Roman",
});

const script = Great_Vibes({
  subsets: ["latin", "vietnamese"],
  weight: "400",
  display: "swap",
  variable: "--font-br-script",
});

/** Class names that define the three CSS variables; put them on the theme wrapper. */
export const fontVariables = cn(title.variable, body.variable, script.variable);

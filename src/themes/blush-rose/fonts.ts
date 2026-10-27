import { Cormorant_Garamond, Great_Vibes, Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";

// Loaded only by this theme (not the root layout) → other themes never pay for these files.
// Variable names differ from the app's own --font-playfair so the two never collide.
const title = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-br-title",
});

const body = Cormorant_Garamond({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600"],
  display: "swap",
  variable: "--font-br-body",
});

const script = Great_Vibes({
  subsets: ["latin", "vietnamese"],
  weight: "400",
  display: "swap",
  variable: "--font-br-script",
});

/** Class names that define the three CSS variables; put them on the theme wrapper. */
export const fontVariables = cn(title.variable, body.variable, script.variable);

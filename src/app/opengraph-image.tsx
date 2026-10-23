import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Local TTFs include Latin and Vietnamese glyphs; OG rendering needs no network.
const regular = await readFile(join(process.cwd(), "src/assets/fonts/be-vietnam-pro-regular.ttf"));
const extraBold = await readFile(
  join(process.cwd(), "src/assets/fonts/be-vietnam-pro-extra-bold.ttf"),
);

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#FFF8F9",
        color: "#2B1B30",
        fontFamily: "Be Vietnam Pro",
        padding: "60px 80px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <svg width="128" height="128" viewBox="0 0 64 64" fill="none">
          <rect width="64" height="64" rx="14" fill="#E8436A" />
          <g transform="translate(32 32) scale(0.88) translate(-32 -33)">
            <circle cx="32" cy="41" r="14.5" stroke="#FFFFFF" strokeWidth="5.5" />
            <path
              d="M32 30 C21 23 19 17 21.8 13 C24.6 9.2 29.8 10.2 32 14.4 C34.2 10.2 39.4 9.2 42.2 13 C45 17 43 23 32 30Z"
              fill="#F6C76B"
            />
          </g>
        </svg>
        <div style={{ display: "flex", fontSize: 96, fontWeight: 800, letterSpacing: "-0.035em" }}>
          {site.name}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 42,
          maxWidth: 920,
          fontSize: 38,
          fontWeight: 400,
          lineHeight: 1.5,
          textAlign: "center",
        }}
      >
        {site.tagline}
      </div>
      <div style={{ display: "flex", marginTop: 36, fontSize: 24, color: "#6E5F72" }}>
        {site.domain}
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Be Vietnam Pro", data: regular, weight: 400, style: "normal" },
        { name: "Be Vietnam Pro", data: extraBold, weight: 800, style: "normal" },
      ],
    },
  );
}

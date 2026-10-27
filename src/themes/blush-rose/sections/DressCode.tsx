import type { DressCode } from "../../_shared/dress-code";
import { cn } from "@/lib/utils";
import { SectionHeading } from "../ornaments";
import { s } from "../styles";

/** Server Component. Colour is never the only signal: each dot also prints its hex code. */
export function DressCodeDots({ colors }: { colors: DressCode }) {
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <SectionHeading>Gợi ý trang phục</SectionHeading>
      <p>Gợi ý màu trang phục: {colors.map((c) => c.toUpperCase()).join(", ")}</p>
      <ul role="list" className="flex flex-wrap justify-center gap-2">
        {colors.map((color) => (
          <li key={color} className="flex w-14 flex-col items-center gap-1.5">
            <span
              aria-hidden="true"
              className="size-10 rounded-full border border-(--br-wine)/35 shadow-sm"
              style={{ backgroundColor: color }}
            />
            <span aria-hidden="true" className={cn(s.title, "text-xs tracking-wide")}>
              {color.toUpperCase()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

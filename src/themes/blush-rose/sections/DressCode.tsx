import type { DressCode } from "../../_shared/dress-code";
import { colorName } from "../color-name";
import { SectionHeading } from "../ornaments";

/** Server Component. Dots only: each one is an image with a Vietnamese colour name, no hex text. */
export function DressCodeDots({ colors }: { colors: DressCode }) {
  const names = colors.map(colorName);
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <SectionHeading>Dress code</SectionHeading>
      <p>Trang phục dự tiệc</p>
      <ul
        role="list"
        aria-label={`Gợi ý màu trang phục: ${names.join(", ")}`}
        className="flex flex-wrap justify-center gap-3"
      >
        {colors.map((color, index) => (
          <li key={`${color}-${index}`}>
            <span
              role="img"
              aria-label={names[index]}
              className="block size-11 rounded-full border border-(--br-wine)/35 shadow-sm"
              style={{ backgroundColor: color }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

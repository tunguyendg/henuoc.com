import { FlowerSprig } from "../ornaments";
import { s } from "../styles";

/** Hand-drawn red envelope (wine body, thin gold border, folding flap). Gold text sits on wine. */
export function LiXiArt() {
  return (
    <svg
      viewBox="0 0 120 160"
      aria-hidden="true"
      focusable="false"
      // Inline size beats the shared button's `[&_svg]:size-5`.
      style={{ width: 120, height: 160 }}
      className="drop-shadow-md"
    >
      <rect x="6" y="6" width="108" height="148" rx="9" className="fill-(--br-wine)" />
      <rect
        x="12"
        y="12"
        width="96"
        height="136"
        rx="5"
        className="fill-none stroke-(color:--br-gold)"
        strokeWidth="0.8"
      />
      <g className={s.lixiFlap}>
        <path
          d="M6 15 Q6 6 15 6 H105 Q114 6 114 15 L60 72 Z"
          className="fill-(--br-wine) stroke-(color:--br-gold)"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
      </g>
      <circle cx="60" cy="72" r="6" className="fill-(--br-gold)" />
      <text
        x="60"
        y="124"
        textAnchor="middle"
        className={`${s.title} fill-(--br-gold)`}
        style={{ fontSize: 30, fontWeight: 600 }}
      >
        Hỷ
      </text>
      <path d="M38 136 H82" className="stroke-(color:--br-gold)" strokeWidth="0.8" />
    </svg>
  );
}

/** Small faded sprig beside the envelope; opacity lives on the <img> itself so multiply still works. */
export function LiXiFlower() {
  return <FlowerSprig corner="tr" inset={[-16, 36]} width={120} opacity={0.45} rotate={12} />;
}

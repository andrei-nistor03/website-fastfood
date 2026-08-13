/**
 * The slogan lockup — manual p.13 "SLOGANURI" and p.15 "BENZILE COLORATE".
 *
 * The recipe, verbatim from the manual: a solid band sits under a short
 * phrase as a firm underline. The band's width is proportional to the text
 * above it. Text may be tilted 0–6° off the horizontal, and the band copies
 * that tilt. Bands work on headlines and slogans, never on running text.
 *
 * Rebuilding this in markup rather than shipping the flattened artwork means
 * the set stays extensible — the manual says the set is growing but the rules
 * of construction stay the same for all of them.
 */

export type Tone = "red" | "yellow" | "black" | "white";

export type Band = {
  text: string;
  tone: Tone;
  /** Degrees. The manual caps this at 6. */
  tilt?: number;
};

const TONES: Record<Tone, string> = {
  red: "bg-u-red text-u-white",
  yellow: "bg-u-yellow text-u-black",
  black: "bg-u-ink text-u-white",
  white: "bg-u-white text-u-black",
};

const SIZES = {
  sm: "text-[clamp(1.05rem,2.6vw,1.62rem)]",
  md: "text-[clamp(1.7rem,5vw,2.624rem)]",
  lg: "text-[clamp(2.4rem,7.4vw,4.251rem)]",
  xl: "text-[clamp(3rem,11vw,6.886rem)]",
} as const;

export default function Lockup({
  lines,
  size = "md",
  as: Tag = "div",
  className = "",
  animate = true,
}: {
  lines: Band[];
  size?: keyof typeof SIZES;
  as?: "div" | "h1" | "h2" | "p";
  className?: string;
  animate?: boolean;
}) {
  return (
    <Tag
      data-lockup={animate ? "" : undefined}
      className={`flex flex-col items-start ${SIZES[size]} ${className}`}
    >
      {lines.map((line, i) => (
        <span
          key={i}
          data-band={animate ? "" : undefined}
          className={`u-band ${TONES[line.tone]} ${i > 0 ? "-mt-[0.05em]" : ""} ${
            animate ? "u-hidden" : ""
          }`}
          style={{ transform: `rotate(${line.tilt ?? 0}deg)` }}
        >
          {line.text}
        </span>
      ))}
    </Tag>
  );
}

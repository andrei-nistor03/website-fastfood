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
  /** Overrides the band's text colour, independent of the tone's default. */
  textTone?: Tone;
  /** Adds a hard ink drop-shadow so the band doesn't blend into a same-tone background. */
  shadow?: boolean;
};

const BG_TONES: Record<Tone, string> = {
  red: "bg-u-red",
  yellow: "bg-u-yellow",
  black: "bg-u-ink",
  white: "bg-u-white",
};

// The default text colour paired with each background, per the manual.
const DEFAULT_TEXT_TONES: Record<Tone, Tone> = {
  red: "white",
  yellow: "black",
  black: "white",
  white: "black",
};

const TEXT_TONES: Record<Tone, string> = {
  red: "text-u-red",
  yellow: "text-u-yellow",
  black: "text-u-ink",
  white: "text-u-white",
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
  align = "items-start",
  animate = true,
}: {
  lines: Band[];
  size?: keyof typeof SIZES;
  as?: "div" | "h1" | "h2" | "p";
  className?: string;
  /** Cross-axis alignment utilities for the stacked bands, e.g. "items-center md:items-start". */
  align?: string;
  animate?: boolean;
}) {
  return (
    <Tag
      data-lockup={animate ? "" : undefined}
      className={`flex flex-col ${align} ${SIZES[size]} ${className}`}
    >
      {lines.map((line, i) => (
        <span
          key={i}
          data-band={animate ? "" : undefined}
          className={`u-band ${BG_TONES[line.tone]} ${
            TEXT_TONES[line.textTone ?? DEFAULT_TEXT_TONES[line.tone]]
          } ${line.shadow ? "drop-shadow-[0_30px_50px_rgba(0,0,0,0.55)]" : ""} ${
            i > 0 ? "-mt-[0.05em]" : ""
          } ${animate ? "u-hidden" : ""}`}
          style={{ transform: `rotate(${line.tilt ?? 0}deg)` }}
        >
          {line.text}
        </span>
      ))}
    </Tag>
  );
}

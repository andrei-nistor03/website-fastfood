import { ALLERGEN_NAMES } from "@/data/allergens";

/** One allergen code, as a small badge. Red = confirmed, yellow = possible —
 * hover/focus shows the allergen's name via the native title/tooltip. */
export function Code({ code, tone }: { code: number; tone: "certain" | "possible" }) {
  return (
    <span
      title={ALLERGEN_NAMES[code]}
      tabIndex={0}
      className={
        "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[0.75rem] font-bold leading-none " +
        (tone === "certain"
          ? "bg-u-red/10 text-u-red"
          : "bg-u-yellow/30 text-u-ink")
      }
    >
      {code}
    </span>
  );
}

export function Codes({
  codes,
  tone,
}: {
  codes: number[] | null;
  tone: "certain" | "possible";
}) {
  if (!codes || codes.length === 0) {
    return <span className="text-u-ink/35">–</span>;
  }
  return (
    <span className="flex flex-wrap gap-1">
      {codes.map((c) => (
        <Code key={c} code={c} tone={tone} />
      ))}
    </span>
  );
}

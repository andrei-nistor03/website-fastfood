import { ALLERGEN_NAMES, type AllergenRow } from "@/data/allergens";

/** One allergen code, as a small badge. Red = confirmed, yellow = possible —
 * hover/focus shows the allergen's name via the native title/tooltip. */
function Code({ code, tone }: { code: number; tone: "certain" | "possible" }) {
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

function Codes({
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

/** A product × allergens table, styled to match the site's legal pages.
 * Wrapped in its own scroll container so it never forces the page to
 * scroll horizontally on small screens. */
export default function AllergenTable({
  caption,
  rows,
}: {
  caption?: string;
  rows: AllergenRow[];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-u-ink/10">
      {/* table-fixed + a shared colgroup keeps the three columns the same
          width across every AllergenTable on the page, regardless of how
          long a given table's product names or codes happen to be — so
          the tables all line up when scanned top to bottom. */}
      <table className="w-full min-w-[420px] table-fixed border-collapse text-left text-[0.92rem]">
        <colgroup>
          <col className="w-[46%]" />
          <col className="w-[27%]" />
          <col className="w-[27%]" />
        </colgroup>
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead>
          <tr className="bg-u-ink text-u-white">
            <th className="u-eyebrow px-3 py-2.5">Produs</th>
            <th className="u-eyebrow px-3 py-2.5">Alergeni certi</th>
            <th className="u-eyebrow px-3 py-2.5">Alergeni posibili*</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.name}
              className={
                "border-t border-u-ink/10 align-top " +
                (i % 2 === 1 ? "bg-u-ink/[0.03]" : "")
              }
            >
              <td className="break-words px-3 py-2.5">
                <span className="font-bold">{row.name}</span>
                {row.desc ? (
                  <span className="block text-[0.82rem] text-u-ink/60">
                    {row.desc}
                  </span>
                ) : null}
              </td>
              <td className="px-3 py-2.5">
                <Codes codes={row.certain} tone="certain" />
              </td>
              <td className="px-3 py-2.5">
                <Codes codes={row.possible} tone="possible" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

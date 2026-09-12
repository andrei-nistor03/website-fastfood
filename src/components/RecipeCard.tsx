import { allergenNames } from "@/data/allergens";
import type { Product } from "@/data/allergen-recipes";
import { Codes } from "./AllergenBadges";

/** One collapsible product card: a mini "rețetă" table (component, gramaj,
 * ingredients) matching the operator's source document, plus a footer with
 * total gramaj and the allergen disclosures. Collapsed by default via the
 * native <details> element, so the page stays scannable despite the large
 * number of products. */
export default function RecipeCard({ product }: { product: Product }) {
  const {
    name,
    desc,
    lines,
    totalGramaj,
    certain,
    possible,
    noMajorAllergens,
    skipAllergenFooter,
    frozenNote,
    extraNote,
  } = product;

  // Sauces / sides / drinks: a single line that just repeats the product
  // name — render its ingredients as a plain paragraph instead of a table.
  const isSingleLine = lines.length === 1 && lines[0].label === name;

  return (
    <details className="group rounded-lg border border-u-ink/10 bg-u-white/60 open:bg-u-white">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 marker:content-none [&::-webkit-details-marker]:hidden">
        <span className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-bold text-u-ink">{name}</span>
          {desc ? <span className="text-[0.82rem] text-u-ink/55">{desc}</span> : null}
          <span className="text-[0.8rem] text-u-ink/45">{totalGramaj}</span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          {!skipAllergenFooter ? (
            <span className="hidden items-center gap-1 sm:flex">
              <Codes codes={certain} tone="certain" />
              <Codes codes={possible} tone="possible" />
            </span>
          ) : null}
          <svg
            className="h-4 w-4 shrink-0 text-u-ink/40 transition-transform duration-200 group-open:rotate-180"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </summary>

      <div className="border-t border-u-ink/10 px-4 py-3 text-[0.88rem]">
        {isSingleLine ? (
          <p className={lines[0].incomplete ? "italic text-u-red/70" : "text-u-ink/80"}>
            {lines[0].ingredients}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[460px] border-collapse text-left text-[0.86rem]">
              <thead>
                <tr className="text-u-ink/50">
                  <th className="u-eyebrow px-2 py-1.5 font-normal">Rețetă</th>
                  <th className="u-eyebrow px-2 py-1.5 font-normal">Gramaj</th>
                  <th className="u-eyebrow px-2 py-1.5 font-normal">Ingrediente</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line, i) => (
                  <tr key={i} className="border-t border-u-ink/10 align-top">
                    <td className="px-2 py-2 font-semibold text-u-ink">{line.label}</td>
                    <td className="whitespace-nowrap px-2 py-2 text-u-ink/70">{line.gramaj}</td>
                    <td
                      className={
                        "px-2 py-2 " + (line.incomplete ? "italic text-u-red/70" : "text-u-ink/80")
                      }
                    >
                      {line.ingredients}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-3 flex flex-col gap-1 text-[0.85rem]">
          <p>
            <span className="font-bold">Total gramaj produs: </span>
            {totalGramaj}
          </p>
          {!skipAllergenFooter && noMajorAllergens ? (
            <p className="text-u-ink/70">Nu conține alergeni din cei 14 alergeni majori.</p>
          ) : !skipAllergenFooter && certain && certain.length > 0 ? (
            <p>
              <span className="font-bold text-u-red">Conține alergenii: </span>
              {allergenNames(certain)}.
            </p>
          ) : null}
          {!skipAllergenFooter && possible && possible.length > 0 ? (
            <p className="text-u-ink/70">
              <span className="font-semibold">Poate conține urme de: </span>
              {allergenNames(possible)}.
            </p>
          ) : null}
          {frozenNote ? <p className="italic text-u-ink/55">{frozenNote}</p> : null}
          {extraNote ? <p className="text-u-ink/70">{extraNote}</p> : null}
        </div>
      </div>
    </details>
  );
}

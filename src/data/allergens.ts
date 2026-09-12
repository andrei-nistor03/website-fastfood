/**
 * The 14 major allergens defined by Regulation (EU) No 1169/2011, Annex II —
 * used as the legend for the allergen tables on /alergeni. Numbering matches
 * the regulation (and the operator's own allergen document) exactly, so the
 * codes shown next to each product can be looked up here.
 */
export const ALLERGEN_NAMES: Record<number, string> = {
  1: "Cereale cu gluten (grâu, secară, orz, ovăz, spelta)",
  2: "Crustacee",
  3: "Ouă",
  4: "Pește",
  5: "Arahide",
  6: "Soia",
  7: "Lapte (inclusiv lactoză)",
  8: "Fructe cu coajă lemnoasă",
  9: "Țelină",
  10: "Muștar",
  11: "Semințe de susan",
  12: "Dioxid de sulf și sulfiți",
  13: "Lupin",
  14: "Moluște",
};

/** Joins allergen codes into a human-readable, comma-separated list of names
 * (e.g. for the "Conține alergenii: …" / "Poate conține urme de: …" lines). */
export function allergenNames(codes: number[] | null | undefined): string {
  if (!codes || codes.length === 0) return "";
  return codes.map((c) => ALLERGEN_NAMES[c] ?? `#${c}`).join(", ");
}

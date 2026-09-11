/**
 * The 14 major allergens defined by Regulation (EU) No 1169/2011, Annex II —
 * used as the legend for the allergen tables on /alergeni. Numbering matches
 * the regulation (and the operator's own allergen document) exactly, so the
 * codes shown next to each menu item can be looked up here.
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

/** One product row in an allergen table (see AllergenTable.tsx). */
export type AllergenRow = {
  name: string;
  desc?: string;
  /** Confirmed allergens — real supplier label or known base recipe. `null` = none. */
  certain: number[] | null;
  /** Allergens that may appear depending on the supplier's exact recipe, not yet
   * confirmed on a real label (see Secțiunea 7). `null` = none. */
  possible: number[] | null;
};

export const crispyWingsAllergens: AllergenRow[] = [
  {
    name: "Crispy Strips",
    desc: "mild sau picant, orice cantitate",
    certain: [1, 3, 7],
    possible: [6],
  },
  {
    name: "Utopia Wings",
    desc: "orice cantitate",
    certain: [1, 3, 7],
    possible: [6],
  },
  {
    name: "Famous Wings",
    desc: "glazurate cu miere",
    certain: [1, 3, 7],
    possible: [6],
  },
];

export const burgeriAllergens: AllergenRow[] = [
  { name: "Clasic", certain: [1, 3, 7], possible: [6, 10] },
  { name: "Spicy", certain: [1, 3, 7], possible: [6, 10] },
  { name: "Honey Heat", certain: [1, 3, 7], possible: [6] },
  { name: "Honey Mustard", certain: [1, 3, 7, 10], possible: [6] },
  { name: "Southern", certain: [1, 3, 7], possible: [6, 10] },
  { name: "Sour-Cherry", certain: [1, 3, 7], possible: [6, 12] },
  { name: "Garlic Parmesan", certain: [1, 3, 7], possible: [6] },
  { name: "Cheesy", certain: [1, 3, 7], possible: [6] },
  { name: "Truffle", certain: [1, 3, 7], possible: [6] },
];

export const sosuriAllergens: AllergenRow[] = [
  { name: "Maioneză", certain: [3], possible: [10] },
  { name: "Maioneză Picantă", certain: [3], possible: [10] },
  { name: "Trufe", certain: null, possible: [6] },
  { name: "Cheddar", certain: [7], possible: null },
  { name: "Honey Mustard", certain: [3, 10], possible: null },
  { name: "Garlic Mayo", certain: [3, 7], possible: null },
  { name: "Utopia", certain: [3, 4, 7, 10], possible: null },
];

export const sidesAllergens: AllergenRow[] = [
  { name: "Cartofi Mari / Medii", desc: "fries", certain: null, possible: null },
  {
    name: "Upgrade Usturoi și Parmezan",
    certain: [7],
    possible: null,
  },
  { name: "Salată Coleslaw", certain: [3], possible: [10] },
];

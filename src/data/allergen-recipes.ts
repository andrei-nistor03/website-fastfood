/**
 * Full product / recipe / allergen data for the "Alergeni" page, transcribed
 * from the operator's official document "Informații despre ingrediente,
 * alergeni și gramaje produse" (UTOPIA BURGER S.R.L., valabil din
 * 17.10.2026). Allergen codes reference ALLERGEN_NAMES in ./allergens.ts.
 *
 * Every ingredient line comes directly off a real supplier label or the
 * restaurant's own recipe. The nutrition declarations are *estimated*
 * (calculated from component gramaje × supplier label values — see
 * `calculNutritional` at the bottom of this file).
 *
 * NOTE: this file is unrelated to ./menu.ts, which holds the live storefront
 * menu (prices, photos, tabs) shown elsewhere on the site.
 */

export type RecipeLine = {
  /** Component name, e.g. "Crispy strips (3 buc. x 70 g)" or "Vezi fișa …". */
  label: string;
  gramaj: string;
  ingredients: string;
  /** True when the ingredient text is not yet confirmed on the real supplier label. */
  incomplete?: boolean;
};

/** One row of the estimated nutrition declaration ("La 100 g" / "Per produs (…)"). */
export type NutritionRow = {
  label: string;
  energy: string;
  fat: string;
  saturated: string;
  carbs: string;
  sugars: string;
  protein: string;
  salt: string;
};

export type Product = {
  name: string;
  desc?: string;
  lines: RecipeLine[];
  totalGramaj: string;
  /** Confirmed allergens. `null` = none confirmed. */
  certain: number[] | null;
  /** Allergens that may appear as cross-contact traces. `null` = none listed. */
  possible: number[] | null;
  /** Set when the product has none of the 14 major allergens itself (only traces). */
  noMajorAllergens?: boolean;
  /** Hides the allergen summary entirely. */
  skipAllergenFooter?: boolean;
  frozenNote?: string;
  extraNote?: string;
  /** Estimated nutrition declaration (Legea 321/2023). */
  nutrition?: NutritionRow[];
  /** Short note shown under the nutrition table (portions, drinks excluded, …). */
  nutritionNote?: string;
};

export type ProductCategory = {
  title: string;
  intro?: string;
  products: Product[];
};

// ---------------------------------------------------------------------------
// Nutrition helpers
// ---------------------------------------------------------------------------

/** [kcal, kJ, grăsimi, din care saturate, glucide, din care zaharuri, proteine, sare] */
type NutritionValues = [string, string, string, string, string, string, string, string];

function nutritionRow(label: string, [kcal, kj, f, s, c, z, p, salt]: NutritionValues): NutritionRow {
  return {
    label,
    energy: `${kcal} kcal / ${kj} kJ`,
    fat: `${f} g`,
    saturated: `${s} g`,
    carbs: `${c} g`,
    sugars: `${z} g`,
    protein: `${p} g`,
    salt: `${salt} g`,
  };
}

/** "La 100 g" + "Per produs (<gramaj>)" rows, as in the source document. */
function nutr(perProdus: string, per100: NutritionValues, perProduct: NutritionValues): NutritionRow[] {
  return [nutritionRow("La 100 g", per100), nutritionRow(`Per produs (${perProdus})`, perProduct)];
}

const BAUTURA_EXCLUSA =
  "Băutura răcoritoare nu este inclusă în valorile de mai sus — vezi secțiunea Răcoritoare.";

// ---------------------------------------------------------------------------
// Reusable ingredient blocks (identical across many products)
// ---------------------------------------------------------------------------

const CRISPY_STRIPS_ING =
  "Piept de pui (origine: România), marinadă (amestec de condimente (sare, glucoză, proteină vegetală hidrolizată din sfeclă de zahăr, condimente, extracte de condimente), sare, potențiator de aromă: E621, stabilizator: E450), pesmet (făină de GRÂU, agenți de afânare: E500 și E450, LAPTE praf degresat, potențiator de aromă: E621, amestec de condimente (sare, făină de GRÂU, proteină vegetală hidrolizată din sfeclă de zahăr, condimente, extracte de condimente), PRAF DE OUĂ), ulei de floarea-soarelui high oleic rafinat (antispumant: E900).";

const WINGS_ING =
  "Aripioare de pui (origine: România), marinadă picantă (amestec de condimente (sare, glucoză, proteină vegetală hidrolizată din sfeclă de zahăr, condimente, extracte de condimente), sare, extract de ardei iute, ardei iute, potențiator de aromă: E621, stabilizator: E450), pesmet (făină de GRÂU, agenți de afânare: E500 și E450, LAPTE praf degresat, potențiator de aromă: E621, amestec de condimente (sare, făină de GRÂU, proteină vegetală hidrolizată din sfeclă de zahăr, condimente, extracte de condimente), PRAF DE OUĂ), ulei de floarea-soarelui high oleic rafinat (antispumant: E900).";

const CHIFLA_ING =
  "Făină albă de GRÂU, apă, zahăr, ulei rafinat de floarea-soarelui, topping glazură (proteină vegetală, dextroză, amidon), drojdie, sare iodată, aromă naturală, ameliorator (emulsifiant: E472e, antioxidant: E300), enzime, condiment: curcuma.";

const CHEDDAR_ING =
  "Brânză Cedar 57% (LAPTE), apă, brânzeturi (LAPTE), unt (LAPTE), LAPTE praf degresat, sare de topire: citrați de sodiu, sare, acidifiant: acid citric, coloranți: extract de ardei roșu și caroteni, proteine din LAPTE, agent antiaglomerant: lecitină.";

const CARTOFI_ING =
  "Cartofi (90%), ulei de floarea-soarelui (5%), acoperire (4,5%) (amidon modificat, făină de orez, dextrină, agent de îngroșare: gumă xantan), sare. Prăjiți în ulei de floarea-soarelui high oleic (antispumant: E900). Condiment: sare, boia de ardei dulce.";

const CASTRAVETI_ING =
  "Castraveți 53,6%, apă, oțet din alcool, zahăr, sare, mărar, semințe de MUȘTAR, ceapă, arome. Produs pasteurizat, fără conservanți.";

const MAIONEZA_INNER =
  "(ulei de floarea-soarelui, apă, zahăr, oțet alb, MUȘTAR (apă, oțet alb, boabe de MUȘTAR, zahăr, sare), amidonuri modificate, sare, acidifiant: acid lactic, PRAF DE OU integral, agent de îngroșare: gumă xantan, conservanți: sorbat de potasiu și benzoat de sodiu, colorant: caroteni, antioxidant)";
const MAIONEZA_BASE = `Maioneză ${MAIONEZA_INNER}`;

const MUSTAR_ING =
  "MUȘTAR (apă, oțet din alcool, semințe de MUȘTAR 19%, zahăr, sare, sirop de zahăr caramelizat, turmeric, semințe de coriandru, nucșoară, maghiran, arome, ienibahar, cuișoare, scorțișoară, piper negru, chimen, foi de dafin)";

const IAURT_ING =
  "iaurt grecesc (LAPTE de vacă pasteurizat, smântână din LAPTE, proteine din LAPTE, culturi lactice)";

const COLESLAW_ING = `Varză albă și morcovi, maioneză ${MAIONEZA_INNER}, zahăr, sare, ${MUSTAR_ING}, oțet, piper.`;

const CEAPA_ING =
  "Ceapă (poate conține SULFIȚI), grăsime de palmier, făină de GRÂU, amidon din GRÂU, sare.";

const PARMEZAN_ING =
  "Mix de brânzeturi tari rase: LAPTE, sare, cheag, conservant: lizozimă din OUĂ.";

// Sauces — the same recipes are used on burgers, in menus and as standalone sauces.
const SOS_MAIONEZA_ING = `${MAIONEZA_BASE}, apă.`;
const SOS_PICANT_ING = `${MAIONEZA_BASE}, sos de ardei iute (apă, zahăr, ardei iute 20%, usturoi, sare, pastă de tomate, amidon modificat, regulatori de aciditate: acid acetic și acid citric, conservant: sorbat de potasiu, aromatizant).`;
const SOS_HONEY_MUSTARD_ING = `${MAIONEZA_BASE}, miere, ${MUSTAR_ING}.`;
const SOS_GARLIC_ING = `${MAIONEZA_BASE}, ${IAURT_ING}, apă, usturoi granulat.`;
const SOS_TRUFE_ING = `${MAIONEZA_BASE}, cremă de ciuperci cu trufe (ciuperci champignon, ulei de măsline extravirgin, trufă neagră de vară, hribi, sare, pătrunjel, usturoi, piper negru, aromă), apă.`;
const SOS_SOUR_CHERRY_ING = `${MAIONEZA_BASE}, dulceață de vișine (vișine, zahăr, sirop de glucoză-fructoză, gelifiant: pectină, acidifiant: acid citric, conservant: E202), apă. Poate conține sâmburi sau fragmente de sâmburi.`;
const SOS_CHEDDAR_ING =
  "Sos de brânză topită cu cheddar (apă, brânză Cedar 39% (LAPTE), unt (LAPTE), amidon modificat, săruri de topire: citrați de sodiu și polifosfați, sare, oțet din vin, proteine din LAPTE, aromă (conține LAPTE), agent de îngroșare: gumă xantan, conservant: acid sorbic, coloranți: extract de ardei roșu și caroteni), apă.";
const SOS_UTOPIA_ING = `${MAIONEZA_BASE}, ${IAURT_ING}, ${MUSTAR_ING}, ketchup (roșii, oțet din alcool, zahăr, sare, condimente și extracte de ierburi aromatice (conține ȚELINĂ), condimente), sos barbecue (apă, sirop de glucoză-fructoză, pastă de tomate, oțet din vin alb, zahăr, amidon modificat, sare, sirop de zahăr caramelizat, arome, acidifianți: acid citric și acid lactic, pudră de ceapă, conservant: sorbat de potasiu, stabilizator: gumă xantan), zahăr, miere, oțet din mere, condimente (piper, usturoi granulat, sare, boia).`;

const BAUTURA_ING =
  "Pepsi, Pepsi Max, Pepsi Twist, Mirinda sau 7UP, doză de 330 ml, în ambalajul original al producătorului. Vezi secțiunea Răcoritoare.";

const VEZI_SOSURI = "Vezi secțiunea Sosuri (pag. finale).";

// Allergen code shorthands (see ALLERGEN_NAMES): 1 gluten · 3 ouă · 4 pește ·
// 6 soia · 7 lapte · 8 fructe cu coajă lemnoasă · 9 țelină · 10 muștar ·
// 11 susan · 12 sulfiți

const CRISPY_CERTAIN = [1, 3, 7, 10];
const CRISPY_POSSIBLE = [4, 6, 8, 9];

// ---------------------------------------------------------------------------
// 1. Crispy uri
// ---------------------------------------------------------------------------

const CRISPY_NUTRITION: Record<3 | 4 | 5 | 6, [NutritionValues, NutritionValues]> = {
  3: [
    ["235", "990", "13,5", "1,8", "13,6", "3,1", "15,0", "1,6"],
    ["640", "2675", "36,4", "4,9", "36,6", "8,3", "40,4", "4,3"],
  ],
  4: [
    ["230", "955", "12,2", "1,6", "13,6", "2,7", "15,7", "1,6"],
    ["775", "3250", "41,5", "5,5", "46,2", "9,0", "53,5", "5,5"],
  ],
  5: [
    ["250", "1050", "15,7", "2,2", "13,5", "3,8", "13,7", "1,6"],
    ["1255", "5245", "78,4", "10,8", "67,5", "18,9", "68,4", "8,0"],
  ],
  6: [
    ["245", "1020", "14,6", "2,0", "13,5", "3,4", "14,3", "1,6"],
    ["1390", "5820", "83,5", "11,4", "77,1", "19,7", "81,5", "9,2"],
  ],
};

function crispyProduct(n: 3 | 4 | 5 | 6): Product {
  const sosLine: RecipeLine =
    n <= 4
      ? { label: "Sos mic la alegere", gramaj: "60 g", ingredients: VEZI_SOSURI }
      : { label: "Sos mare la alegere", gramaj: "150 g", ingredients: VEZI_SOSURI };
  const stripsGramaj = n * 70;
  const total = `${stripsGramaj + parseInt(sosLine.gramaj, 10)} g`;
  return {
    name: `${n} Crispy Strips`,
    lines: [
      {
        label: `Crispy strips (${n} buc. x 70 g)`,
        gramaj: `${stripsGramaj} g`,
        ingredients: CRISPY_STRIPS_ING,
      },
      sosLine,
    ],
    totalGramaj: total,
    certain: CRISPY_CERTAIN,
    possible: CRISPY_POSSIBLE,
    nutrition: nutr(total, ...CRISPY_NUTRITION[n]),
  };
}

export const crispyCategory: ProductCategory = {
  title: "Crispy uri",
  products: [crispyProduct(3), crispyProduct(4), crispyProduct(5), crispyProduct(6)],
};

// ---------------------------------------------------------------------------
// 2. Wingsuri (Utopia Wings, picante)
// ---------------------------------------------------------------------------

const WINGS_NUTRITION: Record<3 | 5 | 8, [NutritionValues, NutritionValues]> = {
  3: [
    ["270", "1130", "19,4", "3,2", "13,7", "3,7", "10,3", "1,5"],
    ["565", "2370", "40,6", "6,8", "28,7", "7,7", "21,6", "3,2"],
  ],
  5: [
    ["255", "1070", "17,3", "3,0", "13,7", "2,8", "11,3", "1,5"],
    ["795", "3320", "53,6", "9,3", "42,6", "8,8", "35,2", "4,6"],
  ],
  8: [
    ["270", "1120", "19,1", "3,2", "13,7", "3,6", "10,4", "1,5"],
    ["1475", "6165", "104,9", "17,6", "75,2", "19,5", "57,4", "8,3"],
  ],
};

function wingsProduct(n: 3 | 5 | 8): Product {
  const sosLine: RecipeLine =
    n <= 5
      ? { label: "Sos mic la alegere", gramaj: "60 g", ingredients: VEZI_SOSURI }
      : { label: "Sos mare la alegere", gramaj: "150 g", ingredients: VEZI_SOSURI };
  const wingsGramaj = n * 50;
  const total = `${wingsGramaj + parseInt(sosLine.gramaj, 10)} g`;
  return {
    name: `${n} Wings`,
    lines: [
      {
        label: `Wings picante (${n} buc. x 50 g)`,
        gramaj: `${wingsGramaj} g`,
        ingredients: WINGS_ING,
      },
      sosLine,
    ],
    totalGramaj: total,
    certain: CRISPY_CERTAIN,
    possible: CRISPY_POSSIBLE,
    extraNote: "Aripioarele se prepară doar în varianta picantă.",
    nutrition: nutr(total, ...WINGS_NUTRITION[n]),
  };
}

export const wingsCategory: ProductCategory = {
  title: "Wingsuri",
  products: [wingsProduct(3), wingsProduct(5), wingsProduct(8)],
};

// ---------------------------------------------------------------------------
// 3. Famous Wings (glazurate cu miere)
// ---------------------------------------------------------------------------

const FAMOUS_WINGS_NUTRITION: Record<3 | 5 | 8, [NutritionValues, NutritionValues]> = {
  3: [
    ["235", "975", "12,1", "2,3", "18,1", "6,0", "12,8", "1,4"],
    ["375", "1560", "19,4", "3,7", "29,0", "9,7", "20,4", "2,2"],
  ],
  5: [
    ["230", "965", "12,4", "2,4", "16,5", "4,1", "13,1", "1,4"],
    ["600", "2510", "32,3", "6,1", "43,0", "10,7", "34,0", "3,7"],
  ],
  8: [
    ["230", "960", "12,6", "2,4", "15,6", "3,0", "13,3", "1,4"],
    ["940", "3935", "51,7", "9,8", "63,9", "12,3", "54,4", "5,9"],
  ],
};

function famousWingsProduct(n: 3 | 5 | 8): Product {
  const wingsGramaj = n * 50;
  const total = `${wingsGramaj + 10} g`;
  return {
    name: `${n} Famous Wings`,
    lines: [
      {
        label: `Wings picante (${n} buc. x 50 g)`,
        gramaj: `${wingsGramaj} g`,
        ingredients: WINGS_ING,
      },
      { label: "Glazură de miere", gramaj: "sub 20 g", ingredients: "Miere." },
    ],
    totalGramaj: total,
    certain: [1, 3, 7],
    possible: [6],
    extraNote: "Aripioarele se prepară doar în varianta picantă.",
    nutrition: nutr(total, ...FAMOUS_WINGS_NUTRITION[n]),
  };
}

export const famousWingsCategory: ProductCategory = {
  title: "Famous Wings",
  products: [famousWingsProduct(3), famousWingsProduct(5), famousWingsProduct(8)],
};

// ---------------------------------------------------------------------------
// 4. Burgers
// ---------------------------------------------------------------------------

const BURGER_FROZEN_NOTE = "Conține produs congelat: chiflă, decongelată înainte de servire.";
const BURGER_CERTAIN = [1, 3, 7, 10];
const BURGER_POSSIBLE = [6, 11];

const CHEDDAR_LINE: RecipeLine = {
  label: "Cheddar (2 felii x 12,3 g)",
  gramaj: "25 g",
  ingredients: CHEDDAR_ING,
};
const CASTRAVETI_LINE: RecipeLine = {
  label: "Castraveți murați",
  gramaj: "30 g",
  ingredients: CASTRAVETI_ING,
};
const CHIFLA_LINE: RecipeLine = { label: "Chiflă brioche", gramaj: "70 g", ingredients: CHIFLA_ING };
const CRISPY_2_LINE: RecipeLine = {
  label: "Crispy strips (2 buc. x 70 g)",
  gramaj: "140 g",
  ingredients: CRISPY_STRIPS_ING,
};
const CEAPA_LINE: RecipeLine = { label: "Ceapă crocantă", gramaj: "sub 20 g", ingredients: CEAPA_ING };
const ICEBERG_LINE: RecipeLine = {
  label: "Salată iceberg",
  gramaj: "sub 20 g",
  ingredients: "Salată iceberg proaspătă.",
};

export const burgersCategory: ProductCategory = {
  title: "Burgers",
  products: [
    {
      name: "Clasic Burger",
      lines: [
        CHIFLA_LINE,
        CRISPY_2_LINE,
        { label: "Sos maioneză", gramaj: "55 g", ingredients: SOS_MAIONEZA_ING },
        CASTRAVETI_LINE,
        CHEDDAR_LINE,
      ],
      totalGramaj: "320 g",
      certain: BURGER_CERTAIN,
      possible: BURGER_POSSIBLE,
      frozenNote: BURGER_FROZEN_NOTE,
      nutrition: nutr(
        "320 g",
        ["255", "1065", "14,5", "2,9", "18,7", "3,9", "11,7", "1,4"],
        ["815", "3410", "46,5", "9,3", "59,9", "12,5", "37,3", "4,6"],
      ),
    },
    {
      name: "Spicy Burger",
      lines: [
        CHIFLA_LINE,
        CRISPY_2_LINE,
        { label: "Maioneză picantă", gramaj: "55 g", ingredients: SOS_PICANT_ING },
        CASTRAVETI_LINE,
        CHEDDAR_LINE,
      ],
      totalGramaj: "320 g",
      certain: BURGER_CERTAIN,
      possible: BURGER_POSSIBLE,
      frozenNote: BURGER_FROZEN_NOTE,
      nutrition: nutr(
        "320 g",
        ["240", "1005", "12,4", "2,7", "19,7", "5,0", "11,7", "1,7"],
        ["770", "3220", "39,8", "8,6", "63,1", "16,0", "37,4", "5,4"],
      ),
    },
    {
      name: "Honey Heat Burger",
      lines: [
        CHIFLA_LINE,
        CRISPY_2_LINE,
        { label: "Sos maioneză", gramaj: "55 g", ingredients: SOS_MAIONEZA_ING },
        { label: "Glazură de miere (pe crispy)", gramaj: "sub 20 g", ingredients: "Miere." },
        ICEBERG_LINE,
        CHEDDAR_LINE,
      ],
      totalGramaj: "315 g",
      certain: BURGER_CERTAIN,
      possible: BURGER_POSSIBLE,
      frozenNote: BURGER_FROZEN_NOTE,
      nutrition: nutr(
        "315 g",
        ["270", "1120", "14,7", "2,9", "21,4", "6,3", "11,9", "1,3"],
        ["845", "3530", "46,5", "9,3", "67,4", "20,0", "37,3", "4,2"],
      ),
    },
    {
      name: "Honey Mustard Burger",
      lines: [
        CHIFLA_LINE,
        CRISPY_2_LINE,
        { label: "Sos honey mustard", gramaj: "55 g", ingredients: SOS_HONEY_MUSTARD_ING },
        CASTRAVETI_LINE,
        CHEDDAR_LINE,
      ],
      totalGramaj: "320 g",
      certain: BURGER_CERTAIN,
      possible: BURGER_POSSIBLE,
      frozenNote: BURGER_FROZEN_NOTE,
      nutrition: nutr(
        "320 g",
        ["250", "1040", "12,8", "2,7", "20,8", "6,1", "11,8", "1,4"],
        ["795", "3325", "40,8", "8,6", "66,4", "19,5", "37,6", "4,6"],
      ),
    },
    {
      name: "Southern Burger",
      lines: [
        CHIFLA_LINE,
        CRISPY_2_LINE,
        { label: "Sos maioneză", gramaj: "55 g", ingredients: SOS_MAIONEZA_ING },
        { label: "Salată coleslaw", gramaj: "40 g", ingredients: COLESLAW_ING },
        CASTRAVETI_LINE,
        CHEDDAR_LINE,
      ],
      totalGramaj: "360 g",
      certain: BURGER_CERTAIN,
      possible: BURGER_POSSIBLE,
      frozenNote: BURGER_FROZEN_NOTE,
      nutrition: nutr(
        "360 g",
        ["245", "1015", "14,2", "2,7", "17,7", "4,4", "10,5", "1,4"],
        ["875", "3660", "51,2", "9,9", "63,7", "15,7", "37,7", "5,0"],
      ),
    },
    {
      name: "Sour-Cherry Burger",
      lines: [
        CHIFLA_LINE,
        CRISPY_2_LINE,
        { label: "Sos sour-cherry", gramaj: "55 g", ingredients: SOS_SOUR_CHERRY_ING },
        CEAPA_LINE,
        CHEDDAR_LINE,
      ],
      totalGramaj: "300 g",
      certain: BURGER_CERTAIN,
      possible: [6, 11, 12],
      frozenNote: BURGER_FROZEN_NOTE,
      nutrition: nutr(
        "300 g",
        ["285", "1185", "15,2", "3,7", "23,2", "6,6", "12,6", "1,4"],
        ["850", "3555", "45,7", "11,0", "69,7", "19,9", "37,8", "4,2"],
      ),
    },
    {
      name: "Garlic Parmesan Burger",
      lines: [
        CHIFLA_LINE,
        CRISPY_2_LINE,
        { label: "Sos garlic mayo", gramaj: "55 g", ingredients: SOS_GARLIC_ING },
        { label: "Parmezan ras", gramaj: "sub 20 g", ingredients: PARMEZAN_ING },
        CASTRAVETI_LINE,
        CHEDDAR_LINE,
      ],
      totalGramaj: "330 g",
      certain: BURGER_CERTAIN,
      possible: [6, 9, 11],
      frozenNote: BURGER_FROZEN_NOTE,
      nutrition: nutr(
        "330 g",
        ["245", "1020", "13,2", "3,2", "18,1", "3,7", "12,5", "1,4"],
        ["805", "3375", "43,6", "10,7", "59,8", "12,1", "41,2", "4,6"],
      ),
    },
    {
      name: "Cheesy Burger",
      lines: [
        CHIFLA_LINE,
        CRISPY_2_LINE,
        { label: "Sos cheddar", gramaj: "55 g", ingredients: SOS_CHEDDAR_ING },
        ICEBERG_LINE,
        CASTRAVETI_LINE,
        CHEDDAR_LINE,
      ],
      totalGramaj: "335 g",
      certain: BURGER_CERTAIN,
      possible: BURGER_POSSIBLE,
      frozenNote: BURGER_FROZEN_NOTE,
      nutrition: nutr(
        "335 g",
        ["195", "825", "8,4", "3,4", "16,7", "2,9", "12,8", "1,5"],
        ["660", "2765", "28,2", "11,3", "55,9", "9,8", "42,9", "5,1"],
      ),
    },
    {
      name: "Truffle Burger",
      lines: [
        CHIFLA_LINE,
        CRISPY_2_LINE,
        { label: "Sos trufe", gramaj: "55 g", ingredients: SOS_TRUFE_ING },
        CEAPA_LINE,
        CASTRAVETI_LINE,
        CHEDDAR_LINE,
      ],
      totalGramaj: "330 g",
      certain: BURGER_CERTAIN,
      possible: [4, 6, 8, 11, 12],
      frozenNote: BURGER_FROZEN_NOTE,
      extraNote: "Fructele cu coajă lemnoasă care pot apărea sub formă de urme: caju, fistic.",
      nutrition: nutr(
        "330 g",
        ["260", "1085", "14,8", "3,5", "19,3", "4,1", "11,6", "1,4"],
        ["860", "3590", "48,9", "11,4", "63,8", "13,7", "38,1", "4,7"],
      ),
    },
  ],
};

// ---------------------------------------------------------------------------
// 5. Deals
// ---------------------------------------------------------------------------

const FROZEN_CARTOFI = "Conține produs congelat: cartofii prăjiți.";
const FROZEN_CHIFLA_CARTOFI =
  "Conține produse congelate: chiflă (decongelată înainte de servire) și cartofii prăjiți.";
const WITH_BURGER_POSSIBLE = [4, 6, 8, 9, 11, 12];

const CARTOFI_MEDII_LINE: RecipeLine = { label: "Cartofi medii", gramaj: "150 g", ingredients: CARTOFI_ING };
const BAUTURA_LINE: RecipeLine = {
  label: "Băutură răcoritoare la alegere (doză 330 ml)",
  gramaj: "330 ml",
  ingredients: BAUTURA_ING,
};
const BAUTURA_2_LINE: RecipeLine = { ...BAUTURA_LINE, gramaj: "2 x 330 ml" };
const BURGER_ALEGERE_LINE: RecipeLine = {
  label: "Burger la alegere",
  gramaj: "325 g",
  ingredients: "Vezi secțiunea Burgers — alegi orice rețetă din listă.",
};

export const dealsCategory: ProductCategory = {
  title: "Deals",
  products: [
    {
      name: "Fried Chicken Deal",
      lines: [
        { label: "3 Crispy Strips", gramaj: "210 g", ingredients: "Vezi fișa 3 Crispy Strips." },
        { label: "3 Wings", gramaj: "150 g", ingredients: "Vezi fișa 3 Wings." },
        CARTOFI_MEDII_LINE,
        BAUTURA_LINE,
      ],
      totalGramaj: "510 g + 330 ml",
      certain: [1, 3, 7],
      possible: [6, 9, 10, 11],
      frozenNote: FROZEN_CARTOFI,
      nutrition: nutr(
        "510 g",
        ["210", "875", "10,0", "1,4", "16,5", "0,88", "12,4", "1,2"],
        ["1065", "4455", "51,1", "7,1", "84,3", "4,5", "63,4", "6,2"],
      ),
      nutritionNote: BAUTURA_EXCLUSA,
    },
    {
      name: "Perfect Deal",
      lines: [
        BURGER_ALEGERE_LINE,
        { label: "2 Crispy Strips", gramaj: "140 g", ingredients: "Vezi fișa 2 Crispy Strips." },
        CARTOFI_MEDII_LINE,
        BAUTURA_LINE,
      ],
      totalGramaj: "615 g + 330 ml",
      certain: BURGER_CERTAIN,
      possible: WITH_BURGER_POSSIBLE,
      frozenNote: FROZEN_CHIFLA_CARTOFI,
      nutrition: nutr(
        "615 g",
        ["225", "950", "11,4", "2,1", "19,0", "2,9", "11,1", "1,2"],
        ["1395", "5825", "70,0", "12,8", "116,9", "17,6", "68,5", "7,5"],
      ),
      nutritionNote: BAUTURA_EXCLUSA,
    },
    {
      name: "Wings Deal",
      lines: [
        BURGER_ALEGERE_LINE,
        { label: "3 Wings", gramaj: "150 g", ingredients: "Vezi fișa 3 Wings." },
        CARTOFI_MEDII_LINE,
        BAUTURA_LINE,
      ],
      totalGramaj: "625 g + 330 ml",
      certain: BURGER_CERTAIN,
      possible: WITH_BURGER_POSSIBLE,
      frozenNote: FROZEN_CHIFLA_CARTOFI,
      nutrition: nutr(
        "625 g",
        ["235", "975", "12,7", "2,4", "19,0", "2,8", "10,0", "1,2"],
        ["1460", "6100", "79,3", "15,3", "118,6", "17,8", "62,7", "7,5"],
      ),
      nutritionNote: BAUTURA_EXCLUSA,
    },
    {
      name: "Duo Perfect Deal",
      lines: [
        { label: "2 Burgeri la alegere", gramaj: "650 g", ingredients: "Vezi secțiunea Burgers — alegi orice 2 rețete din listă." },
        { label: "4 Crispy Strips", gramaj: "280 g", ingredients: "Vezi fișa 4 Crispy Strips." },
        { label: "Cartofi medii (2 porții)", gramaj: "300 g", ingredients: CARTOFI_ING },
        BAUTURA_2_LINE,
      ],
      totalGramaj: "1230 g + 660 ml",
      certain: BURGER_CERTAIN,
      possible: WITH_BURGER_POSSIBLE,
      frozenNote: FROZEN_CHIFLA_CARTOFI,
      nutrition: nutr(
        "1230 g",
        ["225", "950", "11,4", "2,1", "19,0", "2,9", "11,1", "1,2"],
        ["2785", "11655", "140,0", "25,5", "233,9", "35,2", "136,9", "15,1"],
      ),
      nutritionNote: BAUTURA_EXCLUSA,
    },
    {
      name: "All In Deal",
      lines: [
        BURGER_ALEGERE_LINE,
        { label: "2 Crispy Strips", gramaj: "140 g", ingredients: "Vezi fișa 2 Crispy Strips." },
        { label: "3 Wings", gramaj: "150 g", ingredients: "Vezi fișa 3 Wings." },
        CARTOFI_MEDII_LINE,
        { label: "Sos mare la alegere", gramaj: "150 g", ingredients: VEZI_SOSURI },
        BAUTURA_LINE,
      ],
      totalGramaj: "915 g + 330 ml",
      certain: BURGER_CERTAIN,
      possible: WITH_BURGER_POSSIBLE,
      frozenNote: FROZEN_CHIFLA_CARTOFI,
      nutrition: nutr(
        "915 g",
        ["250", "1050", "15,6", "2,7", "17,2", "3,8", "10,0", "1,3"],
        ["2300", "9615", "142,5", "24,2", "157,2", "34,5", "91,8", "12,2"],
      ),
      nutritionNote: BAUTURA_EXCLUSA,
    },
    {
      name: "Special Deal",
      lines: [
        { label: "3 Crispy Strips", gramaj: "210 g", ingredients: "Vezi fișa 3 Crispy Strips." },
        { label: "3 Famous Wings", gramaj: "160 g", ingredients: "Vezi fișa 3 Famous Wings." },
        CARTOFI_MEDII_LINE,
        BAUTURA_LINE,
      ],
      totalGramaj: "520 g + 330 ml",
      certain: [1, 3, 7],
      possible: [6, 9, 10, 11],
      frozenNote: FROZEN_CARTOFI,
      nutrition: nutr(
        "520 g",
        ["215", "900", "10,1", "1,4", "18,0", "2,4", "12,5", "1,2"],
        ["1120", "4685", "52,4", "7,3", "93,8", "12,7", "64,8", "6,3"],
      ),
      nutritionNote: BAUTURA_EXCLUSA,
    },
    {
      name: "Southern Deal",
      lines: [
        { label: "3 Crispy Strips", gramaj: "210 g", ingredients: "Vezi fișa 3 Crispy Strips." },
        CARTOFI_MEDII_LINE,
        { label: "Salată coleslaw", gramaj: "80 g", ingredients: COLESLAW_ING },
        BAUTURA_LINE,
      ],
      totalGramaj: "440 g + 330 ml",
      certain: [1, 3, 7, 10],
      possible: [6, 9, 11],
      frozenNote: FROZEN_CARTOFI,
      nutrition: nutr(
        "440 g",
        ["190", "800", "9,3", "1,0", "16,1", "2,1", "10,0", "1,1"],
        ["845", "3530", "41,1", "4,4", "71,0", "9,3", "43,8", "4,8"],
      ),
      nutritionNote: BAUTURA_EXCLUSA,
    },
  ],
};

// ---------------------------------------------------------------------------
// 6. Combo (menus)
// ---------------------------------------------------------------------------

const COMBO_CERTAIN = [1, 3, 7, 10];
const COMBO_POSSIBLE = [4, 6, 8, 9, 11];

function comboProduct(
  name: string,
  fisa: string,
  fisaGramaj: string,
  sos: "mic" | "mare",
  total: string,
  per100: NutritionValues,
  perProduct: NutritionValues,
): Product {
  return {
    name,
    lines: [
      { label: fisa, gramaj: fisaGramaj, ingredients: `Vezi fișa ${fisa}.` },
      CARTOFI_MEDII_LINE,
      sos === "mic"
        ? { label: "Sos mic la alegere", gramaj: "60 g", ingredients: VEZI_SOSURI }
        : { label: "Sos mare la alegere", gramaj: "150 g", ingredients: VEZI_SOSURI },
      BAUTURA_LINE,
    ],
    totalGramaj: `${total} + 330 ml`,
    certain: COMBO_CERTAIN,
    possible: COMBO_POSSIBLE,
    frozenNote: FROZEN_CARTOFI,
    nutrition: nutr(total, per100, perProduct),
    nutritionNote: BAUTURA_EXCLUSA,
  };
}

export const comboCategory: ProductCategory = {
  title: "Combo",
  products: [
    comboProduct("3 Crispy Menu", "3 Crispy Strips", "210 g", "mic", "420 g",
      ["225", "945", "12,6", "1,5", "16,9", "2,2", "10,5", "1,2"],
      ["950", "3975", "52,9", "6,5", "71,1", "9,0", "44,2", "4,9"]),
    comboProduct("4 Crispy Menu", "4 Crispy Strips", "280 g", "mic", "490 g",
      ["220", "930", "11,8", "1,4", "16,5", "2,0", "11,7", "1,2"],
      ["1090", "4550", "58,0", "7,1", "80,7", "9,8", "57,3", "6,1"]),
    comboProduct("5 Crispy Menu", "5 Crispy Strips", "350 g", "mare", "650 g",
      ["240", "1005", "14,6", "1,9", "15,7", "3,0", "11,1", "1,3"],
      ["1565", "6545", "94,9", "12,4", "102,0", "19,7", "72,1", "8,6"]),
    comboProduct("6 Crispy Menu", "6 Crispy Strips", "420 g", "mare", "720 g",
      ["235", "990", "13,9", "1,8", "15,5", "2,8", "11,8", "1,4"],
      ["1700", "7120", "100,0", "13,0", "111,6", "20,4", "85,2", "9,8"]),
    comboProduct("3 Wings Menu", "3 Wings", "150 g", "mic", "360 g",
      ["245", "1020", "15,9", "2,3", "17,5", "2,4", "7,0", "1,0"],
      ["875", "3670", "57,1", "8,4", "63,2", "8,5", "25,3", "3,8"]),
    comboProduct("5 Wings Menu", "5 Wings", "250 g", "mic", "460 g",
      ["240", "1005", "15,2", "2,4", "16,8", "2,1", "8,5", "1,1"],
      ["1105", "4620", "70,1", "10,8", "77,1", "9,5", "38,9", "5,2"]),
    comboProduct("8 Wings Menu", "8 Wings", "400 g", "mare", "700 g",
      ["255", "1065", "17,3", "2,7", "15,7", "2,9", "8,7", "1,3"],
      ["1785", "7460", "121,3", "19,2", "109,7", "20,3", "61,1", "8,9"]),
    {
      name: "Burger Menu",
      lines: [
        BURGER_ALEGERE_LINE,
        CARTOFI_MEDII_LINE,
        { label: "Sos mic la alegere", gramaj: "60 g", ingredients: VEZI_SOSURI },
        BAUTURA_LINE,
      ],
      totalGramaj: "535 g + 330 ml",
      certain: BURGER_CERTAIN,
      possible: WITH_BURGER_POSSIBLE,
      frozenNote: FROZEN_CHIFLA_CARTOFI,
      nutrition: nutr(
        "535 g",
        ["250", "1050", "15,2", "2,7", "19,7", "4,2", "8,1", "1,2"],
        ["1345", "5620", "81,1", "14,7", "105,4", "22,3", "43,5", "6,3"],
      ),
      nutritionNote: BAUTURA_EXCLUSA,
    },
    {
      name: "Southern Menu",
      lines: [
        { label: "3 Crispy Strips", gramaj: "210 g", ingredients: "Vezi fișa 3 Crispy Strips." },
        CARTOFI_MEDII_LINE,
        { label: "Salată coleslaw", gramaj: "80 g", ingredients: COLESLAW_ING },
        { label: "Sos mic la alegere", gramaj: "60 g", ingredients: VEZI_SOSURI },
        BAUTURA_LINE,
      ],
      totalGramaj: "500 g + 330 ml",
      certain: COMBO_CERTAIN,
      possible: COMBO_POSSIBLE,
      frozenNote: FROZEN_CARTOFI,
      nutrition: nutr(
        "500 g",
        ["215", "895", "12,5", "1,5", "15,8", "3,1", "9,0", "1,2"],
        ["1070", "4475", "62,3", "7,6", "78,8", "15,4", "45,0", "5,8"],
      ),
      nutritionNote: BAUTURA_EXCLUSA,
    },
  ],
};

// ---------------------------------------------------------------------------
// 7. One Bite First Time
// ---------------------------------------------------------------------------

function oneBiteProduct(
  name: string,
  fisa: string,
  gramaj: string,
  total: string,
  per100: NutritionValues,
  perProduct: NutritionValues,
): Product {
  return {
    name,
    lines: [
      { label: fisa, gramaj, ingredients: `Vezi fișa ${fisa}.` },
      {
        label: "Cartofi medii (varianta 1)",
        gramaj: "150 g",
        ingredients: CARTOFI_ING,
      },
      {
        label: "Băutură răcoritoare (varianta 2)",
        gramaj: "330 ml",
        ingredients: BAUTURA_ING,
      },
    ],
    totalGramaj: `${total} (cu cartofi) sau ${gramaj} + 330 ml (cu suc) — se alege o singură variantă`,
    certain: [1, 3, 7],
    possible: [6, 9, 10, 11],
    frozenNote: "Conține produs congelat: cartofii prăjiți (dacă alegi varianta cu cartofi).",
    nutrition: nutr(total, per100, perProduct),
    nutritionNote: `Valorile sunt calculate pentru varianta cu cartofi (${total}). ${BAUTURA_EXCLUSA}`,
  };
}

export const oneBiteCategory: ProductCategory = {
  title: "One Bite First Time",
  intro: "Se alege una dintre cele două variante de completare: cartofi medii sau băutură răcoritoare.",
  products: [
    oneBiteProduct("2 Crispy + cartofi medii sau suc", "2 Crispy Strips", "140 g", "290 g",
      ["200", "845", "9,2", "0,96", "18,5", "0,76", "10,3", "0,98"],
      ["585", "2450", "26,6", "2,8", "53,7", "2,2", "29,9", "2,8"]),
    oneBiteProduct("3 Wings + cartofi medii sau suc", "3 Wings", "150 g", "300 g",
      ["215", "910", "12,0", "1,8", "18,5", "0,78", "8,1", "0,93"],
      ["650", "2725", "35,9", "5,3", "55,4", "2,3", "24,2", "2,8"]),
    oneBiteProduct("3 Famous Wings + cartofi medii sau suc", "3 Famous Wings", "160 g", "310 g",
      ["230", "955", "12,0", "1,8", "20,9", "3,4", "8,2", "0,95"],
      ["705", "2955", "37,2", "5,5", "64,9", "10,5", "25,6", "2,9"]),
  ],
};

// ---------------------------------------------------------------------------
// 8. Buckets
// ---------------------------------------------------------------------------

const BUCKET_CERTAIN = [1, 3, 7, 10];
const BUCKET_POSSIBLE = [4, 6, 8, 9, 11];

export const bucketsCategory: ProductCategory = {
  title: "Buckets",
  products: [
    {
      name: "Wings Bucket",
      lines: [
        { label: "10 Wings picante (10 buc. x 50 g)", gramaj: "500 g", ingredients: WINGS_ING },
        { label: "Cartofi mari", gramaj: "250 g", ingredients: CARTOFI_ING },
        { label: "Sos mare la alegere", gramaj: "150 g", ingredients: VEZI_SOSURI },
      ],
      totalGramaj: "900 g",
      certain: BUCKET_CERTAIN,
      possible: BUCKET_POSSIBLE,
      frozenNote: FROZEN_CARTOFI,
      nutrition: nutr(
        "900 g",
        ["245", "1030", "16,1", "2,5", "16,3", "2,4", "8,6", "1,2"],
        ["2220", "9280", "145,3", "22,7", "146,6", "21,9", "77,2", "10,7"],
      ),
    },
    {
      name: "Crispy Bucket",
      lines: [
        { label: "10 Crispy Strips (10 buc. x 70 g)", gramaj: "700 g", ingredients: CRISPY_STRIPS_ING },
        { label: "Cartofi mari", gramaj: "250 g", ingredients: CARTOFI_ING },
        { label: "Sos mare la alegere", gramaj: "150 g", ingredients: VEZI_SOSURI },
      ],
      totalGramaj: "1100 g",
      certain: BUCKET_CERTAIN,
      possible: BUCKET_POSSIBLE,
      frozenNote: FROZEN_CARTOFI,
      nutrition: nutr(
        "1100 g",
        ["225", "935", "11,9", "1,5", "15,7", "2,2", "12,7", "1,3"],
        ["2460", "10295", "131,2", "16,4", "173,1", "23,8", "140,1", "14,6"],
      ),
    },
    {
      name: "Mix Bucket",
      lines: [
        { label: "5 Crispy Strips (5 buc. x 70 g)", gramaj: "350 g", ingredients: CRISPY_STRIPS_ING },
        { label: "5 Wings (5 buc. x 50 g)", gramaj: "250 g", ingredients: WINGS_ING },
        { label: "Cartofi mari", gramaj: "250 g", ingredients: CARTOFI_ING },
        { label: "Sos mare la alegere", gramaj: "150 g", ingredients: VEZI_SOSURI },
      ],
      totalGramaj: "1000 g",
      certain: BUCKET_CERTAIN,
      possible: BUCKET_POSSIBLE,
      frozenNote: FROZEN_CARTOFI,
      nutrition: nutr(
        "1000 g",
        ["235", "980", "13,8", "2,0", "16,0", "2,3", "10,9", "1,3"],
        ["2340", "9785", "138,3", "19,6", "159,8", "22,8", "108,6", "12,7"],
      ),
    },
    {
      name: "Friends Bucket",
      lines: [
        { label: "10 Crispy Strips (10 buc. x 70 g)", gramaj: "700 g", ingredients: CRISPY_STRIPS_ING },
        { label: "10 Wings (10 buc. x 50 g)", gramaj: "500 g", ingredients: WINGS_ING },
        { label: "Cartofi mari (2 porții)", gramaj: "500 g", ingredients: CARTOFI_ING },
        { label: "2 sosuri mari la alegere", gramaj: "300 g", ingredients: VEZI_SOSURI },
        BAUTURA_2_LINE,
      ],
      totalGramaj: "2000 g + 660 ml",
      certain: BUCKET_CERTAIN,
      possible: BUCKET_POSSIBLE,
      frozenNote: FROZEN_CARTOFI,
      nutrition: nutr(
        "2000 g",
        ["235", "980", "13,8", "2,0", "16,0", "2,3", "10,9", "1,3"],
        ["4680", "19570", "276,5", "39,1", "319,7", "45,6", "217,3", "25,4"],
      ),
      nutritionNote: BAUTURA_EXCLUSA,
    },
    {
      name: "Friends Crispy Bucket",
      lines: [
        { label: "20 Crispy Strips (20 buc. x 70 g)", gramaj: "1400 g", ingredients: CRISPY_STRIPS_ING },
        { label: "Cartofi mari (2 porții)", gramaj: "500 g", ingredients: CARTOFI_ING },
        { label: "2 sosuri mari la alegere", gramaj: "300 g", ingredients: VEZI_SOSURI },
        BAUTURA_2_LINE,
      ],
      totalGramaj: "2200 g + 660 ml",
      certain: BUCKET_CERTAIN,
      possible: BUCKET_POSSIBLE,
      frozenNote: FROZEN_CARTOFI,
      nutrition: nutr(
        "2200 g",
        ["225", "935", "11,9", "1,5", "15,7", "2,2", "12,7", "1,3"],
        ["4920", "20585", "262,5", "32,8", "346,1", "47,6", "280,1", "29,3"],
      ),
      nutritionNote: BAUTURA_EXCLUSA,
    },
    {
      name: "Friends Wings Bucket",
      lines: [
        { label: "20 Wings picante (20 buc. x 50 g)", gramaj: "1000 g", ingredients: WINGS_ING },
        { label: "Cartofi mari (2 porții)", gramaj: "500 g", ingredients: CARTOFI_ING },
        { label: "2 sosuri mari la alegere", gramaj: "300 g", ingredients: VEZI_SOSURI },
      ],
      totalGramaj: "1800 g",
      certain: BUCKET_CERTAIN,
      possible: BUCKET_POSSIBLE,
      frozenNote: FROZEN_CARTOFI,
      nutrition: nutr(
        "1800 g",
        ["245", "1030", "16,1", "2,5", "16,3", "2,4", "8,6", "1,2"],
        ["4435", "18555", "290,5", "45,4", "293,2", "43,7", "154,4", "21,5"],
      ),
    },
    {
      name: "Only Chicken Bucket",
      lines: [
        { label: "10 Crispy Strips (10 buc. x 70 g)", gramaj: "700 g", ingredients: CRISPY_STRIPS_ING },
        { label: "10 Wings (10 buc. x 50 g)", gramaj: "500 g", ingredients: WINGS_ING },
      ],
      totalGramaj: "1200 g",
      certain: [1, 3, 7],
      possible: [6],
      nutrition: nutr(
        "1200 g",
        ["210", "875", "9,6", "1,5", "13,8", "1,0", "16,6", "1,5"],
        ["2515", "10520", "115,3", "18,3", "165,9", "12,5", "198,9", "18,5"],
      ),
    },
    {
      name: "Southern Bucket",
      lines: [
        { label: "10 Crispy Strips (10 buc. x 70 g)", gramaj: "700 g", ingredients: CRISPY_STRIPS_ING },
        { label: "Cartofi mari", gramaj: "250 g", ingredients: CARTOFI_ING },
        { label: "Sos mare la alegere", gramaj: "150 g", ingredients: VEZI_SOSURI },
        { label: "Salată coleslaw (2 porții)", gramaj: "160 g", ingredients: COLESLAW_ING },
      ],
      totalGramaj: "1260 g",
      certain: BUCKET_CERTAIN,
      possible: BUCKET_POSSIBLE,
      frozenNote: FROZEN_CARTOFI,
      nutrition: nutr(
        "1260 g",
        ["215", "895", "11,9", "1,5", "15,0", "2,9", "11,2", "1,3"],
        ["2700", "11295", "150,0", "18,5", "188,4", "36,6", "141,7", "16,4"],
      ),
    },
  ],
};

// ---------------------------------------------------------------------------
// 9. Sides
// ---------------------------------------------------------------------------

const CARTOFI_100: NutritionValues = ["205", "865", "11,0", "1,0", "23,0", "0,50", "2,5", "0,40"];

export const sidesCategory: ProductCategory = {
  title: "Sides",
  products: [
    {
      name: "Cartofi medii",
      lines: [{ label: "Cartofi prăjiți", gramaj: "150 g", ingredients: CARTOFI_ING }],
      totalGramaj: "150 g",
      certain: null,
      possible: [1, 3, 6, 7, 9, 10, 11],
      noMajorAllergens: true,
      frozenNote: FROZEN_CARTOFI,
      nutrition: nutr("150 g", CARTOFI_100, ["310", "1300", "16,5", "1,6", "34,5", "0,75", "3,8", "0,60"]),
    },
    {
      name: "Cartofi mari",
      lines: [{ label: "Cartofi prăjiți", gramaj: "250 g", ingredients: CARTOFI_ING }],
      totalGramaj: "250 g",
      certain: null,
      possible: [1, 3, 6, 7, 9, 10, 11],
      noMajorAllergens: true,
      frozenNote: FROZEN_CARTOFI,
      nutrition: nutr("250 g", CARTOFI_100, ["515", "2165", "27,5", "2,6", "57,5", "1,2", "6,2", "1,0"]),
    },
    {
      name: "Upgrade Usturoi + Parmezan",
      lines: [
        {
          label: "Usturoi și parmezan (upgrade)",
          gramaj: "sub 20 g",
          ingredients:
            "Mix de brânzeturi tari rase (LAPTE, sare, cheag, conservant: lizozimă din OUĂ), usturoi granulat.",
        },
      ],
      totalGramaj: "15 g",
      certain: [3, 7],
      possible: [1, 6, 9, 10, 11],
      nutrition: nutr(
        "15 g",
        ["365", "1525", "24,1", "15,0", "4,1", "0,13", "31,0", "1,5"],
        ["55", "230", "3,6", "2,3", "0,61", "0,02", "4,6", "0,22"],
      ),
    },
    {
      name: "Salată coleslaw",
      lines: [{ label: "Salată coleslaw", gramaj: "80 g", ingredients: COLESLAW_ING }],
      totalGramaj: "80 g",
      certain: [3, 10],
      possible: null,
      nutrition: nutr(
        "80 g",
        ["150", "625", "11,7", "1,3", "9,6", "8,0", "0,99", "1,1"],
        ["120", "500", "9,4", "1,1", "7,7", "6,4", "0,79", "0,88"],
      ),
    },
  ],
};

// ---------------------------------------------------------------------------
// 10. Sosuri (porție mică 60 g / porție mare 150 g)
// ---------------------------------------------------------------------------

function sosProduct(
  name: string,
  ingredients: string,
  certain: number[],
  possible: number[] | null,
  per100: NutritionValues,
  kcalMica: string,
  kcalMare: string,
  extraNote?: string,
): Product {
  return {
    name,
    lines: [{ label: name, gramaj: "60 g / 150 g", ingredients }],
    totalGramaj: "60 g / 150 g",
    certain,
    possible,
    extraNote,
    nutrition: [nutritionRow("La 100 g", per100)],
    nutritionNote: `Porția mică (60 g): ${kcalMica} kcal. Porția mare (150 g): ${kcalMare} kcal.`,
  };
}

export const sosuriCategory: ProductCategory = {
  title: "Sosuri",
  intro:
    "Porție mică: 60 g. Porție mare: 150 g. Sosurile se prepară în restaurant. Aceleași sosuri se folosesc și la burgeri, și la meniuri. Pe un burger se pun 55 g de sos.",
  products: [
    sosProduct("Sos maioneză", SOS_MAIONEZA_ING, [3, 10], null,
      ["465", "1945", "47,9", "5,5", "9,1", "5,9", "0,27", "1,4"], "280", "695"),
    sosProduct("Maioneză picantă", SOS_PICANT_ING, [3, 10], null,
      ["380", "1600", "35,8", "4,1", "14,9", "12,2", "0,43", "2,8"], "230", "575"),
    sosProduct("Sos honey mustard", SOS_HONEY_MUSTARD_ING, [3, 10], null,
      ["425", "1785", "37,7", "4,3", "21,1", "18,5", "0,87", "1,3"], "255", "640"),
    sosProduct("Garlic mayo", SOS_GARLIC_ING, [3, 7, 10], [1, 6, 9, 11],
      ["380", "1595", "38,0", "5,1", "9,0", "5,0", "1,5", "1,1"], "230", "570"),
    sosProduct("Sos trufe", SOS_TRUFE_ING, [3, 10], [4, 6, 7, 8],
      ["430", "1795", "44,0", "5,2", "8,2", "5,3", "0,64", "1,4"], "255", "645",
      "Fructele cu coajă lemnoasă care pot apărea sub formă de urme: caju, fistic."),
    sosProduct("Sos sour-cherry", SOS_SOUR_CHERRY_ING, [3, 10], null,
      ["425", "1775", "38,2", "4,4", "20,7", "18,1", "0,30", "1,1"], "255", "635"),
    sosProduct("Sos cheddar", SOS_CHEDDAR_ING, [7], null,
      ["180", "750", "14,7", "9,2", "1,4", "0,46", "10,1", "2,3"], "105", "270"),
    sosProduct("Sos Utopia", SOS_UTOPIA_ING, [3, 7, 9, 10], null,
      ["325", "1360", "27,0", "3,9", "18,9", "16,3", "1,6", "1,6"], "195", "485"),
  ],
};

// ---------------------------------------------------------------------------
// 11. Răcoritoare
// ---------------------------------------------------------------------------

function bauturaProduct(
  name: string,
  volum: string,
  ingredients: string,
  per100ml: NutritionValues,
  kcalAmbalaj: string,
  extraNote?: string,
): Product {
  return {
    name,
    lines: [{ label: name, gramaj: volum, ingredients }],
    totalGramaj: volum,
    certain: null,
    possible: null,
    noMajorAllergens: true,
    extraNote,
    nutrition: [nutritionRow("La 100 ml", per100ml)],
    nutritionNote: `Per ambalaj (${volum}): ${kcalAmbalaj} kcal.`,
  };
}

const APA_100: NutritionValues = ["0", "0", "0,00", "0,00", "0,00", "0,00", "0,00", "0,00"];

export const racoritoareCategory: ProductCategory = {
  title: "Răcoritoare",
  intro:
    "Băuturile se servesc în ambalajul original al producătorului. Niciuna dintre băuturi nu conține alergeni din cei 14 majori.",
  products: [
    bauturaProduct(
      "Pepsi",
      "330 ml",
      "Apă, zahăr, dioxid de carbon, colorant: caramel (E150d), acidifiant: acid fosforic (E338), aromă naturală, cafeină.",
      ["45", "188", "0,00", "0,00", "11,1", "11,1", "0,00", "0,10"],
      "148",
    ),
    bauturaProduct(
      "Pepsi Max",
      "330 ml",
      "Apă, dioxid de carbon, colorant: caramel cu sulfit de amoniu (E150d), îndulcitori: aspartam și acesulfam de potasiu, acidifianți: acid fosforic și acid citric, corector de aciditate: citrați de sodiu, arome, cafeină.",
      ["1", "4", "0,00", "0,00", "0,00", "0,00", "0,00", "0,01"],
      "3",
      "Conține o sursă de fenilalanină.",
    ),
    bauturaProduct(
      "Pepsi Twist",
      "330 ml",
      "Apă, sirop de fructoză-glucoză, zahăr, suc de lămâie din suc concentrat (1%), dioxid de carbon, colorant: caramel (E150d), aromă, cafeină, acidifiant: acid fosforic (E338), corector de aciditate: citrat de sodiu, conservant: benzoat de sodiu (E211).",
      ["44", "184", "0,00", "0,00", "11,0", "11,0", "0,00", "0,03"],
      "145",
    ),
    bauturaProduct(
      "Mirinda",
      "330 ml",
      "Apă, sirop de fructoză-glucoză, suc de portocale din suc concentrat (4%), dioxid de carbon, acidifiant: acid citric, conservant: sorbat de potasiu, antioxidant: acid ascorbic, arome, îndulcitori: acesulfam de potasiu și sucraloză, stabilizator: gumă arabică, coloranți: beta-apo-8'-carotenal (C30) și beta-caroten.",
      ["32", "134", "0,00", "0,00", "7,8", "7,8", "0,00", "0,01"],
      "106",
    ),
    bauturaProduct(
      "7UP",
      "330 ml",
      "Apă, zahăr, dioxid de carbon, acidifianți: acid citric și acid malic, arome (conțin aromă naturală de lămâie și lămâie verde), corector de aciditate: citrați de sodiu, îndulcitor: glicozide derivate din steviol.",
      ["30", "126", "0,00", "0,00", "7,3", "7,3", "0,00", "0,04"],
      "99",
    ),
    bauturaProduct("Apă plată Aqua Carpatica", "500 ml", "Apă minerală naturală plată.", APA_100, "0"),
    bauturaProduct("Apă minerală Aqua Carpatica", "500 ml", "Apă minerală naturală carbogazoasă.", APA_100, "0"),
  ],
};

// ---------------------------------------------------------------------------
// 12. Cum este calculată declarația nutrițională
// ---------------------------------------------------------------------------

export const calculNutritional: { title: string; body: string }[] = [
  {
    title: "Metoda",
    body: "Valorile sunt calculate, nu măsurate în laborator: gramajul fiecărei componente înmulțit cu valorile de pe eticheta furnizorului. Energia este rotunjită la 5 kcal.",
  },
  {
    title: "Prăjirea",
    body: "La 1 kg de carne crudă se rețin 250 g pesmet, 200 g apă din marinadă și 30 g pudră de marinadă, se pierd 180 g apă la prăjire și se absorb 80 g ulei. Rezultă cca. 1,38 kg produs finit, adică 195 kcal/100 g la crispy strips și 225 kcal/100 g la wings.",
  },
  {
    title: "Cartofii",
    body: "Porția se cântărește congelată (150 g sau 250 g) și se adaugă uleiul absorbit, 6% din greutate.",
  },
  {
    title: "Gramaje de porție",
    body: "Crispy strip 70 g, aripioară 50 g (între 50 și 80 g în funcție de calibru), chiflă 70 g, două felii de cheddar 25 g, sos pe burger 55 g, castraveți murați 30 g, glazură de miere 10 g, salată iceberg 15 g, ceapă crocantă 10 g, parmezan 10 g, coleslaw pe burger 40 g. Burgerul asamblat cântărește în medie 325 g.",
  },
  {
    title: "Băuturile",
    body: "Se servesc în ambalajul original și nu sunt incluse în valorile meniurilor; valorile lor sunt în secțiunea Răcoritoare.",
  },
  {
    title: "De reținut",
    body: "Valorile se actualizează la fiecare schimbare de rețetă, de gramaj sau de furnizor. Valorile marcate ca de referință se înlocuiesc cu cele de pe etichetă de îndată ce furnizorul o pune la dispoziție.",
  },
];

/** Per-100 g values of each component used in the calculation, with the source of the value. */
export type ComponentNutrition = {
  name: string;
  energy: string;
  fat: string;
  saturated: string;
  carbs: string;
  sugars: string;
  protein: string;
  salt: string;
  /** True = "Valoare de referință (fără etichetă)"; false = supplier/producer label. */
  reference: boolean;
  source: string;
};

function comp(
  name: string,
  [kcal, f, s, c, z, p, salt]: [string, string, string, string, string, string, string],
  source: "producator" | "furnizor" | "referinta",
): ComponentNutrition {
  return {
    name,
    energy: `${kcal} kcal`,
    fat: `${f} g`,
    saturated: `${s} g`,
    carbs: `${c} g`,
    sugars: `${z} g`,
    protein: `${p} g`,
    salt: `${salt} g`,
    reference: source === "referinta",
    source:
      source === "producator"
        ? "Eticheta producătorului"
        : source === "furnizor"
          ? "Eticheta furnizorului"
          : "Valoare de referință (fără etichetă)",
  };
}

export const componenteNutritionale: ComponentNutrition[] = [
  comp("7UP (100 ml)", ["30", "0,00", "0,00", "7,3", "7,3", "0,00", "0,04"], "producator"),
  comp("Apă minerală (100 ml)", ["0", "0,00", "0,00", "0,00", "0,00", "0,00", "0,00"], "producator"),
  comp("Cartofi congelați", ["153", "5,0", "0,60", "23,0", "0,50", "2,5", "0,40"], "furnizor"),
  comp("Castraveți murați", ["19", "0,10", "0,10", "3,0", "2,8", "0,50", "1,2"], "furnizor"),
  comp("Ceapă crocantă", ["622", "46,0", "23,0", "44,0", "15,0", "6,0", "1,1"], "furnizor"),
  comp("Cheddar felii", ["338", "27,0", "18,0", "3,1", "3,1", "19,0", "2,7"], "furnizor"),
  comp("Chiflă brioche", ["277", "4,6", "0,80", "48,5", "8,9", "8,7", "0,80"], "furnizor"),
  comp("Cremă de ciuperci cu trufe", ["167", "16,0", "2,9", "1,5", "0,80", "3,2", "1,6"], "furnizor"),
  comp("Dulceață de vișine", ["262", "0,00", "0,00", "65,0", "65,0", "0,40", "0,00"], "furnizor"),
  comp("Iaurt grecesc", ["126", "10,0", "6,0", "3,5", "3,5", "5,5", "0,20"], "furnizor"),
  comp("Ketchup", ["102", "0,10", "0,05", "23,2", "22,8", "1,2", "1,8"], "furnizor"),
  comp("Maioneză", ["514", "53,0", "6,1", "10,1", "6,5", "0,30", "1,5"], "furnizor"),
  comp("Marinadă delicată", ["110", "0,50", "0,10", "15,5", "5,8", "10,0", "62,0"], "furnizor"),
  comp("Marinadă picantă", ["168", "2,7", "0,50", "25,0", "7,0", "9,0", "54,0"], "furnizor"),
  comp("Miere", ["325", "0,00", "0,00", "80,8", "80,8", "0,40", "0,00"], "furnizor"),
  comp("Mirinda (100 ml)", ["32", "0,00", "0,00", "7,8", "7,8", "0,00", "0,01"], "producator"),
  comp("Muștar", ["113", "5,8", "0,30", "6,0", "5,8", "4,2", "1,9"], "furnizor"),
  comp("Oțet", ["16", "0,00", "0,00", "4,0", "3,8", "0,50", "0,05"], "furnizor"),
  comp("Parmezan ras", ["368", "26,0", "16,2", "0,00", "0,00", "32,0", "1,6"], "furnizor"),
  comp("Pepsi (100 ml)", ["45", "0,00", "0,00", "11,1", "11,1", "0,00", "0,10"], "producator"),
  comp("Pepsi Max (100 ml)", ["1", "0,00", "0,00", "0,00", "0,00", "0,00", "0,01"], "producator"),
  comp("Pepsi Twist (100 ml)", ["44", "0,00", "0,00", "11,0", "11,0", "0,00", "0,03"], "producator"),
  comp("Pesmet (panare)", ["346", "1,1", "0,30", "74,0", "5,0", "10,0", "0,80"], "furnizor"),
  comp("Sos barbecue", ["125", "0,50", "0,10", "30,0", "23,0", "0,50", "1,8"], "furnizor"),
  comp("Sos cheddar (bază)", ["195", "16,0", "10,0", "1,5", "0,50", "11,0", "2,5"], "furnizor"),
  comp("Sos de ardei iute", ["107", "0,00", "0,00", "25,0", "24,0", "0,70", "5,5"], "furnizor"),
  comp("Ulei de prăjit (high oleic)", ["899", "99,9", "7,5", "0,00", "0,00", "0,00", "0,00"], "furnizor"),
  comp("Usturoi granulat", ["319", "0,40", "0,10", "55,0", "1,8", "18,0", "0,10"], "furnizor"),
  comp("Aripioare de pui crude", ["150", "9,5", "2,7", "0,00", "0,00", "16,0", "0,20"], "referinta"),
  comp("Boia de ardei dulce", ["282", "13,0", "2,1", "34,0", "10,0", "14,0", "0,10"], "referinta"),
  comp("Mix varză și morcov", ["30", "0,20", "0,00", "5,0", "4,0", "1,2", "0,05"], "referinta"),
  comp("Piept de pui crud", ["110", "1,7", "0,50", "0,00", "0,00", "23,0", "0,15"], "referinta"),
  comp("Piper", ["251", "3,3", "1,4", "39,0", "0,60", "10,0", "0,05"], "referinta"),
  comp("Salată iceberg", ["14", "0,10", "0,00", "2,0", "1,5", "0,90", "0,01"], "referinta"),
  comp("Sare", ["0", "0,00", "0,00", "0,00", "0,00", "0,00", "100,0"], "referinta"),
  comp("Zahăr", ["400", "0,00", "0,00", "100,0", "100,0", "0,00", "0,00"], "referinta"),
];

// ---------------------------------------------------------------------------
// 13. Informații importante (verbatim din documentul sursă)
// ---------------------------------------------------------------------------

export const informatiiImportante: { title: string; body: string }[] = [
  {
    title: "Carnea de pui",
    body: "Pieptul de pui și aripioarele se cumpără refrigerate (necongelate), origine România. Se marinează și se panează în restaurant, apoi se prăjesc. Aripioarele se prepară doar în varianta picantă.",
  },
  {
    title: "Produse congelate",
    body: "Cartofii prăjiți și chiflele se primesc congelate. Chiflele se decongelează înainte de servire și nu se recongelează.",
  },
  {
    title: "Friteuze",
    body: "Cartofii și puiul se prăjesc în friteuze separate. Ustensilele și suprafețele de lucru sunt comune, deci pot apărea urme de alergeni între preparate.",
  },
  {
    title: "Alergeni",
    body: "Informațiile provin de pe etichetele furnizorilor. Atenție: maioneza folosită la toate sosurile de casă conține ou și muștar, castraveții murați conțin semințe de muștar, iar Sosul Utopia conține și țelină (din ketchup).",
  },
  {
    title: "Sosuri",
    body: "Sosurile se prepară în restaurant din ingrediente cumpărate. Proporțiile rețetelor sunt confidențiale; lista completă a ingredientelor fiecărui sos este în secțiunea Sosuri.",
  },
  {
    title: "Informații suplimentare",
    body: "Pentru orice produs, etichetele furnizorilor se pot consulta la cerere, la personalul restaurantului. Componentele marcate „sub 20 g” sunt incluse în gramajul total al produsului.",
  },
  {
    title: "Valabilitate",
    body: "Aceste informații sunt valabile din 17.10.2026 și se actualizează la fiecare schimbare de rețetă, furnizor sau meniu. Rețetele și proporțiile sunt proprietatea UTOPIA BURGER S.R.L.",
  },
];

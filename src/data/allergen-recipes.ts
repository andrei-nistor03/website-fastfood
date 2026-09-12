/**
 * Full product / recipe / allergen data for the "Alergeni" page, transcribed
 * from the operator's official document "Informații despre ingrediente,
 * alergeni și gramaje produse" (UTOPIA BURGER S.R.L., valabil din
 * 03.09.2026). Allergen codes reference ALLERGEN_NAMES in ./allergens.ts.
 *
 * A handful of ingredient lines are still pending confirmation on the real
 * supplier label (marked `incomplete: true`, mirroring the "[DE COMPLETAT]"
 * notes in the source document) — everything else here comes directly off a
 * real product label or the restaurant's own recipe.
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
  /** Hides the allergen summary entirely (e.g. bottled drinks — see note). */
  skipAllergenFooter?: boolean;
  frozenNote?: string;
  extraNote?: string;
};

export type ProductCategory = {
  title: string;
  intro?: string;
  products: Product[];
};

// ---------------------------------------------------------------------------
// Reusable ingredient blocks (identical across many products)
// ---------------------------------------------------------------------------

const CRISPY_STRIPS_ING =
  "Piept de pui (origine: România), marinadă (amestec de condimente (sare, glucoză, proteină vegetală hidrolizată din sfeclă de zahăr, condimente, extracte de condimente), sare, potențiator de aromă: E621, stabilizator: E450), pesmet (făină de GRÂU, agenți de afânare: E500, E450, LAPTE praf degresat, potențiator de aromă: E621, amestec de condimente (sare, făină de GRÂU, proteină vegetală hidrolizată din sfeclă de zahăr, condimente, extracte de condimente), PRAF DE OUĂ), ulei de floarea-soarelui (antispumant: E900).";

const WINGS_ING =
  "Aripioare de pui (origine: România), marinadă picantă (amestec de condimente (sare, glucoză, proteină vegetală hidrolizată din sfeclă de zahăr, condimente, extracte de condimente), sare, extract de ardei iute, ardei iute, potențiator de aromă: E621, stabilizator: E450), pesmet (făină de GRÂU, agenți de afânare: E500, E450, LAPTE praf degresat, potențiator de aromă: E621, amestec de condimente (sare, făină de GRÂU, proteină vegetală hidrolizată din sfeclă de zahăr, condimente, extracte de condimente), PRAF DE OUĂ), ulei de floarea-soarelui (antispumant: E900).";

const CHIFLA_ING =
  "Făină albă de GRÂU, apă, zahăr, ulei rafinat de floarea-soarelui, topping glazură (proteină vegetală, dextroză, amidon), drojdie, sare iodată, aromă naturală, ameliorator (emulsifiant: E472e, antioxidant: E300), enzime, condiment: curcuma.";

const CHEDDAR_ING =
  "Brânză cheddar 51%, brânză 15%, LAPTE degresat, UNT, LAPTE praf degresat, săruri de topire (citrați de sodiu, fosfați de sodiu), proteine din LAPTE, ZER praf, sare, corector de aciditate (acid lactic), coloranți (caroteni, extract de ardei roșu), conservant (acid sorbic), agent antiaglomerant (lecitină din floarea-soarelui).";

const CARTOFI_ING =
  "Cartofi (90%), ulei de floarea-soarelui (5%), acoperire (4,5%) (amidon modificat, făină de orez, dextrină, agent de îngroșare: gumă xantan), sare. Prăjiți în ulei de floarea-soarelui (antispumant: E900). Condiment: sare, boia de ardei dulce.";

const CASTRAVETI_ING = "În curs de confirmare — eticheta furnizorului nu a putut fi citită integral.";

const COLESLAW_ING =
  "Varză albă și morcovi, maioneză (ulei de rapiță, apă, gălbenuș de OU, oțet din alcool, zahăr, sare, agent de îngroșare: gumă xantan, concentrat de suc de lămâie, aromă, antioxidant: E385, extract de paprika), zahăr, sare, MUȘTAR (apă, oțet din alcool, semințe de MUȘTAR, zahăr, sirop de zahăr caramelizat, turmeric, semințe de coriandru, nucșoară, maghiran, arome, piper negru, chimen, foi de dafin, sare), oțet alb, piper.";

const BAUTURA_ING =
  "Pepsi, Pepsi Max, Pepsi Twist, Mirinda sau 7UP – doză 330 ml. Ingrediente conform etichetei de pe doză (în curs de confirmare pentru fiecare sortiment).";

const VEZI_SOSURI = "Vezi secțiunea Sosuri (pag. finale).";

// Allergen code shorthands (see ALLERGEN_NAMES): 1 gluten · 3 ouă · 4 pește ·
// 6 soia · 7 lapte · 8 fructe cu coajă lemnoasă · 9 țelină · 10 muștar ·
// 11 susan · 12 sulfiți

const CRISPY_CERTAIN = [1, 3, 7];
const CRISPY_POSSIBLE = [4, 6, 8, 10];

// ---------------------------------------------------------------------------
// 1. Crispy uri
// ---------------------------------------------------------------------------

function crispyProduct(n: 3 | 4 | 5 | 6): Product {
  const sosLine: RecipeLine =
    n <= 4
      ? { label: "Sos mic la alegere", gramaj: "60 g", ingredients: VEZI_SOSURI }
      : { label: "Sos mare la alegere", gramaj: "150 g", ingredients: VEZI_SOSURI };
  const stripsGramaj = n * 70;
  const total = stripsGramaj + parseInt(sosLine.gramaj, 10);
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
    totalGramaj: `${total} g`,
    certain: CRISPY_CERTAIN,
    possible: CRISPY_POSSIBLE,
  };
}

export const crispyCategory: ProductCategory = {
  title: "Crispy uri",
  products: [crispyProduct(3), crispyProduct(4), crispyProduct(5), crispyProduct(6)],
};

// ---------------------------------------------------------------------------
// 2. Wingsuri (Utopia Wings, picante)
// ---------------------------------------------------------------------------

function wingsProduct(n: 3 | 5 | 8): Product {
  const sosLine: RecipeLine =
    n <= 5
      ? { label: "Sos mic la alegere", gramaj: "60 g", ingredients: VEZI_SOSURI }
      : { label: "Sos mare la alegere", gramaj: "150 g", ingredients: VEZI_SOSURI };
  const wingsGramaj = n * 50;
  const total = wingsGramaj + parseInt(sosLine.gramaj, 10);
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
    totalGramaj: `${total} g`,
    certain: CRISPY_CERTAIN,
    possible: CRISPY_POSSIBLE,
    extraNote: "Aripioarele se prepară doar în varianta picantă.",
  };
}

export const wingsCategory: ProductCategory = {
  title: "Wingsuri",
  products: [wingsProduct(3), wingsProduct(5), wingsProduct(8)],
};

// ---------------------------------------------------------------------------
// 3. Famous Wings (glazurate cu miere)
// ---------------------------------------------------------------------------

function famousWingsProduct(n: 3 | 5 | 8): Product {
  const wingsGramaj = n * 50;
  return {
    name: `${n} Famous Wings`,
    lines: [
      {
        label: `Wings picante (${n} buc. x 50 g)`,
        gramaj: `${wingsGramaj} g`,
        ingredients: WINGS_ING,
      },
      { label: "Glazură de miere", gramaj: "sub 20 g", ingredients: "Miere de tei." },
    ],
    totalGramaj: `${wingsGramaj} g`,
    certain: CRISPY_CERTAIN,
    possible: [6],
    extraNote: "Aripioarele se prepară doar în varianta picantă.",
  };
}

export const famousWingsCategory: ProductCategory = {
  title: "Famous Wings",
  products: [famousWingsProduct(3), famousWingsProduct(5), famousWingsProduct(8)],
};

// ---------------------------------------------------------------------------
// 4. Burgers
// ---------------------------------------------------------------------------

const BURGER_FROZEN_NOTE = "Conține produse congelate: chiflă (decongelată înainte de servire).";
const CHEDDAR_LINE: RecipeLine = {
  label: "Cheddar (2 felii x 12,5 g)",
  gramaj: "25 g",
  ingredients: CHEDDAR_ING,
};
const CASTRAVETI_LINE: RecipeLine = {
  label: "Castraveți murați",
  gramaj: "sub 20 g",
  ingredients: CASTRAVETI_ING,
  incomplete: true,
};
const CHIFLA_LINE: RecipeLine = { label: "Chiflă brioche", gramaj: "70 g", ingredients: CHIFLA_ING };
const CRISPY_2_LINE: RecipeLine = {
  label: "Crispy strips (2 buc. x 70 g)",
  gramaj: "140 g",
  ingredients: CRISPY_STRIPS_ING,
};

export const burgersCategory: ProductCategory = {
  title: "Burgers",
  intro:
    "Fiecare burger cântărește cca. 350 g asamblat (produs cântărit, nu turnat din rețetă fixă).",
  products: [
    {
      name: "Clasic Burger",
      lines: [
        CHIFLA_LINE,
        CRISPY_2_LINE,
        {
          label: "Sos maioneză",
          gramaj: "[în curs de confirmare]",
          ingredients:
            "Maioneză (ulei de rapiță, apă, gălbenuș de OU, oțet din alcool, zahăr, sare, agent de îngroșare: gumă xantan, concentrat de suc de lămâie, aromă, antioxidant: E385, extract de paprika), apă.",
          incomplete: true,
        },
        CASTRAVETI_LINE,
        CHEDDAR_LINE,
      ],
      totalGramaj: "cca. 350 g (produs asamblat, cântărit)",
      certain: [1, 3, 7],
      possible: [6, 11],
      frozenNote: BURGER_FROZEN_NOTE,
    },
    {
      name: "Spicy Burger",
      lines: [
        CHIFLA_LINE,
        CRISPY_2_LINE,
        {
          label: "Maioneză picantă",
          gramaj: "[în curs de confirmare]",
          ingredients:
            "Maioneză (ulei de rapiță, apă, gălbenuș de OU, oțet din alcool, zahăr, sare, agent de îngroșare: gumă xantan, concentrat de suc de lămâie, aromă, antioxidant: E385, extract de paprika), apă, sos de ardei iute (ardei iute fermentat, oțet de alcool, apă, sare, praf de usturoi), ardei iuți mărunțiți.",
          incomplete: true,
        },
        CASTRAVETI_LINE,
        CHEDDAR_LINE,
      ],
      totalGramaj: "cca. 350 g (produs asamblat, cântărit)",
      certain: [1, 3, 7],
      possible: [6, 11],
      frozenNote: BURGER_FROZEN_NOTE,
    },
    {
      name: "Honey Heat Burger",
      lines: [
        CHIFLA_LINE,
        CRISPY_2_LINE,
        {
          label: "Sos maioneză",
          gramaj: "[în curs de confirmare]",
          ingredients:
            "Maioneză (ulei de rapiță, apă, gălbenuș de OU, oțet din alcool, zahăr, sare, agent de îngroșare: gumă xantan, concentrat de suc de lămâie, aromă, antioxidant: E385, extract de paprika), apă.",
          incomplete: true,
        },
        { label: "Glazură de miere", gramaj: "sub 20 g", ingredients: "Miere de tei." },
        { label: "Salată iceberg", gramaj: "sub 20 g", ingredients: "Salată iceberg proaspătă." },
        CHEDDAR_LINE,
      ],
      totalGramaj: "cca. 350 g (produs asamblat, cântărit)",
      certain: [1, 3, 7],
      possible: [6, 11],
      frozenNote: BURGER_FROZEN_NOTE,
    },
    {
      name: "Honey Mustard Burger",
      lines: [
        CHIFLA_LINE,
        CRISPY_2_LINE,
        {
          label: "Sos honey mustard",
          gramaj: "[în curs de confirmare]",
          ingredients:
            "Maioneză (ulei de rapiță, apă, gălbenuș de OU, oțet din alcool, zahăr, sare, agent de îngroșare: gumă xantan, concentrat de suc de lămâie, aromă, antioxidant: E385, extract de paprika), miere, MUȘTAR (apă, oțet din alcool, semințe de MUȘTAR, zahăr, sirop de zahăr caramelizat, turmeric, semințe de coriandru, nucșoară, maghiran, arome, piper negru, chimen, foi de dafin, sare).",
          incomplete: true,
        },
        CASTRAVETI_LINE,
        CHEDDAR_LINE,
      ],
      totalGramaj: "cca. 350 g (produs asamblat, cântărit)",
      certain: [1, 3, 7, 10],
      possible: [6, 11],
      frozenNote: BURGER_FROZEN_NOTE,
    },
    {
      name: "Southern Burger",
      lines: [
        CHIFLA_LINE,
        CRISPY_2_LINE,
        {
          label: "Sos maioneză",
          gramaj: "[în curs de confirmare]",
          ingredients:
            "Maioneză (ulei de rapiță, apă, gălbenuș de OU, oțet din alcool, zahăr, sare, agent de îngroșare: gumă xantan, concentrat de suc de lămâie, aromă, antioxidant: E385, extract de paprika), apă.",
          incomplete: true,
        },
        {
          label: "Salată coleslaw",
          gramaj: "[în curs de confirmare]",
          ingredients: COLESLAW_ING,
          incomplete: true,
        },
        CASTRAVETI_LINE,
        CHEDDAR_LINE,
      ],
      totalGramaj: "cca. 350 g (produs asamblat, cântărit)",
      certain: [1, 3, 7, 10],
      possible: [6, 11],
      frozenNote: BURGER_FROZEN_NOTE,
    },
    {
      name: "Sour-Cherry Burger",
      lines: [
        CHIFLA_LINE,
        CRISPY_2_LINE,
        {
          label: "Sos sour-cherry",
          gramaj: "[în curs de confirmare]",
          ingredients:
            "Maioneză (ulei de rapiță, apă, gălbenuș de OU, oțet din alcool, zahăr, sare, agent de îngroșare: gumă xantan, concentrat de suc de lămâie, aromă, antioxidant: E385, extract de paprika), dulceață de vișine (vișine, zahăr, sirop de glucoză-fructoză, gelifiant: pectină, acidifiant: acid citric, conservant: E202), apă.",
          incomplete: true,
        },
        {
          label: "Ceapă crocantă",
          gramaj: "sub 20 g",
          ingredients:
            "Ceapă (poate conține SULFIȚI), grăsime de palmier, făină de GRÂU, amidon din GRÂU, sare.",
        },
        CHEDDAR_LINE,
      ],
      totalGramaj: "cca. 350 g (produs asamblat, cântărit)",
      certain: [1, 3, 7],
      possible: [6, 11, 12],
      frozenNote: BURGER_FROZEN_NOTE,
      extraNote: "Sosul poate conține sâmburi sau fragmente de sâmburi de vișină.",
    },
    {
      name: "Garlic Parmesan Burger",
      lines: [
        CHIFLA_LINE,
        CRISPY_2_LINE,
        {
          label: "Sos garlic mayo",
          gramaj: "[în curs de confirmare]",
          ingredients:
            "Maioneză (ulei de rapiță, apă, gălbenuș de OU, oțet din alcool, zahăr, sare, agent de îngroșare: gumă xantan, concentrat de suc de lămâie, aromă, antioxidant: E385, extract de paprika), iaurt grecesc (LAPTE de vacă pasteurizat, smântână din LAPTE, proteine din LAPTE, culturi lactice), apă, usturoi granulat.",
          incomplete: true,
        },
        {
          label: "Parmezan ras",
          gramaj: "sub 20 g",
          ingredients: "Mix de brânzeturi tari rase: LAPTE, sare, cheag, conservant: lizozimă din OUĂ.",
        },
        CASTRAVETI_LINE,
        CHEDDAR_LINE,
      ],
      totalGramaj: "cca. 350 g (produs asamblat, cântărit)",
      certain: [1, 3, 7],
      possible: [6, 9, 10, 11],
      frozenNote: BURGER_FROZEN_NOTE,
    },
    {
      name: "Cheesy Burger",
      lines: [
        CHIFLA_LINE,
        CRISPY_2_LINE,
        {
          label: "Sos cheddar",
          gramaj: "[în curs de confirmare]",
          ingredients: "Sos cheddar (ingrediente în curs de confirmare de pe eticheta furnizorului), apă.",
          incomplete: true,
        },
        { label: "Salată iceberg", gramaj: "sub 20 g", ingredients: "Salată iceberg proaspătă." },
        CASTRAVETI_LINE,
        CHEDDAR_LINE,
      ],
      totalGramaj: "cca. 350 g (produs asamblat, cântărit)",
      certain: [1, 3, 7],
      possible: [6, 11],
      frozenNote: BURGER_FROZEN_NOTE,
    },
    {
      name: "Truffle Burger",
      lines: [
        CHIFLA_LINE,
        CRISPY_2_LINE,
        {
          label: "Sos trufe",
          gramaj: "[în curs de confirmare]",
          ingredients:
            "Maioneză (ulei de rapiță, apă, gălbenuș de OU, oțet din alcool, zahăr, sare, agent de îngroșare: gumă xantan, concentrat de suc de lămâie, aromă, antioxidant: E385, extract de paprika), cremă de ciuperci cu trufe (ciuperci champignon, ulei de măsline extravirgin, trufă neagră de vară, hribi, sare, pătrunjel, usturoi, piper negru, aromă), apă.",
          incomplete: true,
        },
        {
          label: "Ceapă crocantă",
          gramaj: "sub 20 g",
          ingredients:
            "Ceapă (poate conține SULFIȚI), grăsime de palmier, făină de GRÂU, amidon din GRÂU, sare.",
        },
        CASTRAVETI_LINE,
        CHEDDAR_LINE,
      ],
      totalGramaj: "cca. 350 g (produs asamblat, cântărit)",
      certain: [1, 3, 7],
      possible: [4, 6, 8, 10, 11, 12],
      frozenNote: BURGER_FROZEN_NOTE,
    },
  ],
};

// ---------------------------------------------------------------------------
// 5. Deals
// ---------------------------------------------------------------------------

const CARTOFI_MEDII_LINE: RecipeLine = { label: "Cartofi medii", gramaj: "150 g", ingredients: CARTOFI_ING };
const BAUTURA_LINE: RecipeLine = {
  label: "Băutură răcoritoare la alegere (doză 330 ml)",
  gramaj: "330 ml",
  ingredients: BAUTURA_ING,
  incomplete: true,
};
const BURGER_ALEGERE_LINE: RecipeLine = {
  label: "Burger la alegere",
  gramaj: "350 g",
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
      frozenNote: "Conține produs congelat: cartofii prăjiți.",
    },
    {
      name: "Perfect Deal",
      lines: [
        BURGER_ALEGERE_LINE,
        { label: "2 Crispy Strips", gramaj: "140 g", ingredients: "Vezi fișa 2 Crispy Strips." },
        CARTOFI_MEDII_LINE,
        BAUTURA_LINE,
      ],
      totalGramaj: "640 g + 330 ml",
      certain: [1, 3, 7, 10],
      possible: [4, 6, 8, 9, 11, 12],
      frozenNote: BURGER_FROZEN_NOTE + " Conține produs congelat: cartofii prăjiți.",
    },
    {
      name: "Wings Deal",
      lines: [
        BURGER_ALEGERE_LINE,
        { label: "3 Wings", gramaj: "150 g", ingredients: "Vezi fișa 3 Wings." },
        CARTOFI_MEDII_LINE,
        BAUTURA_LINE,
      ],
      totalGramaj: "650 g + 330 ml",
      certain: [1, 3, 7, 10],
      possible: [4, 6, 8, 9, 11, 12],
      frozenNote: BURGER_FROZEN_NOTE + " Conține produs congelat: cartofii prăjiți.",
    },
    {
      name: "Duo Perfect Deal",
      lines: [
        { label: "2 Burgeri la alegere", gramaj: "700 g", ingredients: "Vezi secțiunea Burgers — alegi orice 2 rețete din listă." },
        { label: "4 Crispy Strips", gramaj: "280 g", ingredients: "Vezi fișa 4 Crispy Strips." },
        { label: "Cartofi medii (2 porții)", gramaj: "300 g", ingredients: CARTOFI_ING },
        { label: "Băutură răcoritoare la alegere (doză 330 ml)", gramaj: "2 x 330 ml", ingredients: BAUTURA_ING, incomplete: true },
      ],
      totalGramaj: "1280 g + 660 ml",
      certain: [1, 3, 7, 10],
      possible: [4, 6, 8, 9, 11, 12],
      frozenNote: BURGER_FROZEN_NOTE + " Conține produs congelat: cartofii prăjiți.",
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
      totalGramaj: "940 g + 330 ml",
      certain: [1, 3, 7, 10],
      possible: [4, 6, 8, 9, 11, 12],
      frozenNote: BURGER_FROZEN_NOTE + " Conține produs congelat: cartofii prăjiți.",
    },
    {
      name: "Special Deal",
      lines: [
        { label: "3 Crispy Strips", gramaj: "210 g", ingredients: "Vezi fișa 3 Crispy Strips." },
        { label: "3 Famous Wings", gramaj: "150 g", ingredients: "Vezi fișa 3 Famous Wings." },
        CARTOFI_MEDII_LINE,
        BAUTURA_LINE,
      ],
      totalGramaj: "510 g + 330 ml",
      certain: [1, 3, 7],
      possible: [6, 9, 10, 11],
      frozenNote: "Conține produs congelat: cartofii prăjiți.",
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
      frozenNote: "Conține produs congelat: cartofii prăjiți.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 6. Combo (menus)
// ---------------------------------------------------------------------------

const COMBO_CERTAIN_NO_MUSTAR = [1, 3, 7];
const COMBO_POSSIBLE_NO_MUSTAR = [4, 6, 8, 9, 10, 11];

export const comboCategory: ProductCategory = {
  title: "Combo",
  products: [
    {
      name: "3 Crispy Menu",
      lines: [
        { label: "3 Crispy Strips", gramaj: "210 g", ingredients: "Vezi fișa 3 Crispy Strips." },
        CARTOFI_MEDII_LINE,
        { label: "Sos mic la alegere", gramaj: "60 g", ingredients: VEZI_SOSURI },
        BAUTURA_LINE,
      ],
      totalGramaj: "420 g + 330 ml",
      certain: COMBO_CERTAIN_NO_MUSTAR,
      possible: COMBO_POSSIBLE_NO_MUSTAR,
      frozenNote: "Conține produs congelat: cartofii prăjiți.",
    },
    {
      name: "4 Crispy Menu",
      lines: [
        { label: "4 Crispy Strips", gramaj: "280 g", ingredients: "Vezi fișa 4 Crispy Strips." },
        CARTOFI_MEDII_LINE,
        { label: "Sos mic la alegere", gramaj: "60 g", ingredients: VEZI_SOSURI },
        BAUTURA_LINE,
      ],
      totalGramaj: "490 g + 330 ml",
      certain: COMBO_CERTAIN_NO_MUSTAR,
      possible: COMBO_POSSIBLE_NO_MUSTAR,
      frozenNote: "Conține produs congelat: cartofii prăjiți.",
    },
    {
      name: "5 Crispy Menu",
      lines: [
        { label: "5 Crispy Strips", gramaj: "350 g", ingredients: "Vezi fișa 5 Crispy Strips." },
        CARTOFI_MEDII_LINE,
        { label: "Sos mare la alegere", gramaj: "150 g", ingredients: VEZI_SOSURI },
        BAUTURA_LINE,
      ],
      totalGramaj: "650 g + 330 ml",
      certain: COMBO_CERTAIN_NO_MUSTAR,
      possible: COMBO_POSSIBLE_NO_MUSTAR,
      frozenNote: "Conține produs congelat: cartofii prăjiți.",
    },
    {
      name: "6 Crispy Menu",
      lines: [
        { label: "6 Crispy Strips", gramaj: "420 g", ingredients: "Vezi fișa 6 Crispy Strips." },
        CARTOFI_MEDII_LINE,
        { label: "Sos mare la alegere", gramaj: "150 g", ingredients: VEZI_SOSURI },
        BAUTURA_LINE,
      ],
      totalGramaj: "720 g + 330 ml",
      certain: COMBO_CERTAIN_NO_MUSTAR,
      possible: COMBO_POSSIBLE_NO_MUSTAR,
      frozenNote: "Conține produs congelat: cartofii prăjiți.",
    },
    {
      name: "3 Wings Menu",
      lines: [
        { label: "3 Wings", gramaj: "150 g", ingredients: "Vezi fișa 3 Wings." },
        CARTOFI_MEDII_LINE,
        { label: "Sos mic la alegere", gramaj: "60 g", ingredients: VEZI_SOSURI },
        BAUTURA_LINE,
      ],
      totalGramaj: "360 g + 330 ml",
      certain: COMBO_CERTAIN_NO_MUSTAR,
      possible: COMBO_POSSIBLE_NO_MUSTAR,
      frozenNote: "Conține produs congelat: cartofii prăjiți.",
    },
    {
      name: "5 Wings Menu",
      lines: [
        { label: "5 Wings", gramaj: "250 g", ingredients: "Vezi fișa 5 Wings." },
        CARTOFI_MEDII_LINE,
        { label: "Sos mic la alegere", gramaj: "60 g", ingredients: VEZI_SOSURI },
        BAUTURA_LINE,
      ],
      totalGramaj: "460 g + 330 ml",
      certain: COMBO_CERTAIN_NO_MUSTAR,
      possible: COMBO_POSSIBLE_NO_MUSTAR,
      frozenNote: "Conține produs congelat: cartofii prăjiți.",
    },
    {
      name: "8 Wings Menu",
      lines: [
        { label: "8 Wings", gramaj: "400 g", ingredients: "Vezi fișa 8 Wings." },
        CARTOFI_MEDII_LINE,
        { label: "Sos mare la alegere", gramaj: "150 g", ingredients: VEZI_SOSURI },
        BAUTURA_LINE,
      ],
      totalGramaj: "700 g + 330 ml",
      certain: COMBO_CERTAIN_NO_MUSTAR,
      possible: COMBO_POSSIBLE_NO_MUSTAR,
      frozenNote: "Conține produs congelat: cartofii prăjiți.",
    },
    {
      name: "Burger Menu",
      lines: [
        BURGER_ALEGERE_LINE,
        CARTOFI_MEDII_LINE,
        { label: "Sos mic la alegere", gramaj: "60 g", ingredients: VEZI_SOSURI },
        BAUTURA_LINE,
      ],
      totalGramaj: "560 g + 330 ml",
      certain: [1, 3, 7, 10],
      possible: [4, 6, 8, 9, 11, 12],
      frozenNote: BURGER_FROZEN_NOTE + " Conține produs congelat: cartofii prăjiți.",
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
      certain: [1, 3, 7, 10],
      possible: [4, 6, 8, 9, 11],
      frozenNote: "Conține produs congelat: cartofii prăjiți.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 7. One Bite First Time
// ---------------------------------------------------------------------------

function oneBiteProduct(name: string, fisa: string, gramaj: string): Product {
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
        incomplete: true,
      },
    ],
    totalGramaj: `${gramaj} + 150 g (cu cartofi) sau ${gramaj} + 330 ml (cu suc) — se alege o singură variantă`,
    certain: [1, 3, 7],
    possible: [6, 9, 10, 11],
    frozenNote: "Conține produs congelat: cartofii prăjiți (dacă alegi varianta cu cartofi).",
  };
}

export const oneBiteCategory: ProductCategory = {
  title: "One Bite First Time",
  intro: "Se alege una dintre cele două variante de completare: cartofi medii sau băutură răcoritoare.",
  products: [
    oneBiteProduct("2 Crispy + cartofi medii sau suc", "2 Crispy Strips", "140 g"),
    oneBiteProduct("3 Wings + cartofi medii sau suc", "3 Wings", "150 g"),
    oneBiteProduct("3 Famous Wings + cartofi medii sau suc", "3 Famous Wings", "150 g"),
  ],
};

// ---------------------------------------------------------------------------
// 8. Buckets
// ---------------------------------------------------------------------------

const BUCKET_POSSIBLE_MUSTAR = [4, 6, 8, 9, 10, 11];

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
      certain: [1, 3, 7],
      possible: BUCKET_POSSIBLE_MUSTAR,
      frozenNote: "Conține produs congelat: cartofii prăjiți.",
    },
    {
      name: "Crispy Bucket",
      lines: [
        { label: "10 Crispy Strips (10 buc. x 70 g)", gramaj: "700 g", ingredients: CRISPY_STRIPS_ING },
        { label: "Cartofi mari", gramaj: "250 g", ingredients: CARTOFI_ING },
        { label: "Sos mare la alegere", gramaj: "150 g", ingredients: VEZI_SOSURI },
      ],
      totalGramaj: "1100 g",
      certain: [1, 3, 7],
      possible: BUCKET_POSSIBLE_MUSTAR,
      frozenNote: "Conține produs congelat: cartofii prăjiți.",
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
      certain: [1, 3, 7],
      possible: BUCKET_POSSIBLE_MUSTAR,
      frozenNote: "Conține produs congelat: cartofii prăjiți.",
    },
    {
      name: "Friends Bucket",
      lines: [
        { label: "10 Crispy Strips (10 buc. x 70 g)", gramaj: "700 g", ingredients: CRISPY_STRIPS_ING },
        { label: "10 Wings (10 buc. x 50 g)", gramaj: "500 g", ingredients: WINGS_ING },
        { label: "Cartofi mari (2 porții)", gramaj: "500 g", ingredients: CARTOFI_ING },
        { label: "2 sosuri mari la alegere", gramaj: "300 g", ingredients: VEZI_SOSURI },
        { label: "Băutură răcoritoare la alegere (doză 330 ml)", gramaj: "2 x 330 ml", ingredients: BAUTURA_ING, incomplete: true },
      ],
      totalGramaj: "2000 g + 660 ml",
      certain: [1, 3, 7],
      possible: BUCKET_POSSIBLE_MUSTAR,
      frozenNote: "Conține produs congelat: cartofii prăjiți.",
    },
    {
      name: "Friends Crispy Bucket",
      lines: [
        { label: "20 Crispy Strips (20 buc. x 70 g)", gramaj: "1400 g", ingredients: CRISPY_STRIPS_ING },
        { label: "Cartofi mari (2 porții)", gramaj: "500 g", ingredients: CARTOFI_ING },
        { label: "2 sosuri mari la alegere", gramaj: "300 g", ingredients: VEZI_SOSURI },
        { label: "Băutură răcoritoare la alegere (doză 330 ml)", gramaj: "2 x 330 ml", ingredients: BAUTURA_ING, incomplete: true },
      ],
      totalGramaj: "2200 g + 660 ml",
      certain: [1, 3, 7],
      possible: BUCKET_POSSIBLE_MUSTAR,
      frozenNote: "Conține produs congelat: cartofii prăjiți.",
    },
    {
      name: "Friends Wings Bucket",
      lines: [
        { label: "20 Wings picante (20 buc. x 50 g)", gramaj: "1000 g", ingredients: WINGS_ING },
        { label: "Cartofi mari (2 porții)", gramaj: "500 g", ingredients: CARTOFI_ING },
        { label: "2 sosuri mari la alegere", gramaj: "300 g", ingredients: VEZI_SOSURI },
      ],
      totalGramaj: "1800 g",
      certain: [1, 3, 7],
      possible: BUCKET_POSSIBLE_MUSTAR,
      frozenNote: "Conține produs congelat: cartofii prăjiți.",
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
      certain: [1, 3, 7, 10],
      possible: [4, 6, 8, 9, 11],
      frozenNote: "Conține produs congelat: cartofii prăjiți.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 9. Sides
// ---------------------------------------------------------------------------

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
      frozenNote: "Conține produs congelat: cartofii prăjiți.",
    },
    {
      name: "Cartofi mari",
      lines: [{ label: "Cartofi prăjiți", gramaj: "250 g", ingredients: CARTOFI_ING }],
      totalGramaj: "250 g",
      certain: null,
      possible: [1, 3, 6, 7, 9, 10, 11],
      noMajorAllergens: true,
      frozenNote: "Conține produs congelat: cartofii prăjiți.",
    },
    {
      name: "Upgrade Usturoi + Parmezan",
      lines: [
        {
          label: "Usturoi și parmezan (upgrade)",
          gramaj: "[în curs de confirmare]",
          ingredients:
            "Usturoi granulat, mix de brânzeturi tari rase (LAPTE, sare, cheag, conservant: lizozimă din OUĂ).",
          incomplete: true,
        },
      ],
      totalGramaj: "[în curs de confirmare]",
      certain: [3, 7],
      possible: [1, 6, 9, 10, 11],
    },
    {
      name: "Salată coleslaw",
      lines: [{ label: "Salată coleslaw", gramaj: "80 g", ingredients: COLESLAW_ING }],
      totalGramaj: "80 g",
      certain: [3, 10],
      possible: null,
    },
  ],
};

// ---------------------------------------------------------------------------
// 10. Sosuri (porție mică 60 g / porție mare 150 g)
// ---------------------------------------------------------------------------

const MAIONEZA_BASE =
  "Maioneză (ulei de rapiță, apă, gălbenuș de OU, oțet din alcool, zahăr, sare, agent de îngroșare: gumă xantan, concentrat de suc de lămâie, aromă, antioxidant: E385, extract de paprika)";

export const sosuriCategory: ProductCategory = {
  title: "Sosuri",
  intro:
    "Porție mică: 60 g. Porție mare: 150 g. Sosurile sunt preparate în restaurant; aceleași sosuri se folosesc și la burgeri, și la meniuri.",
  products: [
    {
      name: "Sos maioneză",
      lines: [{ label: "Sos maioneză", gramaj: "60 g / 150 g", ingredients: `${MAIONEZA_BASE}, apă.` }],
      totalGramaj: "60 g / 150 g",
      certain: [3],
      possible: null,
    },
    {
      name: "Maioneză picantă",
      lines: [
        {
          label: "Maioneză picantă",
          gramaj: "60 g / 150 g",
          ingredients: `${MAIONEZA_BASE}, apă, sos de ardei iute (ardei iute fermentat, oțet de alcool, apă, sare, praf de usturoi), ardei iuți mărunțiți.`,
        },
      ],
      totalGramaj: "60 g / 150 g",
      certain: [3],
      possible: null,
    },
    {
      name: "Sos honey mustard",
      lines: [
        {
          label: "Sos honey mustard",
          gramaj: "60 g / 150 g",
          ingredients: `${MAIONEZA_BASE}, miere, MUȘTAR (apă, oțet din alcool, semințe de MUȘTAR, zahăr, sirop de zahăr caramelizat, turmeric, semințe de coriandru, nucșoară, maghiran, arome, piper negru, chimen, foi de dafin, sare).`,
        },
      ],
      totalGramaj: "60 g / 150 g",
      certain: [3, 10],
      possible: null,
    },
    {
      name: "Garlic mayo",
      lines: [
        {
          label: "Garlic mayo",
          gramaj: "60 g / 150 g",
          ingredients: `${MAIONEZA_BASE}, iaurt grecesc (LAPTE de vacă pasteurizat, smântână din LAPTE, proteine din LAPTE, culturi lactice), apă, usturoi granulat.`,
        },
      ],
      totalGramaj: "60 g / 150 g",
      certain: [3, 7],
      possible: [1, 6, 9, 10, 11],
    },
    {
      name: "Sos trufe",
      lines: [
        {
          label: "Sos trufe",
          gramaj: "60 g / 150 g",
          ingredients: `${MAIONEZA_BASE}, cremă de ciuperci cu trufe (ciuperci champignon, ulei de măsline extravirgin, trufă neagră de vară, hribi, sare, pătrunjel, usturoi, piper negru, aromă), apă.`,
        },
      ],
      totalGramaj: "60 g / 150 g",
      certain: [3],
      possible: [4, 6, 7, 8, 10],
      extraNote: "Poate conține urme de fructe cu coajă lemnoasă din familia caju/fistic.",
    },
    {
      name: "Sos sour-cherry",
      lines: [
        {
          label: "Sos sour-cherry",
          gramaj: "60 g / 150 g",
          ingredients: `${MAIONEZA_BASE}, dulceață de vișine (vișine, zahăr, sirop de glucoză-fructoză, gelifiant: pectină, acidifiant: acid citric, conservant: E202), apă.`,
        },
      ],
      totalGramaj: "60 g / 150 g",
      certain: [3],
      possible: null,
      extraNote: "Poate conține sâmburi sau fragmente de sâmburi de vișină.",
    },
    {
      name: "Sos cheddar",
      lines: [
        {
          label: "Sos cheddar",
          gramaj: "60 g / 150 g",
          ingredients: "Sos cheddar (ingrediente în curs de confirmare de pe eticheta furnizorului), apă.",
          incomplete: true,
        },
      ],
      totalGramaj: "60 g / 150 g",
      certain: [7],
      possible: null,
    },
    {
      name: "Sos Utopia",
      lines: [
        {
          label: "Sos Utopia",
          gramaj: "60 g / 150 g",
          ingredients:
            `${MAIONEZA_BASE}, iaurt grecesc (LAPTE de vacă pasteurizat, smântână din LAPTE, proteine din LAPTE, culturi lactice), MUȘTAR (apă, oțet din alcool, semințe de MUȘTAR, zahăr, sirop de zahăr caramelizat, turmeric, semințe de coriandru, nucșoară, maghiran, arome, piper negru, chimen, foi de dafin, sare), ketchup, sos barbecue, zahăr, miere, oțet, sos Worcestershire, condimente (piper, usturoi granulat, sare, boia).`,
          incomplete: true,
        },
      ],
      totalGramaj: "60 g / 150 g",
      certain: [3, 7, 10],
      possible: null,
      extraNote:
        "Ketchup-ul, sosul barbecue și sosul Worcestershire folosite sunt în curs de confirmare pe eticheta furnizorului — sosul Worcestershire conține de regulă PEȘTE.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 11. Răcoritoare
// ---------------------------------------------------------------------------

export const racoritoareCategory: ProductCategory = {
  title: "Răcoritoare",
  products: [
    {
      name: "Pepsi (doză)",
      lines: [{ label: "Pepsi", gramaj: "330 ml", ingredients: "Ingrediente conform etichetei de pe doză (în curs de confirmare)." }],
      totalGramaj: "330 ml",
      certain: null,
      possible: null,
      skipAllergenFooter: true,
    },
    {
      name: "Pepsi Max (doză)",
      lines: [{ label: "Pepsi Max", gramaj: "330 ml", ingredients: "Ingrediente conform etichetei de pe doză (în curs de confirmare)." }],
      totalGramaj: "330 ml",
      certain: null,
      possible: null,
      skipAllergenFooter: true,
      extraNote: "Conține o sursă de fenilalanină.",
    },
    {
      name: "Pepsi Twist (doză)",
      lines: [{ label: "Pepsi Twist", gramaj: "330 ml", ingredients: "Ingrediente conform etichetei de pe doză (în curs de confirmare)." }],
      totalGramaj: "330 ml",
      certain: null,
      possible: null,
      skipAllergenFooter: true,
    },
    {
      name: "Mirinda (doză)",
      lines: [{ label: "Mirinda", gramaj: "330 ml", ingredients: "Ingrediente conform etichetei de pe doză (în curs de confirmare)." }],
      totalGramaj: "330 ml",
      certain: null,
      possible: null,
      skipAllergenFooter: true,
    },
    {
      name: "7UP (doză)",
      lines: [{ label: "7UP", gramaj: "330 ml", ingredients: "Ingrediente conform etichetei de pe doză (în curs de confirmare)." }],
      totalGramaj: "330 ml",
      certain: null,
      possible: null,
      skipAllergenFooter: true,
    },
    {
      name: "Apă plată Aqua Carpatica",
      lines: [{ label: "Apă plată Aqua Carpatica", gramaj: "500 ml", ingredients: "Apă minerală naturală plată." }],
      totalGramaj: "500 ml",
      certain: null,
      possible: null,
      skipAllergenFooter: true,
    },
    {
      name: "Apă minerală Aqua Carpatica",
      lines: [{ label: "Apă minerală Aqua Carpatica", gramaj: "500 ml", ingredients: "Apă minerală naturală carbogazoasă." }],
      totalGramaj: "500 ml",
      certain: null,
      possible: null,
      skipAllergenFooter: true,
    },
  ],
};

// ---------------------------------------------------------------------------
// 12. Informații importante (verbatim din documentul sursă)
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
    title: "Brânzeturi",
    body: "Produsele care conțin brânză pot conține brânză specială, mozzarella, alte lactate sau grăsimi vegetale. Te rugăm să întrebi personalul din restaurant cu privire la tipul de brânzeturi utilizate.",
  },
  {
    title: "Sosuri",
    body: "Sosurile sunt preparate în restaurant din ingrediente cumpărate. Proporțiile rețetelor sunt confidențiale; lista completă a ingredientelor fiecărui sos este în secțiunea Sosuri.",
  },
  {
    title: "Băuturi",
    body: "Răcoritoarele se servesc la doză de 330 ml, în ambalajul original al producătorului. Apa este Aqua Carpatica 500 ml.",
  },
  {
    title: "Alergeni",
    body: "Informațiile despre alergeni provin de pe etichetele furnizorilor. În absența unui termen specific, recomandăm consumarea produselor noastre în stare proaspătă.",
  },
  {
    title: "Valabilitate",
    body: "Aceste informații sunt valabile din 03.09.2026 și se actualizează la fiecare schimbare de rețetă, furnizor sau meniu. Rețetele și proporțiile sunt proprietatea UTOPIA BURGER S.R.L.",
  },
];

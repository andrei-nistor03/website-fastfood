/**
 * Full menu, transcribed from the real Utopia menu list.
 *
 * `image` points at a file in /public/produse (webp, transparent bg) and
 * defaults to `slug` when omitted. Several items share one render on
 * purpose — e.g. every Crispy Strips count (3/4/5/6×) uses the same
 * `crispy-strips` photo, since no per-count photography exists.
 * Pass `image: null` to render a label-only card with no image at all
 * (used by Sosuri and Băuturi, neither of which has product photography
 * for every item, so both go label-only for consistency).
 *
 * KNOWN ASSET GAPS — flagged, not silently patched:
 *  - Sides & Extra: "Cartofi Mari" and "Cartofi Medii" both reuse the
 *    single `fries` render (no size-specific photography exists).
 * Swap in real photography for this slug when it's available.
 */

export type Item = {
  slug: string;
  /**
   * Filename (no extension) in /public/produse. Omit to default to `slug`;
   * pass `null` to explicitly render without an image (a label-only card).
   */
  image?: string | null;
  name: string;
  desc?: string;
  price?: string;
  tag?: string;
};

/** A named or unnamed run of items inside a category (e.g. "Utopia Wings"). */
export type Group = {
  title?: string;
  items: Item[];
};

export type Category = {
  id: string;
  label: string;
  /** Small chips shown under the tabs — a note, a price hint, a flavour pair. */
  notes?: string[];
  groups: Group[];
};

export const categories: Category[] = [
  {
    id: "crispy-wings",
    label: "Crispy & Wings",
    notes: ["Picant", "Nepicant"],
    groups: [
      {
        items: [
          {
            slug: "cw-3-crispy-strips",
            image: "crispy-strips",
            name: "3 × Crispy Strips",
            desc: "+ sos mic la alegere",
            price: "20.99 lei",
          },
          {
            slug: "cw-4-crispy-strips",
            image: "crispy-strips",
            name: "4 × Crispy Strips",
            desc: "+ sos mic la alegere",
            price: "25.99 lei",
          },
          {
            slug: "cw-5-crispy-strips",
            image: "crispy-strips",
            name: "5 × Crispy Strips",
            desc: "+ sos mare la alegere",
            price: "31.99 lei",
          },
          {
            slug: "cw-6-crispy-strips",
            image: "crispy-strips",
            name: "6 × Crispy Strips",
            desc: "+ sos mare la alegere",
            price: "39.99 lei",
          },
        ],
      },
      {
        title: "Utopia Wings",
        items: [
          {
            slug: "cw-3-wings",
            image: "wings",
            name: "3 × Wings",
            desc: "+ sos mic la alegere",
            price: "15.99 lei",
          },
          {
            slug: "cw-5-wings",
            image: "wings",
            name: "5 × Wings",
            desc: "+ sos mic la alegere",
            price: "23.99 lei",
          },
          {
            slug: "cw-8-wings",
            image: "wings",
            name: "8 × Wings",
            desc: "+ sos mic la alegere",
            price: "35.99 lei",
          },
        ],
      },
      {
        title: "Famous Wings · glazurate cu miere",
        items: [
          {
            slug: "cw-3-famous-wings",
            image: "famous-wings",
            name: "3 × Famous Wings",
            price: "12.99 lei",
          },
          {
            slug: "cw-5-famous-wings",
            image: "famous-wings",
            name: "5 × Famous Wings",
            price: "20.99 lei",
          },
          {
            slug: "cw-8-famous-wings",
            image: "famous-wings",
            name: "8 × Famous Wings",
            price: "32.99 lei",
          },
        ],
      },
    ],
  },
  {
    id: "burgeri",
    label: "Burgers",
    notes: ["Fiecare burger 26.99 lei"],
    groups: [
      {
        items: [
          {
            slug: "clasic-burger",
            name: "Clasic",
            desc: "chiflă · crispy strips crocant · sos maioneză · castraveți murați · dublu cheddar",
            price: "26.99 lei",
          },
          {
            slug: "spicy-burger",
            name: "Spicy",
            desc: "chiflă · crispy strips crocant · maioneză picantă · castraveți murați · cheddar",
            price: "26.99 lei",
          },
          {
            slug: "honey-heat-burger",
            name: "Honey Heat",
            desc: "chiflă · crispy strips glazurat cu miere · sos maioneză · salată iceberg · cheddar",
            price: "26.99 lei",
          },
          {
            slug: "honey-mustard-burger",
            name: "Honey Mustard",
            desc: "chiflă · crispy strips crocant · sos honey mustard · dublu cheddar · castraveți murați",
            price: "26.99 lei",
          },
          {
            slug: "southern-burger",
            name: "Southern",
            desc: "chiflă · crispy strips crocant · sos maioneză · coleslaw · castraveți murați · dublu cheddar",
            price: "26.99 lei",
          },
          {
            slug: "sour-cherry-burger",
            name: "Sour-Cherry",
            desc: "chiflă · crispy strips crocant · sos sour-cherry · dublu cheddar · ceapă crocantă",
            price: "26.99 lei",
          },
          {
            slug: "garlic-parmesan-burger",
            name: "Garlic Parmesan",
            desc: "chiflă · crispy strips crocant · sos usturoi · dublu cheddar · parmezan · castraveți murați",
            price: "26.99 lei",
          },
          {
            slug: "cheesy-burger",
            name: "Cheesy",
            desc: "chiflă · crispy strips crocant · sos cheddar · dublu cheddar · salată iceberg · castraveți murați",
            price: "26.99 lei",
          },
          {
            slug: "truffle-burger",
            name: "Truffle",
            desc: "chiflă · crispy strips crocant · sos trufe · dublu cheddar · ceapă crocantă · castraveți murați",
            price: "26.99 lei",
          },
        ],
      },
    ],
  },
  {
    id: "prima-data",
    label: "First Time",
    notes: [
      "Prima dată la Utopia? One bite — porție + cartofi medii sau suc.",
    ],
    groups: [
      {
        items: [
          {
            slug: "ft-2-crispy-strips",
            image: "crispy-strips",
            name: "2 × Crispy Strips",
            desc: "picant sau nepicant · + o porție medie de cartofi sau suc",
            price: "16.99 lei",
          },
          {
            slug: "ft-3-wings",
            image: "wings",
            name: "3 × Wings",
            desc: "+ o porție medie de cartofi sau suc",
            price: "16.99 lei",
          },
          {
            slug: "ft-3-famous-wings",
            image: "famous-wings",
            name: "3 × Famous Wings",
            desc: "+ o porție medie de cartofi sau suc",
            price: "19.99 lei",
          },
        ],
      },
    ],
  },
  {
    id: "meniuri",
    label: "Meniuri",
    notes: ["Fiecare meniu vine complet: + cartofi medii · sos · suc."],
    groups: [
      {
        title: "Meniu Crispy Strips · picant / nepicant",
        items: [
          {
            slug: "m-3-crispy-strips",
            image: "meniu-crispy-strips",
            name: "3 × Crispy Strips",
            desc: "+ cartofi medii · sos mic · suc",
            price: "35.99 lei",
          },
          {
            slug: "m-4-crispy-strips",
            image: "meniu-crispy-strips",
            name: "4 × Crispy Strips",
            desc: "+ cartofi medii · sos mic · suc",
            price: "40.99 lei",
          },
          {
            slug: "m-5-crispy-strips",
            image: "meniu-crispy-strips",
            name: "5 × Crispy Strips",
            desc: "+ cartofi medii · sos mare · suc",
            price: "46.99 lei",
          },
          {
            slug: "m-6-crispy-strips",
            image: "meniu-crispy-strips",
            name: "6 × Crispy Strips",
            desc: "+ cartofi medii · sos mare · suc",
            price: "52.99 lei",
          },
        ],
      },
      {
        title: "Meniu Wings",
        items: [
          {
            slug: "m-3-wings",
            image: "meniu-wings",
            name: "3 × Wings",
            desc: "+ cartofi medii · sos mic · suc",
            price: "30.99 lei",
          },
          {
            slug: "m-5-wings",
            image: "meniu-wings",
            name: "5 × Wings",
            desc: "+ cartofi medii · sos mare · suc",
            price: "36.99 lei",
          },
          {
            slug: "m-8-wings",
            image: "meniu-wings",
            name: "8 × Wings",
            desc: "+ cartofi medii · sos mic · suc",
            price: "49.99 lei",
          },
        ],
      },
      {
        title: "Alte meniuri",
        items: [
          {
            slug: "meniu-burger",
            name: "Meniu Burger",
            desc: "orice burger la alegere · + cartofi medii · sos · suc",
            price: "39.99 lei",
          },
          {
            slug: "meniu-southern",
            name: "Meniu Southern",
            desc: "3 Crispy Strips (picant sau nepicant) · salată coleslaw · + cartofi medii · sos · suc",
            price: "38.99 lei",
          },
        ],
      },
    ],
  },
  {
    id: "deals",
    label: "Deals",
    notes: ["Cartofi + Pepsi incluse la fiecare deal."],
    groups: [
      {
        items: [
          {
            slug: "fried-chicken-deal",
            name: "Fried Chicken Deal",
            desc: "3 × Crispy Strips (picant/nepicant) · 3 × Wings · cartofi medii · suc",
            price: "38.99 lei",
          },
          {
            slug: "special-deal",
            name: "Special Deal",
            desc: "3 × Famous Wings · 3 × Crispy Strips (picant/nepicant) · cartofi medii · suc",
            price: "41.99 lei",
          },
          {
            slug: "southern-deal",
            name: "Southern Deal",
            desc: "3 × Crispy Strips (picant/nepicant) · 1 × salată coleslaw · cartofi medii · suc",
            price: "35.99 lei",
          },
          {
            slug: "perfect-deal",
            name: "Perfect Deal",
            desc: "1 × Burger · 2 × Crispy Strips (picant/nepicant) · cartofi medii · suc",
            price: "46.99 lei",
          },
          {
            slug: "wings-deal",
            name: "Wings Deal",
            desc: "1 × Burger · 3 × Wings · cartofi medii · suc",
            price: "46.99 lei",
          },
          {
            slug: "all-in-deal",
            name: "All In Deal",
            desc: "1 × Burger · 2 × Crispy Strips (picant/nepicant) · 3 × Wings · 1 × sos mare · cartofi medii · suc",
            price: "64.99 lei",
          },
          {
            slug: "duo-perfect-deal",
            name: "Duo Perfect Deal",
            desc: "2 × Burger · 4 × Crispy Strips (picant/nepicant) · 2 × cartofi medii · 2 × suc",
            price: "89.99 lei",
            tag: "Pentru 2",
          },
        ],
      },
    ],
  },
  {
    id: "buckets",
    label: "Buckets",
    notes: ["Made for sharing"],
    groups: [
      {
        items: [
          {
            slug: "wings-bucket",
            name: "Wings Bucket",
            desc: "10 × Hot Wings · 1 × cartofi mari · 1 × sos mare",
            price: "56.99 lei",
          },
          {
            slug: "crispy-bucket",
            name: "Crispy Bucket",
            desc: "10 × Crispy Strips (picant/nepicant) · 1 × cartofi mari · 1 × sos mare",
            price: "72.99 lei",
          },
          {
            slug: "mix-bucket",
            name: "Mix Bucket",
            desc: "5 × Crispy Strips (picant/nepicant) · 5 × Hot Wings · 1 × cartofi mari · 1 × sos mare",
            price: "64.99 lei",
          },
          {
            slug: "southern-bucket",
            name: "Southern Bucket",
            desc: "10 × Crispy Strips (picant/nepicant) · 1 × cartofi mari · 1 × sos mare · 2 × salată coleslaw",
            price: "85.99 lei",
          },
          {
            slug: "only-chicken-bucket",
            name: "Only Chicken Bucket",
            desc: "10 × Wings · 10 × Crispy Strips (picant/nepicant)",
            price: "89.99 lei",
          },
          {
            slug: "friends-wings-bucket",
            image: "friends-wings",
            name: "Friends Wings Bucket",
            desc: "20 × Wings · 2 × cartofi mari · 2 × sosuri mari",
            price: "109.99 lei",
          },
          {
            slug: "friends-bucket",
            name: "Friends Bucket",
            desc: "10 × Crispy Strips (picant/nepicant) · 10 × Wings · 2 × cartofi mari · 2 × sosuri mari · 2 × răcoritoare",
            price: "144.99 lei",
          },
          {
            slug: "friends-crispy-bucket",
            image: "frieds-crispy-bucket",
            name: "Friends Crispy Bucket",
            desc: "20 × Crispy Strips (picant/nepicant) · 2 × cartofi mari · 2 × sosuri mari · 2 × răcoritoare",
            price: "159.99 lei",
          },
        ],
      },
    ],
  },
  {
    id: "sides",
    label: "Sides & Extra",
    notes: [
      "Upgrade-uri: porție mare de cartofi +3 lei · usturoi & parmezan peste cartofi +1.99 lei",
    ],
    groups: [
      {
        items: [
          {
            slug: "cartofi-mari",
            image: "fries",
            name: "Cartofi Mari",
            desc: "250 g",
            price: "10.99 lei",
          },
          {
            slug: "cartofi-medii",
            image: "fries",
            name: "Cartofi Medii",
            desc: "150 g",
            price: "7.99 lei",
          },
          {
            slug: "coleslaw",
            name: "Salată Coleslaw",
            price: "6.99 lei",
          },
        ],
      },
    ],
  },
  {
    id: "sosuri",
    label: "Sosuri",
    notes: ["50 ml — 4.99 lei", "110 ml — 9.99 lei"],
    groups: [
      {
        items: [
          { slug: "sos-maioneza", image: null, name: "Maioneză" },
          {
            slug: "sos-maioneza-picanta",
            image: null,
            name: "Maioneză Picantă",
          },
          { slug: "sos-trufe", image: null, name: "Trufe" },
          { slug: "sos-cheddar", image: null, name: "Cheddar" },
          {
            slug: "sos-honey-mustard",
            image: null,
            name: "Honey Mustard",
          },
          { slug: "sos-garlic-mayo", image: null, name: "Garlic Mayo" },
          { slug: "sos-utopia", image: null, name: "Utopia" },
        ],
      },
    ],
  },
  {
    id: "bauturi",
    label: "Băuturi",
    notes: ["7.99 lei"],
    groups: [
      {
        items: [
          { slug: "pepsi", image: null, name: "Pepsi", price: "7.99 lei" },
          {
            slug: "pepsi-max",
            image: null,
            name: "Pepsi Max",
            price: "7.99 lei",
          },
          {
            slug: "pepsi-twist",
            image: null,
            name: "Pepsi Twist",
            price: "7.99 lei",
          },
          {
            slug: "mirinda",
            image: null,
            name: "Mirinda",
            price: "7.99 lei",
          },
          { slug: "seven-up", image: null, name: "7Up", price: "7.99 lei" },
          {
            slug: "apa-plata",
            image: null,
            name: "Apă plată",
            price: "7.99 lei",
          },
          {
            slug: "apa-minerala",
            image: null,
            name: "Apă minerală",
            price: "7.99 lei",
          },
        ],
      },
    ],
  },
  {
    id: "desert",
    label: "Desert",
    notes: ["Fiecare gogoașă 5.99 lei"],
    groups: [
      {
        items: [
          {
            slug: "gogoasa-biscoff",
            name: "Gogoașă Biscoff",
            desc: "umplutură cremoasă & bucăți de Biscoff",
            price: "5.99 lei",
          },
          {
            slug: "gogoasa-ciocolata",
            name: "Gogoașă Ciocolată",
            desc: "glazură & umplutură de ciocolată",
            price: "5.99 lei",
          },
        ],
      },
    ],
  },
];

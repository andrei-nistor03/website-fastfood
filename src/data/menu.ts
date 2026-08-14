/**
 * Menu built from the 37 product renders in UTOPIA_PRODUSE_PNG.
 *
 * Copy follows the manual, p.6 "TONUL": short sentences, real words, the
 * ingredients and nothing else. The good example given there is
 * "Piept de pui, pane crocant, murături, maioneză cu usturoi. În chiflă." —
 * the bad one leans on "experiență culinară unică". We write the first kind.
 *
 * `price` is intentionally left off: no verified price list was available.
 * Add `price: "32 lei"` to any item and the card will render it.
 *
 * KNOWN ASSET GAPS — flagged, not patched, pending real photography:
 *  - "spicy-burger" reuses the "clasic-burger" render (same photo, only the
 *    sauce tone differs). No distinct Spicy shot exists in the asset set.
 *  - "wings-bucket" reuses the "mix-bucket" render byte-for-byte, even though
 *    Wings Bucket is wings-only and Mix Bucket also has crispy strips. No
 *    wings-only bucket render exists in the asset set.
 * Swap in real photography for these two slugs when it's available.
 */

export type Item = {
  slug: string;
  name: string;
  desc: string;
  price?: string;
  tag?: string;
};

export type Category = {
  id: string;
  label: string;
  note?: string;
  items: Item[];
};

export const categories: Category[] = [
  {
    id: "burgeri",
    label: "Burgeri",
    items: [
      {
        slug: "spicy-burger",
        name: "Spicy",
        desc: "Piept de pui în pane picant, cheddar, murături, sos alb. În chiflă.",
      },
      {
        slug: "cheesy-burger",
        name: "Cheesy",
        desc: "Piept de pui, pane crocant, dublu cheddar, sos de brânză, salată. În chiflă.",
      },
      {
        slug: "southern-burger",
        name: "Southern",
        desc: "Piept de pui în crustă Southern, cheddar, sos alb. În chiflă.",
      },
      {
        slug: "truffle-burger",
        name: "Truffle",
        desc: "Piept de pui, pane crocant, cheddar, maioneză cu trufe. În chiflă.",
      },
      {
        slug: "garlic-parmesan-burger",
        name: "Garlic Parmesan",
        desc: "Piept de pui, pane crocant, cheddar, sos de usturoi și parmezan. În chiflă.",
      },
      {
        slug: "honey-heat-burger",
        name: "Honey Heat",
        desc: "Piept de pui, pane crocant, cheddar, sos de miere iute, murături. În chiflă.",
      },
      {
        slug: "honey-mustard-burger",
        name: "Honey Mustard",
        desc: "Piept de pui, pane crocant, cheddar, sos de miere și muștar. În chiflă.",
      },
      {
        slug: "sour-cherry-burger",
        name: "Sour Cherry",
        desc: "Piept de pui, pane crocant, cheddar, sos de vișine, murături. În chiflă.",
      },
    ],
  },
  {
    id: "pui",
    label: "Pui",
    items: [
      {
        slug: "crispy-strips",
        name: "Crispy Strips",
        desc: "Fâșii din piept de pui, pane crocant. Se mănâncă cu mâna.",
      },
      {
        slug: "famous-wings",
        name: "Famous Wings",
        desc: "Aripioare glazurate, întoarse în sos după prăjire.",
        tag: "Cu sos",
      },
      {
        slug: "wings",
        name: "Wings",
        desc: "Aripioare în crustă crocantă. Fără sos, fără scuze.",
      },
      {
        slug: "one-bite",
        name: "One Bite",
        desc: "Bucăți mici din piept de pui, pane crocant. Una pe rând.",
      },
    ],
  },
  {
    id: "buckets",
    label: "Buckets",
    items: [
      {
        slug: "crispy-bucket",
        name: "Crispy Bucket",
        desc: "Crispy strips și cartofi prăjiți. Pentru două persoane.",
      },
      {
        slug: "only-chicken-bucket",
        name: "Only Chicken",
        desc: "Doar pui. Crispy strips și aripioare, fără garnitură.",
      },
      {
        slug: "mix-bucket",
        name: "Mix Bucket",
        desc: "Crispy strips, aripioare și cartofi prăjiți.",
      },
      {
        slug: "southern-bucket",
        name: "Southern Bucket",
        desc: "Pui în crustă Southern, cartofi prăjiți și coleslaw.",
      },
      {
        slug: "wings-bucket",
        name: "Wings Bucket",
        desc: "Aripioare și cartofi prăjiți.",
      },
      {
        slug: "friends-bucket",
        name: "Friends Bucket",
        desc: "Pui, cartofi prăjiți și două băuturi. Pentru patru.",
        tag: "Pentru 4",
      },
      {
        slug: "frieds-crispy-bucket",
        name: "Friends Crispy",
        desc: "Crispy strips, cartofi prăjiți și două băuturi.",
      },
      {
        slug: "friends-wings",
        name: "Friends Wings",
        desc: "Aripioare și două porții de cartofi prăjiți.",
      },
    ],
  },
  {
    id: "meniuri",
    label: "Meniuri",
    items: [
      {
        slug: "meniu-burger",
        name: "Meniu Burger",
        desc: "Burger, cartofi prăjiți și băutură.",
      },
      {
        slug: "meniu-crispy-strips",
        name: "Meniu Crispy Strips",
        desc: "Crispy strips, cartofi prăjiți și băutură.",
      },
      {
        slug: "meniu-southern",
        name: "Meniu Southern",
        desc: "Pui Southern, cartofi prăjiți, coleslaw și băutură.",
      },
      {
        slug: "meniu-wings",
        name: "Meniu Wings",
        desc: "Aripioare, cartofi prăjiți și băutură.",
      },
    ],
  },
  {
    id: "deals",
    label: "Deals",
    note: "La fiecare deal: cartofi prăjiți și băutură.",
    items: [
      {
        slug: "all-in-deal",
        name: "All In",
        desc: "Crispy strips, aripioare și sos de brânză.",
      },
      {
        slug: "perfect-deal",
        name: "Perfect Deal",
        desc: "Burger și crispy strips.",
      },
      {
        slug: "duo-perfect-deal",
        name: "Duo Perfect Deal",
        desc: "Doi burgeri și crispy strips. Pentru doi.",
        tag: "Pentru 2",
      },
      {
        slug: "fried-chicken-deal",
        name: "Fried Chicken Deal",
        desc: "Pui prăjit, bucăți întregi.",
      },
      {
        slug: "southern-deal",
        name: "Southern Deal",
        desc: "Pui Southern și coleslaw.",
      },
      {
        slug: "wings-deal",
        name: "Wings Deal",
        desc: "Aripioare și un burger mic.",
      },
      {
        slug: "special-deal",
        name: "Special Deal",
        desc: "Aripioare, porție mare.",
      },
    ],
  },
  {
    id: "extra",
    label: "Lângă",
    items: [
      {
        slug: "fries",
        name: "Cartofi prăjiți",
        desc: "Tăiați gros, prăjiți de două ori, sărați cât trebuie.",
      },
      {
        slug: "coleslaw",
        name: "Coleslaw",
        desc: "Varză proaspătă, sos cremos. Se servește rece.",
      },
      {
        slug: "gogoasa-biscoff",
        name: "Gogoașă Biscoff",
        desc: "Glazură Biscoff și crumble de biscuiți.",
      },
      {
        slug: "gogoasa-ciocolata",
        name: "Gogoașă cu ciocolată",
        desc: "Glazură de ciocolată și fulgi de ciocolată.",
      },
    ],
  },
];

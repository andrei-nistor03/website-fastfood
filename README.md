# Utopia Fried Chicken — landing page

Next.js 15 · React 19 · TypeScript · Tailwind v4 · GSAP (ScrollTrigger) · three.js

Every design decision traces back to `UTOPIAFC_ghid_09062026` (v25052026). Where
the manual specifies something, the code cites the page in a comment.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm start
```

No environment variables, no external services. Fonts are self-hosted from npm,
so the site makes no third-party requests at runtime.

## Structure

```
src/
  app/
    globals.css        design tokens — colours, type scale, band + blob recipes
    layout.tsx         metadata, self-hosted fonts, reduced-motion gate
    page.tsx           section order
  components/
    Lockup.tsx         the slogan-band device (p.13 / p.15) — the signature element
    Header.tsx         sticky bar, logo + mascot, mobile nav
    Hero.tsx           "Real Fried Chicken" lockup, bucket, mascot, blobs
    CrumbField.tsx     three.js crumb drift (p.14 sanctions crumbs "cu măsură")
    Ticker.tsx         marquee band
    Menu.tsx           six category tabs, 36 product cards
    Locations.tsx      Arad + Timișoara
    About.tsx          condensed from p.4 / p.5 / p.6
    Footer.tsx
    Motion.tsx         all GSAP choreography in one place
  data/
    menu.ts            the menu; add prices here
    locations.ts       addresses and hours
public/
  brand/               logo lockups + 6 mascot poses, extracted from the PDF
  produse/             37 product renders, area-normalised to 880×880 WebP
```

## Design system

| Token | Value | Source |
| --- | --- | --- |
| Utopia Red | `#E10019` | p.7 |
| Utopia Yellow | `#FFC400` | p.7 |
| Rich Black | `#221E1F` | p.7, sampled from the manual's own dark pages |
| Off-white | `#FAF9F6` | p.7 — recommended for large light surfaces, never on the logo |
| Type ratio | **1.62** | p.12 — "Progresia ideală între nivelurile titlurilor este x 1,62" |

**Typefaces.** Zilla Slab is the manual's body face and is used exactly as
specified. Azo Sans is a commercial licence, so headlines use **Figtree Black**
as a stand-in — geometric, same weight class, double-storey `a`. Buy the Azo Sans
family and swap `--font-display` in `globals.css` to switch; nothing else changes.

**The signature device.** Section headings are all built from the same recipe as
the brand's slogan lockups: a solid band per line, width proportional to the
text, tilted 0–6°, band copying the tilt. `Lockup.tsx` takes a list of lines and
tones, so new slogans are one array away. GSAP slams each band in individually.

**Graphic elements.** Blob fragments are cropped by the frame edge, never whole,
never centred, always behind type — and used sparingly. The locations section
deliberately has none.

## Accessibility

- Reduced motion: the crumb field never initialises and no content is hidden.
  The `.js-motion` class gates all hiding, so no re-render can strip content from
  a reduced-motion visitor.
- Works with JavaScript disabled — everything is server-rendered.
- Yellow focus ring at 3px, visible on red, black and cream.
- Tabs use `role="tablist"` with `aria-selected` / `aria-controls`.
- Mascots are decorative and carry empty `alt`.

## Open items before launch

1. **Timișoara address — needs confirming.** "Utopia Fried Chicken" has no Google
   Maps listing in Timișoara. `src/data/locations.ts` currently uses
   Aleea Studenților 21 (the Utopia location there, +40 728 031 962) and is
   flagged with a `TODO`. Arad is verified: Bulevardul Revoluției 35, 4.9★.
2. **Prices.** None were available. Every item in `menu.ts` takes an optional
   `price` field that the card already renders — add `price: "32 lei"` and it
   appears. No layout work needed.
3. **Product descriptions.** Written from the product photographs in the
   manual's voice (p.6: ingredients, short sentences, no "experiență culinară").
   Worth one pass against the real recipes.
4. **One filename looks like a typo.** `Frieds crispy bucket` is rendered as
   "Friends Crispy" on the assumption that's what was meant.
5. **Ordering.** The CTAs point at the locations section. Wire them to Tazz,
   Glovo or Wolt when those listings exist.
6. Add a real favicon and an Open Graph image — currently the logo stands in.

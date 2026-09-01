# Utopia Fried Chicken — landing page

A single-page Next.js site for a Romanian fried-chicken brand (Arad +
Timișoara), built directly against the brand manual
(`UTOPIAFC_ghid_09062026`, v25052026). Wherever a design decision comes
straight from a rule in that manual, the code cites the page number in a
comment next to it — that's the fastest way to find *why* something looks
the way it does.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4
· GSAP + ScrollTrigger · three.js / react-three-fiber

## Quick start

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # serve the production build
```

No environment variables and no external services to configure. Fonts are
self-hosted (`public/fonts`), so the running site makes no third-party
network requests.

## Project structure

```
src/
  app/
    layout.tsx                        root layout: metadata, self-hosted fonts, reduced-motion gate
    page.tsx                          homepage — just section order
    globals.css                       design tokens (colours, type scale) + the band/blob/checker utilities
    politica-cookie-uri/page.tsx      legal pages — static copy through the shared LegalPage layout
    politica-de-confidentialitate/page.tsx
    termeni-si-conditii/page.tsx

  components/
    Lockup.tsx                        the slogan-band device (manual p.13 / p.15) — the site's signature element
    Header.tsx                        sticky bar: logo + mascot, desktop nav, mobile menu
    Hero.tsx                          "Real Fried Chicken" lockup, blobs, hero layout
    HeroScene.tsx                     three.js crumb drift behind the hero (manual p.14: motion "cu măsură")
    HeroProductStack.tsx              the hovering/auto-cycling product stack in the hero
    Ticker.tsx                        the scrolling marquee band under the hero
    Menu.tsx                          category tabs + product grid
    MenuBucketDrop.tsx                the 3D bucket-and-tenders drop, pinned to the menu header on scroll
    MenuCrumbBurst.tsx                the crumb-puff particle effect fired on tab clicks
    Kfc_bucket.jsx                    generated react-three-fiber wrapper for the bucket model (gltfjsx)
    Krispy_fried_chicken.jsx          generated react-three-fiber wrapper for the tender model (gltfjsx)
    Locations.tsx                     Arad + Timișoara cards
    About.tsx                         condensed from manual p.4 / p.5 / p.6
    Footer.tsx
    Loader.tsx                        full-page loading gate, held until fonts/assets/animations are ready
    LegalPage.tsx                     shared header/footer shell for the three legal pages
    Motion.tsx                        all scroll-triggered GSAP choreography, in one place

  lib/
    scrollToSection.ts                nav-link smooth scrolling (aware of the bucket-drop pin's scroll range)
    prefersReducedMotion.ts           one shared `(prefers-reduced-motion: reduce)` check

  data/
    menu.ts                           the menu — categories, groups, items, prices
    locations.ts                      addresses, hours, phone numbers, map links

public/
  brand/    logo lockups + 6 mascot poses, extracted from the manual
  produse/  product renders (WebP, transparent background)
  models/   .glb models for the 3D bucket + tender pieces
  textures/ the bucket wrap texture
  fonts/    self-hosted Azo Sans Uber + Zilla Slab
```

Almost all interactivity lives in `Motion.tsx` (scroll-triggered reveals) and
a handful of standalone effects (`HeroScene`, `HeroProductStack`,
`MenuBucketDrop`, `MenuCrumbBurst`, `Loader`, `Ticker`). Everything else —
`Header`, `Hero`, `Menu`, `Locations`, `About`, `Footer` — is static markup
that those effects animate into place; none of them own animation logic
themselves.

## Editing content

- **Menu.** Everything shown in the menu grid comes from `src/data/menu.ts`.
  Add, remove, or reprice an item there and the grid, tabs, and category
  notes update automatically — no component changes needed. `image` defaults
  to the item's `slug`; pass `image: null` for a label-only card (used for
  sauces and drinks, which don't have per-item photography) or point it at a
  shared photo when several items reuse one render (e.g. every Crispy Strips
  count uses the same `crispy-strips.webp`).
- **Locations.** Addresses, hours, phone numbers, and map links live in
  `src/data/locations.ts`.

## Design system

| Token | Value | Source |
| --- | --- | --- |
| Utopia Red | `#E10019` | manual p.7 |
| Utopia Yellow | `#FFC400` | manual p.7 |
| Rich Black | `#221E1F` | manual p.7 |
| Off-white | `#FAF9F6` | manual p.7 — for large light surfaces, never on the logo |
| Type ratio | **1.62** | manual p.12 — "Progresia ideală între nivelurile titlurilor este x 1,62" |

All of these are defined once, as CSS custom properties, in the `@theme`
block of `src/app/globals.css`.

**Typefaces.** Both are the manual's real cuts, self-hosted from
`public/fonts` — no substitutes. Headlines use **Azo Sans Uber** (the
heaviest cut in the family, registered at weight 900); body copy uses
**Zilla Slab** (Regular + Bold).

**The signature device.** Every heading on the site is built from the same
recipe as the brand's slogan lockups: a solid band per line, its width
proportional to the text, tilted 0–6°, with the text tilted to match.
`Lockup.tsx` takes an array of `{ text, tone, tilt }` lines, so a new slogan
is just a new array — `Motion.tsx` handles slamming each band into place on
scroll.

**Graphic elements.** Yellow blob fragments (`.u-blob`) are always cropped by
the frame edge — never whole, never centred, always behind the type — and
used sparingly; the locations section deliberately has none. The checker
pattern (`.u-checker`) reuses the same conic-gradient utility everywhere it
appears, tinted per section via CSS custom properties.

## Accessibility

- **Reduced motion.** Nothing is ever hidden by script alone: the
  `.js-motion` class (set only when scripting is available *and*
  `prefers-reduced-motion` is not set) gates every `u-hidden` element, so a
  reduced-motion visitor never has content stripped out from under them. The
  three.js effects (`HeroScene`, `MenuCrumbBurst`, `MenuBucketDrop`) all
  check the same media query and simply don't initialise.
- **No-JS.** The page is server-rendered; with scripting disabled, visitors
  see the fully laid-out (unanimated) page rather than a blank or broken one.
- **Focus.** A 3px yellow focus ring, with a black variant on yellow
  surfaces, so it stays visible on red, black, and cream backgrounds alike.
- **Tabs.** The menu category switcher uses `role="tablist"` with
  `aria-selected` / `aria-controls`, wired up properly to its panel.
- **Mascots** are decorative throughout and carry an empty `alt`.

## Open items before launch

1. **Timișoara — hours and phone need confirming.** The address itself
   (Calea Circumvalațiunii 35) and its Google Maps link are client-confirmed.
   The hours and phone number in `src/data/locations.ts` are still carried
   over from the old address (Aleea Studenților 21) and are flagged with a
   `TODO` there — update them once the new location's own details are known.
2. **Product descriptions.** Written from the product photography in the
   manual's voice (p.6: ingredients, short sentences, no
   "experiență culinară"). Worth one pass against the real recipes before
   launch.
3. **One filename looks like a typo.** `frieds-crispy-bucket.webp` is used
   for the "Friends Crispy Bucket" item, on the assumption that's what was
   meant.
4. **Ordering.** The CTAs currently point at the locations section. Wire
   them to Tazz, Glovo, or Wolt once those listings exist.
5. **Add a real favicon and an Open Graph image.** The logo currently stands
   in for both (`src/app/layout.tsx`).

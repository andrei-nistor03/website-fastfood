"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * A 4-product stack: one hero item big up front, two smaller items side by
 * side just behind it, and a fourth item hidden completely behind the pile —
 * it only becomes visible once a click shuffles it into one of the three
 * visible spots. Click anywhere on the stack to cycle the next product to
 * the front (this also happens on its own every few seconds). Hovering a
 * product spreads the visible cards apart so the back ones read more
 * clearly, and the whole pile drifts with a slow idle float.
 */

type Item = { slug: string; alt: string };

const ITEMS: Item[] = [
  { slug: "only-chicken-bucket", alt: "Bucket Utopia plin cu pui prăjit" },
  { slug: "clasic-burger", alt: "Burger Clasic Utopia" },
  { slug: "gogoasa-biscoff", alt: "Gogoașă Biscoff Utopia" },
  { slug: "fries", alt: "Cartofi prăjiți Utopia" },
];

// Product photos don't all fill their frame the same amount, so equal
// GSAP scale still reads as different physical sizes — this trims the
// worst offenders back down when they land in a bigger slot.
const ITEM_SCALE: Record<string, number> = {
  "only-chicken-bucket": 1,
  "clasic-burger": 0.82,
  fries: 1,
};

// Extra correction applied only when the item is the front/main product —
// the donut reads noticeably bigger than the others at that size.
const FRONT_ITEM_SCALE: Record<string, number> = {
  "gogoasa-biscoff": 0.8,
};

// Slot offsets below are authored in pixels against a stage this wide. The
// stage itself is fluid (88vw, capped here), so every x/y is multiplied by
// stageWidth / DESIGN_WIDTH before it reaches GSAP — otherwise the side cards
// keep their desktop spread on a ~350px phone stage and get pushed out past
// the edge, where the hero's overflow-hidden clips them away.
const DESIGN_WIDTH = 560;

// Resting positions by depth: 0 = big hero in front, 1/2 = smaller cards
// side by side just behind it, 3 = fully hidden behind the pile.
const REST_SLOTS = [
  { x: 0, y: 16, rotate: -2, scale: 1.16 },
  { x: -122, y: 52, rotate: -8, scale: 0.58 },
  { x: 122, y: 52, rotate: 8, scale: 0.58 },
  { x: 0, y: 34, rotate: 0, scale: 0.42 },
];

// Hover target for the three visible depths only — cards spread further
// apart and the back pair grows a touch so they're easier to make out.
// Depth 3 stays put and stays hidden; it never previews on hover.
const HOVER_SLOTS = [
  { x: 0, y: -4, rotate: -2, scale: 1.06 },
  { x: -196, y: 30, rotate: -12, scale: 0.72 },
  { x: 196, y: 30, rotate: 12, scale: 0.72 },
];

const AUTOPLAY_MS = 3000;

function targetFor(
  depth: number,
  hovering: boolean,
  slug: string,
  unit: number,
) {
  const itemScale =
    (ITEM_SCALE[slug] ?? 1) * (depth === 0 ? (FRONT_ITEM_SCALE[slug] ?? 1) : 1);
  if (depth === 3) {
    const s = REST_SLOTS[3];
    return {
      x: s.x * unit,
      y: s.y * unit,
      rotation: s.rotate,
      scale: s.scale * itemScale,
      autoAlpha: 0,
      zIndex: 1,
    };
  }
  const s = hovering ? HOVER_SLOTS[depth] : REST_SLOTS[depth];
  return {
    x: s.x * unit,
    y: s.y * unit,
    rotation: s.rotate,
    scale: s.scale * itemScale,
    autoAlpha: 1,
    zIndex: 4 - depth,
  };
}

export default function HeroProductStack({
  className = "",
}: {
  className?: string;
}) {
  const [order, setOrder] = useState<number[]>([0, 1, 2, 3]);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const first = useRef(true);
  const hovering = useRef(false);
  const hoverCount = useRef(0);
  const autoplayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotion = useRef(false);
  const unit = useRef(1);
  // Touch browsers fire a synthetic mouseenter on tap but often no matching
  // mouseleave, which would latch the hover spread on and stall the autoplay
  // for good. Only devices that can really hover get the hover behaviour.
  const canHover = useRef(true);

  const measure = () => {
    const w = stageRef.current?.offsetWidth ?? DESIGN_WIDTH;
    unit.current = w > 0 ? w / DESIGN_WIDTH : 1;
  };

  const cycleFromFront = () => setOrder((o) => [...o.slice(1), o[0]]);

  const scheduleAutoplay = () => {
    if (autoplayTimer.current) clearTimeout(autoplayTimer.current);
    if (reducedMotion.current || hoverCount.current > 0) return;
    autoplayTimer.current = setTimeout(cycleFromFront, AUTOPLAY_MS);
  };

  // Position every card according to its current depth in `order` — on the
  // first run this is an entrance (visible cards fly in and land, the
  // hidden one just appears hidden), after that it's a resettle following
  // a click. Also (re)arms the auto-advance timer for the new order.
  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    canHover.current = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    const reduced = reducedMotion.current;
    measure();

    order.forEach((itemIndex, depth) => {
      const el = cardRefs.current[itemIndex];
      if (!el) return;
      const target = targetFor(
        depth,
        hovering.current,
        ITEMS[itemIndex].slug,
        unit.current,
      );

      if (first.current) {
        if (depth === 3) {
          gsap.set(el, target);
        } else if (!reduced) {
          gsap.set(el, target);
          gsap.from(el, {
            x: target.x + (itemIndex % 2 === 0 ? -170 : 170) * unit.current,
            y: target.y + 130 * unit.current,
            rotation: target.rotation + (itemIndex % 2 === 0 ? -55 : 55),
            scale: 0.3,
            autoAlpha: 0,
            duration: 0.9,
            delay: 0.55 + depth * 0.09,
            ease: "back.out(1.6)",
          });
        } else {
          gsap.set(el, target);
        }
      } else {
        gsap.to(el, {
          ...target,
          duration: 0.55,
          ease: "power3.out",
          overwrite: true,
        });
      }
    });

    first.current = false;
    scheduleAutoplay();

    // The slot offsets are derived from the stage width, so a resize (or a
    // phone rotating) has to re-place the pile — snapped, not tweened, since
    // there's no motion to narrate here.
    const onResize = () => {
      measure();
      order.forEach((itemIndex, depth) => {
        const el = cardRefs.current[itemIndex];
        if (!el) return;
        gsap.set(el, {
          ...targetFor(
            depth,
            hovering.current,
            ITEMS[itemIndex].slug,
            unit.current,
          ),
          overwrite: true,
        });
      });
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (autoplayTimer.current) clearTimeout(autoplayTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  // Slow, continuous idle float for the whole pile — independent of the
  // per-card position tweens above, since it lives on the stage wrapper
  // rather than the cards themselves.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = stageRef.current;
    if (!el) return;

    const tween = gsap.to(el, {
      y: 16,
      duration: 2.6,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    return () => {
      tween.kill();
    };
  }, []);

  const applyHover = (isHovering: boolean) => {
    if (!canHover.current) return;
    hoverCount.current = Math.max(
      0,
      hoverCount.current + (isHovering ? 1 : -1),
    );
    const nowHovering = hoverCount.current > 0;
    if (nowHovering === hovering.current) return;
    hovering.current = nowHovering;

    order.forEach((itemIndex, depth) => {
      if (depth === 3) return;
      const el = cardRefs.current[itemIndex];
      if (!el) return;
      gsap.to(el, {
        ...targetFor(depth, nowHovering, ITEMS[itemIndex].slug, unit.current),
        duration: 0.45,
        ease: "power3.out",
        overwrite: true,
      });
    });

    scheduleAutoplay();
  };

  const handleClick = () => {
    cycleFromFront();
  };

  return (
    <div
      ref={stageRef}
      className={`relative mx-auto aspect-square w-[88%] max-w-[560px] lg:w-full ${className}`}
    >
      {ITEMS.map((item, i) => (
        <div
          key={item.slug}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          className="u-hidden absolute inset-0 m-auto h-fit w-[72%] will-change-transform"
        >
          <Image
            src={`/produse/${item.slug}.webp`}
            alt={item.alt}
            width={880}
            height={880}
            priority={i === 0}
            sizes="(max-width: 1024px) 60vw, 32vw"
            draggable={false}
            className="pointer-events-none w-full drop-shadow-[0_28px_46px_rgba(0,0,0,0.32)]"
          />
          {/* Hit region deliberately smaller than the rendered image — the
              photos carry a lot of transparent padding, so hovering/clicking
              only "counts" over the product's actual visual footprint. Always
              mounted (never conditionally removed) so a click that shuffles
              this card to the hidden depth can't unmount it out from under
              an active hover and strand the hover-count. The hidden card's
              region sits under the front card in z-order regardless. */}
          <div
            onClick={handleClick}
            onMouseEnter={() => applyHover(true)}
            onMouseLeave={() => applyHover(false)}
            className="absolute inset-[22%] cursor-pointer"
          />
        </div>
      ))}
    </div>
  );
}

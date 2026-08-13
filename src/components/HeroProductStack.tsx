"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

/**
 * The hero product isn't alone anymore — a small bunched pile of the
 * favourites behind the bucket, stacked like they just landed there. Drag
 * (or click) any card to bring it to the front; the rest resettle behind it.
 */

type Item = { slug: string; alt: string };

const ITEMS: Item[] = [
  { slug: "only-chicken-bucket", alt: "Bucket Utopia plin cu pui prăjit" },
  { slug: "clasic-burger", alt: "Burger Clasic Utopia" },
  { slug: "famous-wings", alt: "Famous Wings Utopia" },
  { slug: "fries", alt: "Cartofi prăjiți Utopia" },
];

// Front-to-back resting positions — a loose, slightly messy pile rather than
// a tidy radial fan. All cards share the same base size; scale does the rest.
const SLOTS = [
  { x: 0, y: 0, rotate: -2, scale: 1 },
  { x: 34, y: 26, rotate: 9, scale: 0.72 },
  { x: -104, y: 58, rotate: -11, scale: 0.6 },
  { x: 92, y: 92, rotate: 7, scale: 0.52 },
];

const DRAG_THRESHOLD = 70;

export default function HeroProductStack({ className = "" }: { className?: string }) {
  const [order, setOrder] = useState<number[]>([0, 1, 2, 3]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const first = useRef(true);
  // A drag that crosses the threshold also fires a native click on release —
  // this remembers *which element* was just dragged so only that element's
  // next click gets swallowed, not a genuine click on a different card.
  const suppressClickOn = useRef<HTMLDivElement | null>(null);

  const cycleFromFront = () => setOrder((o) => [...o.slice(1), o[0]]);
  const bringToFront = (itemIndex: number) =>
    setOrder((o) => (o[0] === itemIndex ? o : [itemIndex, ...o.filter((x) => x !== itemIndex)]));

  // Position every card according to its current depth in `order` — on the
  // first run this is an entrance (cards fly in and land), after that it's
  // just a resettle following a drag or a click.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    order.forEach((itemIndex, depth) => {
      const el = cardRefs.current[itemIndex];
      if (!el) return;
      const slot = SLOTS[depth];
      const rest = {
        x: slot.x,
        y: slot.y,
        rotation: slot.rotate,
        scale: slot.scale,
        zIndex: SLOTS.length - depth,
      };

      if (first.current) {
        gsap.set(el, rest);
        if (!reduced) {
          gsap.from(el, {
            x: slot.x + (itemIndex % 2 === 0 ? -170 : 170),
            y: slot.y + 130,
            rotation: slot.rotate + (itemIndex % 2 === 0 ? -55 : 55),
            scale: 0.3,
            autoAlpha: 0,
            duration: 0.9,
            delay: 0.55 + depth * 0.09,
            ease: "back.out(1.6)",
          });
        } else {
          gsap.set(el, { autoAlpha: 1 });
        }
      } else {
        gsap.to(el, { ...rest, duration: 0.55, ease: "power3.out", overwrite: true });
      }
    });

    first.current = false;
  }, [order]);

  // Draggable lives on whichever card is currently front, recreated each
  // time that changes so it always tracks a live, correctly-positioned node.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const frontIndex = order[0];
    const el = cardRefs.current[frontIndex];
    if (!el) return;

    const [inst] = Draggable.create(el, {
      type: "x",
      bounds: { minX: -260, maxX: 260 },
      edgeResistance: 0.6,
      onDragEnd() {
        if (Math.abs(this.x) > DRAG_THRESHOLD) {
          suppressClickOn.current = el;
          cycleFromFront();
        } else {
          gsap.to(el, { x: SLOTS[0].x, duration: 0.4, ease: "power3.out" });
        }
      },
    });

    return () => {
      inst.kill();
    };
  }, [order]);

  return (
    <div className={`relative mx-auto aspect-square w-[80%] max-w-[480px] md:w-full ${className}`}>
      {ITEMS.map((item, i) => (
        <div
          key={item.slug}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          onClick={(e) => {
            if (suppressClickOn.current === e.currentTarget) {
              suppressClickOn.current = null;
              return;
            }
            bringToFront(i);
          }}
          className={`u-hidden absolute inset-0 m-auto h-fit w-[72%] will-change-transform ${
            order[0] === i ? "touch-none cursor-grab active:cursor-grabbing" : "cursor-pointer"
          }`}
        >
          <div className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.05]">
            <Image
              src={`/produse/${item.slug}.webp`}
              alt={item.alt}
              width={880}
              height={880}
              priority={i === 0}
              sizes="(max-width: 768px) 60vw, 32vw"
              draggable={false}
              className="pointer-events-none w-full drop-shadow-[0_28px_46px_rgba(0,0,0,0.32)]"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

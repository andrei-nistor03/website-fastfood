"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/prefersReducedMotion";

type Item = { slug: string; alt: string };

const ITEMS: Item[] = [
  { slug: "only-chicken-bucket", alt: "Bucket Utopia plin cu pui prăjit" },
  { slug: "clasic-burger", alt: "Burger Clasic Utopia" },
  { slug: "fries", alt: "Cartofi prăjiți Utopia" },
];

const ITEM_SCALE: Record<string, number> = {
  "only-chicken-bucket": 1,
  "clasic-burger": 0.82,
  fries: 1,
};

const FRONT_ITEM_SCALE: Record<string, number> = {};

const DESIGN_WIDTH = 560;

const REST_SLOTS = [
  { x: 0, y: 16, rotate: -2, scale: 1.16 },
  { x: -122, y: 52, rotate: -8, scale: 0.58 },
  { x: 122, y: 52, rotate: 8, scale: 0.58 },
];

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
  const [order, setOrder] = useState<number[]>([0, 1, 2]);
  const [loaded, setLoaded] = useState<boolean[]>(() => ITEMS.map(() => false));
  const stageRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const first = useRef(true);
  const hovering = useRef(false);
  const hoverCount = useRef(0);
  const autoplayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotion = useRef(false);
  const unit = useRef(1);
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

  useEffect(() => {
    reducedMotion.current = prefersReducedMotion();
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
        if (!reduced) {
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
  }, [order]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
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
            onLoad={() =>
              setLoaded((prev) => {
                if (prev[i]) return prev;
                const next = [...prev];
                next[i] = true;
                return next;
              })
            }
            className={`pointer-events-none w-full transition-[filter] duration-200 ${
              loaded[i] ? "drop-shadow-[0_28px_46px_rgba(0,0,0,0.32)]" : ""
            }`}
          />
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

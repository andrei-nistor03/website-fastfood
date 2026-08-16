"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const PHRASES = [
  "Real fried chicken",
  "Cool people eat fried chicken",
  "We love fried chicken!",
];

// A constant scroll speed (px/s) rather than a fixed loop duration, so the
// pace stays the same no matter how wide a "block" ends up being.
const SPEED_PX_PER_SEC = 55;
const DIAMOND_SPIN_SECONDS = 1.6;

export default function Ticker() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const [reps, setReps] = useState(1);

  // The loop works by translating the track exactly one "block" width (two
  // copies of the block sit back to back, so sliding one block's worth left
  // lands back on frame one). If a single block is narrower than the ticker
  // itself, that translation overshoots the actual content and leaves blank
  // space before the loop resets — so keep repeating the phrase set until
  // one block is at least as wide as the ticker.
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const block = blockRef.current;
    if (!section || !block) return;
    if (block.scrollWidth > 0 && block.scrollWidth < section.offsetWidth) {
      setReps((r) => r + 1);
    }
  }, [reps]);

  useGSAP(
    () => {
      const track = trackRef.current;
      const block = blockRef.current;
      if (!track || !block) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduced) return;

      const blockWidth = block.scrollWidth;
      if (!blockWidth) return;

      gsap.set(track, { x: 0 });
      gsap.to(track, {
        x: -blockWidth,
        duration: blockWidth / SPEED_PX_PER_SEC,
        ease: "none",
        repeat: -1,
      });

      // Each diamond spins on its own continuous loop, staggered so they
      // don't all turn in lockstep — reads as little sparks between phrases.
      gsap.to("[data-diamond]", {
        rotation: "+=360",
        duration: DIAMOND_SPIN_SECONDS,
        ease: "none",
        repeat: -1,
        stagger: { each: 0.18, from: "start" },
      });
    },
    { scope: sectionRef, dependencies: [reps], revertOnUpdate: true },
  );

  const set = Array.from({ length: reps }, () => PHRASES).flat();

  return (
    <div
      ref={sectionRef}
      className="relative z-20 -mt-[1px] overflow-hidden border-y-[3px] border-u-black bg-u-yellow py-2.5"
    >
      <div ref={trackRef} className="flex w-max items-center gap-8" aria-hidden>
        {[0, 1].map((copy) => (
          <div
            key={copy}
            ref={copy === 0 ? blockRef : undefined}
            className="flex shrink-0 items-center gap-8"
          >
            {set.map((p, i) => (
              <span
                key={i}
                className="u-eyebrow flex shrink-0 items-center gap-8 text-[0.8rem] text-u-black"
              >
                {p}
                <span
                  data-diamond
                  className="block h-2 w-2 rotate-45 bg-u-red"
                />
              </span>
            ))}
          </div>
        ))}
      </div>
      <span className="sr-only">Pui prăjit. Fără scuze.</span>
    </div>
  );
}

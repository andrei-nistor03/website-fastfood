"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useProgress } from "@react-three/drei";

/**
 * A full-page gate over everything else: the hero's raw-three crumb field,
 * the menu's GLTF bucket/tenders and every image and web font. Covering the
 * page while all of that spins up means the first thing anyone sees is
 * already settled, not assets popping in over a couple of seconds.
 *
 * Kept visible by default (see the `.js-loading` gate in layout.tsx/globals.css)
 * so a visitor without JS never gets stuck behind it — only scripted browsers
 * that can actually clear it are allowed to show it in the first place.
 */

// However fast everything resolves, keep the mark on screen at least this
// long so it doesn't just flash for cached repeat visits.
const MIN_VISIBLE_MS = 700;
// Safety net — if something never fires (a stalled fetch, a slow font),
// don't hold the page hostage forever.
const MAX_WAIT_MS = 8000;

export default function Loader() {
  const [fontsReady, setFontsReady] = useState(false);
  const [windowReady, setWindowReady] = useState(false);
  const [minElapsed, setMinElapsed] = useState(false);
  const [forced, setForced] = useState(false);
  const [hidden, setHidden] = useState(false);

  const { active: assetsActive, progress: assetsProgress } = useProgress();
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    document.documentElement.classList.add("u-loading-lock");

    if (document.readyState === "complete") {
      setWindowReady(true);
    }
    const onLoad = () => setWindowReady(true);
    window.addEventListener("load", onLoad, { once: true });

    if (document.fonts) {
      document.fonts.ready.then(() => setFontsReady(true));
    } else {
      setFontsReady(true);
    }

    const minTimer = setTimeout(() => setMinElapsed(true), MIN_VISIBLE_MS);
    const maxTimer = setTimeout(() => setForced(true), MAX_WAIT_MS);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced && logoRef.current) {
      gsap.from(logoRef.current, {
        autoAlpha: 0,
        y: 16,
        scale: 0.94,
        duration: 0.55,
        ease: "power3.out",
      });
    }

    return () => {
      window.removeEventListener("load", onLoad);
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
    };
  }, []);

  useEffect(() => {
    if (barRef.current) {
      barRef.current.style.width = `${Math.min(100, Math.max(4, assetsProgress))}%`;
    }
  }, [assetsProgress]);

  const ready =
    forced || (fontsReady && windowReady && minElapsed && !assetsActive);

  useEffect(() => {
    if (!ready || doneRef.current) return;
    doneRef.current = true;

    document.documentElement.classList.remove("u-loading-lock");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !overlayRef.current) {
      setHidden(true);
      return;
    }
    gsap.to(overlayRef.current, {
      autoAlpha: 0,
      scale: 1.03,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => setHidden(true),
    });
  }, [ready]);

  if (hidden) return null;

  return (
    <div
      ref={overlayRef}
      id="site-loader"
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[999] flex-col items-center justify-center gap-9 bg-u-red"
    >
      <div ref={logoRef} className="u-loader-pulse">
        <Image
          src="/brand/logo-light.webp"
          alt="Utopia Fried Chicken"
          width={1000}
          height={279}
          priority
          className="w-[58vw] max-w-[360px]"
        />
      </div>
      <div className="h-[6px] w-[46vw] max-w-[220px] overflow-hidden rounded-full bg-u-white/25">
        <div
          ref={barRef}
          className="h-full w-[4%] rounded-full bg-u-yellow transition-[width] duration-300 ease-out"
        />
      </div>
      <span className="sr-only">Se încarcă...</span>
    </div>
  );
}

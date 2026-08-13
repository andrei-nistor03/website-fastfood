"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * One place for the page's motion, so the individual sections stay static and
 * server-rendered. The manual asks for the bands to feel struck rather than
 * faded in — every lockup slams down, band by band, and settles into its tilt.
 */
export default function Motion() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Nothing is hidden in the first place when reduced motion is requested
    // (see the `.js-motion` gate in layout.tsx), so there is nothing to undo.
    if (reduced.matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      /* ---------- Hero: one orchestrated entrance on load ---------- */
      const heroBands = gsap.utils.toArray<HTMLElement>(
        "#top [data-lockup] [data-band]",
      );

      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        delay: 0.15,
      });

      // The hero product stack now flies itself in (see HeroProductStack),
      // timed via its own delay to land alongside this sequence.
      tl.from(heroBands, {
        autoAlpha: 0,
        yPercent: -140,
        scaleY: 1.35,
        rotation: "+=7",
        transformOrigin: "left center",
        duration: 0.72,
        stagger: 0.11,
      })
        .from(
          '#top [data-hero="mascot"]',
          { autoAlpha: 0, yPercent: 40, rotation: -8, duration: 0.75, ease: "back.out(1.7)" },
          "-=0.3",
        )
        .from(
          ['#top [data-hero="line"]', '#top [data-hero="cta"]'],
          { autoAlpha: 0, y: 18, duration: 0.65, ease: "power2.out", stagger: 0.09 },
          "-=0.55",
        );

      /* ---------- Hero product drifts as you scroll away ---------- */
      gsap.to('#top [data-hero="product"]', {
        yPercent: 16,
        rotation: 5,
        ease: "none",
        scrollTrigger: {
          trigger: "#top",
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      /* ---------- Every other lockup slams in on scroll ---------- */
      gsap.utils
        .toArray<HTMLElement>("[data-lockup]")
        .filter((el) => !el.closest("#top"))
        .forEach((lockup) => {
          gsap.fromTo(
            lockup.querySelectorAll("[data-band]"),
            { autoAlpha: 0, yPercent: -110, scaleY: 1.25, rotation: "+=6" },
            {
              autoAlpha: 1,
              yPercent: 0,
              scaleY: 1,
              // Relative offsets in a fromTo pair both resolve against the
              // same pre-tween baseline — "+=0" lands back on that baseline
              // (the band's natural tilt), not a further +6.
              rotation: "+=0",
              transformOrigin: "left center",
              duration: 0.6,
              ease: "power4.out",
              stagger: 0.09,
              scrollTrigger: { trigger: lockup, start: "top 88%", once: true },
            },
          );
        });

      /* ---------- Cards ---------- */
      ScrollTrigger.batch('[data-reveal="card"]', {
        start: "top 92%",
        once: true,
        onEnter: (batch) =>
          // fromTo, not from: an implicit "to" (from()'s auto-captured
          // current state) combined with stagger inside a ScrollTrigger
          // batch callback is unreliable here — cards would start tweening
          // and then freeze mid-flight, each stuck at a different partial
          // scale/offset. Explicit endpoints sidestep it entirely.
          gsap.fromTo(
            batch,
            { autoAlpha: 0, y: 34, scale: 0.97 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.55,
              ease: "power3.out",
              stagger: { each: 0.05, from: "start" },
            },
          ),
      });

      /* ---------- Ambient parallax on the blob fragments ---------- */
      gsap.utils.toArray<HTMLElement>("section .u-blob").forEach((blob, i) => {
        gsap.to(blob, {
          yPercent: i % 2 === 0 ? -9 : 9,
          ease: "none",
          scrollTrigger: {
            trigger: blob.closest("section"),
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });

      /* ---------- A little scroll-tied drift on the About mascot, so the
         red section keeps some of the hero's motion. (The Locations mascots
         already animate on hover via CSS transforms — left alone here so
         the two don't fight over the same `transform`.) ---------- */
      const aboutMascot = document.querySelector<HTMLElement>(
        '#despre img[alt=""]',
      );
      if (aboutMascot) {
        gsap.to(aboutMascot, {
          yPercent: -14,
          rotation: -4,
          ease: "none",
          scrollTrigger: {
            trigger: "#despre",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      }
    });

    // Late-loading images and web fonts both change the page height;
    // recalculate once each has settled so trigger positions stay accurate.
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    document.fonts?.ready.then(onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      ctx.revert();
    };
  }, []);

  return null;
}

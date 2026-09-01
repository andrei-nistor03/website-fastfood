"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/prefersReducedMotion";

/**
 * One place for the page's motion, so the individual sections stay static and
 * server-rendered. The manual asks for the bands to feel struck rather than
 * faded in — every lockup slams down, band by band, and settles into its tilt.
 */
export default function Motion() {
  useEffect(() => {
    // Nothing is hidden in the first place when reduced motion is requested
    // (see the `.js-motion` gate in layout.tsx), so there is nothing to undo.
    if (prefersReducedMotion()) return;

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

    // Landing here with a `#section` hash (e.g. a header/footer link clicked
    // from a legal page) needs its own handling: the bucket-drop pin
    // (MenuBucketDrop.tsx) is armed asynchronously during hydration and, once
    // it is, inserts a pin-spacer that pushes #locatii/#despre further down —
    // exactly how much further isn't knowable up front. Rather than guess at
    // a fixed number, keep re-measuring the target's live position every
    // frame and snapping to it, until it holds still for a few frames in a
    // row (layout has settled) or a timeout gives up. All of this happens
    // behind the full-screen loader overlay, so the interim jumps aren't seen.
    let settleRaf = 0;
    const hash = window.location.hash;
    if (hash) {
      const html = document.documentElement;
      const prevScrollBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";

      const STABLE_FRAMES_NEEDED = 6;
      const deadline = Date.now() + 3000;
      let lastY = -1;
      let stableFrames = 0;

      // MenuBucketDrop's <Canvas> is `hidden md:block` (see MenuBucketDrop.tsx)
      // — below that breakpoint it never mounts, so its "bucket-drop"
      // ScrollTrigger never arms. Below, don't wait on a pin that will
      // never exist, or this loop burns its full 3s deadline forcing the
      // scroll position back every frame — fighting any manual scroll the
      // user makes in that window.
      const canArmPin = window.matchMedia("(min-width: 768px)").matches;

      const settle = () => {
        const target = document.querySelector(hash);
        if (target instanceof HTMLElement) {
          // The bucket-drop pin lives inside a react-three-fiber <Canvas>,
          // which mounts on its own schedule rather than in lockstep with
          // this effect — so on the first several frames here the pin (and
          // its pin-spacer) can easily not exist yet. Nothing having moved
          // yet is not the same as layout having settled: until the trigger
          // shows up, hold off counting frames as "stable" at all, or this
          // loop locks in the pre-spacer position and quits before the
          // ~1200px reservation ever lands.
          const pinArmed = canArmPin ? !!ScrollTrigger.getById("bucket-drop") : true;
          const y = target.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: y, left: 0, behavior: "instant" });
          stableFrames =
            pinArmed && Math.abs(y - lastY) < 1 ? stableFrames + 1 : 0;
          lastY = y;
        }
        if (stableFrames >= STABLE_FRAMES_NEEDED || Date.now() > deadline) {
          html.style.scrollBehavior = prevScrollBehavior;
          return;
        }
        settleRaf = requestAnimationFrame(settle);
      };
      settleRaf = requestAnimationFrame(settle);
    }

    return () => {
      window.removeEventListener("load", onLoad);
      cancelAnimationFrame(settleRaf);
      ctx.revert();
    };
  }, []);

  return null;
}

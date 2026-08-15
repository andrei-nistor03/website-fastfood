import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

// Nav-triggered jumps should skip the bucket-drop pin's ~1200px scrub range
// (see MenuBucketDrop.tsx) instead of scrubbing through it. Toggling the
// trigger's enabled state around the jump turned out fragile — GSAP's own
// pin-spacer rebuild can lag behind by a debounced resize-refresh, which
// either drops the Menu section's reserved scroll space or shifts sections
// below it after the fact. So instead we never touch the trigger at all:
// ease up to the near edge of its active range, teleport straight across it
// in one jump (so GSAP's scroll listener never renders an in-between,
// still-pinned frame), then ease the rest of the way from the far edge.
export function scrollToSection(href: string) {
  const target = document.querySelector(href);
  if (!(target instanceof HTMLElement)) return;

  const html = document.documentElement;
  const prevScrollBehavior = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  const restoreScrollBehavior = () => {
    html.style.scrollBehavior = prevScrollBehavior;
  };

  const currentY = window.scrollY;
  const targetY = target.getBoundingClientRect().top + currentY;

  const pin = ScrollTrigger.getById("bucket-drop");
  const PIN_EDGE_BUFFER = 4;
  const crossesPin =
    pin &&
    ((currentY <= pin.start && targetY >= pin.end) ||
      (currentY >= pin.end && targetY <= pin.start));

  // CSS `scroll-behavior: smooth` (globals.css) fights ScrollToPlugin's own
  // frame-by-frame scrollTo calls — each one kicks off its own native smooth
  // animation, so the browser and gsap chase a moving target and autoKill
  // reads that as user interference. Forcing `auto` for the duration of the
  // JS-driven scroll avoids that fight.
  const tweenTo = (y: number, onComplete?: () => void) => {
    const duration = gsap.utils.clamp(0.3, 1.4, Math.abs(y - window.scrollY) / 1400);
    gsap.to(window, {
      duration,
      ease: "power2.inOut",
      scrollTo: { y, autoKill: true },
      onComplete,
    });
  };

  if (crossesPin && pin) {
    const enteringFromTop = currentY <= pin.start;
    const nearEdge = enteringFromTop ? pin.start - PIN_EDGE_BUFFER : pin.end + PIN_EDGE_BUFFER;
    const farEdge = enteringFromTop ? pin.end + PIN_EDGE_BUFFER : pin.start - PIN_EDGE_BUFFER;

    tweenTo(nearEdge, () => {
      window.scrollTo(0, farEdge);
      tweenTo(targetY, restoreScrollBehavior);
    });
  } else {
    tweenTo(targetY, restoreScrollBehavior);
  }
}

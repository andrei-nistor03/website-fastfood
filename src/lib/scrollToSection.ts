import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

/**
 * Where the page should scroll to for a section. Normally its top; sections
 * marked `data-scroll-align="end"` (Locații, whose Wolt order buttons sit at
 * the bottom) align their bottom edge with the viewport's instead — unless the
 * whole section already fits, in which case its top is used.
 */
export function sectionScrollY(target: HTMLElement) {
  const rect = target.getBoundingClientRect();
  const top = rect.top + window.scrollY;
  if (target.dataset.scrollAlign !== "end") return top;
  return Math.max(top, rect.bottom + window.scrollY - window.innerHeight);
}

export function scrollToSection(href: string) {
  const target = document.querySelector(href);
  if (!(target instanceof HTMLElement)) return;

  const html = document.documentElement;
  const prevScrollBehavior = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  const restoreScrollBehavior = () => {
    html.style.scrollBehavior = prevScrollBehavior;
  };

  const targetY = sectionScrollY(target);

  // CSS `scroll-behavior: smooth` (globals.css) fights ScrollToPlugin's own
  // frame-by-frame scrollTo calls — each one kicks off its own native smooth
  // animation, so the browser and gsap chase a moving target and autoKill
  // reads that as user interference. Forcing `auto` for the duration of the
  // JS-driven scroll avoids that fight.
  //
  // autoKill is also why the mobile "Vezi meniul" jump used to fizzle out
  // after a tiny glitch: iOS/Android keep the page coasting on momentum for
  // a moment after a finger lifts, and tapping a nav link while that
  // momentum is still settling fires native `scroll`/`touchmove` events
  // that ScrollToPlugin's autoKill mistakes for the user manually
  // scrolling, killing the tween a frame or two after it starts. These are
  // deliberate, click-triggered jumps rather than something a stray scroll
  // should be allowed to cancel, so autoKill is off here.
  const tweenTo = (y: number, onComplete?: () => void) => {
    const duration = gsap.utils.clamp(0.3, 1.4, Math.abs(y - window.scrollY) / 1400);
    gsap.to(window, {
      duration,
      ease: "power2.inOut",
      scrollTo: { y, autoKill: false },
      onComplete,
    });
  };

  tweenTo(targetY, restoreScrollBehavior);
}

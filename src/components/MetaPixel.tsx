"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getConsent, onConsentChange, type Consent } from "@/lib/consent";
import { eventForLink, loadPixel, revokePixel, trackEvent } from "@/lib/meta";

/**
 * Wires the Meta Pixel + Conversions API into the site. Renders nothing.
 *
 * - PageView on every route change
 * - ViewContent when the menu section scrolls into view / on /alergeni
 * - InitiateCheckout on "Comandă pe Wolt" clicks, FindLocation on Maps clicks
 *   (detected by link URL, so the server components need no changes)
 */
export default function MetaPixel() {
  const pathname = usePathname();
  const [consent, setConsentState] = useState<Consent>(null);

  useEffect(() => {
    setConsentState(getConsent());
    return onConsentChange(setConsentState);
  }, []);

  useEffect(() => {
    if (consent === "granted") loadPixel();
    else if (consent === "denied") revokePixel();
  }, [consent]);

  useEffect(() => {
    if (consent !== "granted") return;
    trackEvent("PageView");
    if (pathname === "/alergeni") {
      trackEvent("ViewContent", {
        content_name: "Alergeni",
        content_category: "Meniu",
      });
    }
  }, [pathname, consent]);

  useEffect(() => {
    if (consent !== "granted") return;
    const menu = document.getElementById("meniu");
    if (!menu) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          trackEvent("ViewContent", {
            content_name: "Meniu",
            content_category: "Meniu",
          });
          io.disconnect();
        }
      },
      // Counts once the menu reaches the upper ~60% of the screen.
      { rootMargin: "0px 0px -40% 0px" },
    );
    io.observe(menu);
    return () => io.disconnect();
  }, [pathname, consent]);

  useEffect(() => {
    if (consent !== "granted") return;
    const onClick = (e: MouseEvent) => {
      // auxclick also fires for right-click; only middle-click opens a tab.
      if (e.type === "auxclick" && e.button !== 1) return;
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      const event = eventForLink(link.href);
      if (event) trackEvent(event.name, event.data);
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("auxclick", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("auxclick", onClick, true);
    };
  }, [consent]);

  return null;
}

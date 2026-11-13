/**
 * Meta Pixel + Conversions API, browser side.
 *
 * Every event is sent twice: once by the Pixel in the browser and once by our
 * own server (/api/meta-events → Conversions API). Both copies carry the same
 * event_id, which is how Meta deduplicates them into one event.
 *
 * Nothing here runs without marketing consent — see lib/consent.ts.
 */

import { getConsent } from "./consent";

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  push?: Fbq;
  loaded?: boolean;
  version?: string;
  disablePushState?: boolean;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

export const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/** Only standard events, so ads can optimise for them directly. */
export type MetaEventName =
  | "PageView"
  | "ViewContent"
  | "InitiateCheckout"
  | "FindLocation";

export type MetaCustomData = {
  content_name?: string;
  content_category?: string;
};

/** Loads Meta's fbevents.js — the official base snippet, written out in TS. */
export function loadPixel() {
  if (!PIXEL_ID || typeof window === "undefined") return;
  if (window.fbq) {
    window.fbq("consent", "grant");
    return;
  }

  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod.apply(fbq, args);
    else fbq.queue!.push(args);
  } as Fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  // The App Router changes pages without a reload; we send PageView ourselves
  // on every route change (with an event_id), so stop the Pixel from also
  // auto-firing one on history changes — that would double count.
  fbq.disablePushState = true;
  window.fbq = fbq;
  window._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  fbq("init", PIXEL_ID);
}

/** Visitor withdrew consent: stop the Pixel and drop its cookies. */
export function revokePixel() {
  window.fbq?.("consent", "revoke");
  const host = location.hostname;
  const domains = ["", `; Domain=${host}`, `; Domain=.${host.replace(/^www\./, "")}`];
  for (const name of ["_fbp", "_fbc"]) {
    for (const domain of domains) {
      document.cookie = `${name}=; Path=/; Max-Age=0${domain}`;
    }
  }
}

function newEventId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function trackEvent(eventName: MetaEventName, customData: MetaCustomData = {}) {
  if (!PIXEL_ID || getConsent() !== "granted") return;

  const eventId = newEventId();

  // 1) Browser copy (Pixel).
  window.fbq?.("track", eventName, customData, { eventID: eventId });

  // 2) Server copy (Conversions API). sendBeacon survives the page being left,
  //    which matters for Wolt / Maps clicks that navigate away immediately.
  const body = JSON.stringify({
    eventName,
    eventId,
    eventSourceUrl: location.href,
    referrerUrl: document.referrer || undefined,
    customData,
  });
  const url = "/api/meta-events";
  const sent =
    typeof navigator.sendBeacon === "function" &&
    navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
  if (!sent) {
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  }
}

/** Maps an outbound link to the conversion it represents, if any. */
export function eventForLink(
  href: string,
): { name: MetaEventName; data: MetaCustomData } | null {
  let url: URL;
  try {
    url = new URL(href, location.href);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, "");

  if (host === "wolt.com" || host.endsWith(".wolt.com")) {
    // /ro/rou/<city>/restaurant/<slug>
    const city = url.pathname.split("/")[3];
    return {
      name: "InitiateCheckout",
      data: {
        content_name: city ? `Comandă Wolt — ${city}` : "Comandă Wolt",
        content_category: "Livrare",
      },
    };
  }

  const isGoogleMaps =
    host === "maps.app.goo.gl" ||
    host === "maps.google.com" ||
    (/^google\.[a-z.]+$/.test(host) && url.pathname.startsWith("/maps"));
  if (isGoogleMaps) {
    return {
      name: "FindLocation",
      data: { content_name: "Google Maps", content_category: "Locații" },
    };
  }

  return null;
}

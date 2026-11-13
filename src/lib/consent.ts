/**
 * Marketing-cookie consent (GDPR). Stored in a first-party cookie rather than
 * localStorage so the server route can check it too, not just the browser.
 * The cookie itself is strictly necessary (it only remembers the choice).
 */

export type Consent = "granted" | "denied" | null;

export const CONSENT_COOKIE = "utopia_consent";
const CHANGE_EVENT = "utopia:consent-change";
const OPEN_EVENT = "utopia:consent-open";
const MAX_AGE = 60 * 60 * 24 * 180; // ask again after ~6 months

export function getConsent(): Consent {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${CONSENT_COOKIE}=(granted|denied)`),
  );
  return (match?.[1] as Consent) ?? null;
}

export function setConsent(value: Exclude<Consent, null>) {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${value}; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax${secure}`;
  window.dispatchEvent(new CustomEvent<Consent>(CHANGE_EVENT, { detail: value }));
}

export function onConsentChange(cb: (value: Consent) => void) {
  const handler = (e: Event) => cb((e as CustomEvent<Consent>).detail);
  window.addEventListener(CHANGE_EVENT, handler);
  return () => window.removeEventListener(CHANGE_EVENT, handler);
}

/** Re-opens the banner so a visitor can change their mind (GDPR withdrawal). */
export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onConsentSettingsOpen(cb: () => void) {
  window.addEventListener(OPEN_EVENT, cb);
  return () => window.removeEventListener(OPEN_EVENT, cb);
}

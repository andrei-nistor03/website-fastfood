"use client";

import { useEffect, useState } from "react";
import {
  getConsent,
  onConsentSettingsOpen,
  setConsent,
} from "@/lib/consent";

/**
 * GDPR banner for marketing cookies (Meta Pixel / Conversions API).
 * Shown until the visitor chooses; reopened from "Setări cookie-uri" in the
 * footer. Accept and refuse get equal weight, as regulators expect.
 */
export default function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (getConsent() === null) setOpen(true);
    return onConsentSettingsOpen(() => setOpen(true));
  }, []);

  if (!open) return null;

  const choose = (value: "granted" | "denied") => {
    setConsent(value);
    setOpen(false);
  };

  const button =
    "flex-1 cursor-pointer border-[3px] px-5 py-3 font-display text-[0.95rem] font-black uppercase leading-none tracking-[-0.01em] transition-colors duration-150 sm:flex-none";

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Preferințe cookie-uri"
      className="fixed inset-x-4 bottom-4 z-[900] mx-auto max-w-[640px] border-[3px] border-u-white bg-u-ink p-5 text-u-white shadow-[6px_6px_0_0_#000] md:bottom-6 md:p-6"
    >
      <p className="u-eyebrow mb-2 text-u-yellow">
        Confidențialitatea ta contează
      </p>
      <p className="text-[0.98rem] leading-[1.5] text-u-white/85">
        Folosim cookie-uri strict necesare pentru funcționarea site-ului. Cu
        acordul tău, folosim și cookie-uri de marketing, furnizate de Meta,
        pentru a măsura și îmbunătăți eficiența campaniilor noastre
        publicitare. Îți poți modifica oricând alegerea din „Setări
        cookie-uri”, în subsolul paginii. Află mai multe în{" "}
        <a
          href="/politica-cookie-uri"
          className="underline decoration-u-white/40 underline-offset-2 hover:text-u-yellow"
        >
          Politica de cookie-uri
        </a>
        .
      </p>
      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={() => choose("granted")}
          className={`${button} border-u-yellow bg-u-yellow text-u-black hover:bg-u-white hover:border-u-white`}
        >
          Accept toate
        </button>
        <button
          type="button"
          onClick={() => choose("denied")}
          className={`${button} border-u-white bg-transparent text-u-white hover:bg-u-white hover:text-u-black`}
        >
          Doar necesare
        </button>
      </div>
    </div>
  );
}

"use client";

import { openConsentSettings } from "@/lib/consent";

/** Footer link that reopens the cookie banner, so consent can be withdrawn. */
export default function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={openConsentSettings}
      className="cursor-pointer text-left hover:text-u-yellow"
    >
      Setări cookie-uri
    </button>
  );
}

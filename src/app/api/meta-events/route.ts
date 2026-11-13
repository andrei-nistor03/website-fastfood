import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { CONSENT_COOKIE } from "@/lib/consent";

/**
 * Server half of the Meta integration: receives an event from the browser,
 * enriches it with what only the server sees reliably (IP, user agent, the
 * _fbp/_fbc cookies) and forwards it to the Conversions API.
 *
 * Env: NEXT_PUBLIC_META_PIXEL_ID, META_CAPI_ACCESS_TOKEN,
 *      optional META_TEST_EVENT_CODE, optional META_GRAPH_API_VERSION.
 */

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE;
const GRAPH_VERSION = process.env.META_GRAPH_API_VERSION || "v24.0";

const ALLOWED_EVENTS = new Set([
  "PageView",
  "ViewContent",
  "InitiateCheckout",
  "FindLocation",
]);
const ALLOWED_CUSTOM_KEYS = ["content_name", "content_category"] as const;

type IncomingEvent = {
  eventName?: unknown;
  eventId?: unknown;
  eventSourceUrl?: unknown;
  referrerUrl?: unknown;
  customData?: unknown;
};

const noContent = () => new NextResponse(null, { status: 204 });

function str(value: unknown, max: number) {
  return typeof value === "string" && value.length > 0 && value.length <= max
    ? value
    : undefined;
}

function clientIp(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? undefined;
}

export async function POST(req: NextRequest) {
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.warn("[meta-events] Pixel ID or access token missing — event skipped.");
    return noContent();
  }

  // The browser only calls us after consent, but don't take its word for it.
  if (req.cookies.get(CONSENT_COOKIE)?.value !== "granted") return noContent();

  let body: IncomingEvent;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventName = str(body.eventName, 50);
  const eventId = str(body.eventId, 100);
  const eventSourceUrl = str(body.eventSourceUrl, 2000);
  if (!eventName || !ALLOWED_EVENTS.has(eventName) || !eventId || !eventSourceUrl) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  // Only accept events about pages on this site.
  let sourceUrl: URL;
  try {
    sourceUrl = new URL(eventSourceUrl);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (host && sourceUrl.host !== host) {
    return NextResponse.json({ error: "Foreign URL" }, { status: 400 });
  }

  const customData: Record<string, string> = {};
  if (body.customData && typeof body.customData === "object") {
    for (const key of ALLOWED_CUSTOM_KEYS) {
      const value = str((body.customData as Record<string, unknown>)[key], 150);
      if (value) customData[key] = value;
    }
  }

  // _fbc is normally set by the Pixel; if it hasn't run yet, rebuild it from
  // the ad click ID in the URL (format documented by Meta).
  const fbclid = sourceUrl.searchParams.get("fbclid");
  const fbc =
    req.cookies.get("_fbc")?.value ??
    (fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined);
  const fbp = req.cookies.get("_fbp")?.value;
  const userAgent = req.headers.get("user-agent") ?? undefined;
  const ip = clientIp(req);

  const userData: Record<string, string> = {};
  if (ip) userData.client_ip_address = ip;
  if (userAgent) userData.client_user_agent = userAgent;
  if (fbp) {
    userData.fbp = fbp;
    // Stable anonymous ID per browser helps Meta link events together.
    userData.external_id = createHash("sha256").update(fbp).digest("hex");
  }
  if (fbc) userData.fbc = fbc;

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: "website",
        event_source_url: eventSourceUrl,
        ...(str(body.referrerUrl, 2000) && { referrer_url: body.referrerUrl }),
        user_data: userData,
        ...(Object.keys(customData).length > 0 && { custom_data: customData }),
      },
    ],
  };
  if (TEST_EVENT_CODE) payload.test_event_code = TEST_EVENT_CODE;

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(ACCESS_TOKEN)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      },
    );
    if (!res.ok) {
      console.error("[meta-events] Conversions API error", res.status, await res.text());
    }
  } catch (err) {
    console.error("[meta-events] Conversions API request failed", err);
  }

  return noContent();
}

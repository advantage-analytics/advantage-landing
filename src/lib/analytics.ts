// Fire-and-forget analytics dispatch.
//
// Vercel Web Analytics is the destination that actually exists — it is mounted
// in the root layout, so `send_a_match_submitted` and friends land somewhere a
// person can read. The rest is kept because it costs nothing: the event still
// goes to whatever tag happens to be on the page (GTM's dataLayer, gtag,
// Plausible) and always emits a DOM event, so a tag added later can listen for
// `advantage:analytics` without any call site changing. Every path is wrapped:
// a missing or broken analytics tag must never take a submission down with it.

import { track } from "@vercel/analytics";

type EventProps = Record<string, string | number | boolean | undefined>;

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (command: string, name: string, props?: EventProps) => void;
  plausible?: (name: string, options?: { props: EventProps }) => void;
};

export function trackEvent(name: string, props: EventProps = {}): void {
  if (typeof window === "undefined") return;
  const w = window as AnalyticsWindow;
  try {
    // Vercel rejects undefined in a property bag, and an omitted key reads the
    // same in its UI as one that was never set.
    track(
      name,
      Object.fromEntries(
        Object.entries(props).filter(([, value]) => value !== undefined),
      ) as Record<string, string | number | boolean>,
    );
    w.dataLayer?.push({ event: name, ...props });
    w.gtag?.("event", name, props);
    w.plausible?.(name, { props });
    window.dispatchEvent(
      new CustomEvent("advantage:analytics", { detail: { name, ...props } }),
    );
  } catch (err) {
    console.warn("[analytics] event dropped:", err);
  }
}

// The two launch CTAs. One event name per lane, with `placement` saying which
// button on which page, so the beta/pilot split is readable per surface.
export type CtaLane = "join_free_beta" | "apply_for_pilot";
export function trackCta(lane: CtaLane, placement: string): void {
  trackEvent(`${lane}_click`, { placement });
}

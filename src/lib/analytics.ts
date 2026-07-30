// Fire-and-forget analytics dispatch.
//
// The site carries no analytics library yet, so this hands the event to
// whatever tag happens to be on the page (GTM's dataLayer, gtag, Plausible)
// and always emits a DOM event as well — so a tag added later can listen for
// `advantage:analytics` without any call site changing. Every path is wrapped:
// a missing or broken analytics tag must never take a submission down with it.

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

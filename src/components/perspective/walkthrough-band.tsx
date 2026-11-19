"use client";

import { useEffect, type ReactNode } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { CAL_WALKTHROUGH } from "@/lib/links";
import { trackEvent } from "@/lib/analytics";
import "./booking.css";

/* The college-coach walkthrough on Cal.com (20 min, Zoom), themed to the
   site's blue. Two ways in: the calendar inline on /contact, and a pop-up from
   a button anywhere else (the /pricing plan columns and closing band).

   Where a booking came from travels with it as `metadata[placement]`, and the
   plan a coach was looking at as `metadata[plan]`. Cal.com hands both back in
   the BOOKING_CREATED webhook (/api/cal-booking), so the lead email says which
   page booked it and for which plan. */

const NAMESPACE = "walkthrough";

// Cal.com's embed CSS variables (cal.com/docs, "Customize the embed with CSS
// variables"), named without the leading "--".
const CAL_VARS = {
  "cal-brand": "#3B82F6",
  "cal-bg": "#FFFFFF",
  "cal-text": "#0D0D0D",
  "cal-text-subtle": "#525252",
  "cal-border-subtle": "#F3F3F3",
};

function bookingConfig(placement: string, plan?: string) {
  return {
    layout: "month_view",
    theme: "light",
    "metadata[placement]": placement,
    ...(plan ? { "metadata[plan]": plan } : {}),
  } as const;
}

/* The theme and the booked listener are set once per page load, however many
   buttons mount and remount: Cal.com keeps both for the namespace, so a second
   call would only add a second listener. A failed load is not kept, so a later
   mount retries. The booking is credited to whichever way in the coach used
   last. */
let lastPlacement = "";
let calReady: Promise<unknown> | null = null;

// `inline`: the calendar is on the page, so a booking there is its own.
function useCal(placement: string, inline = false) {
  useEffect(() => {
    if (inline || !lastPlacement) lastPlacement = placement;
    calReady ??= getCalApi({ namespace: NAMESPACE }).then((cal) => {
      cal("ui", {
        theme: "light",
        layout: "month_view",
        hideEventTypeDetails: false,
        // The site's palette.
        cssVarsPerTheme: {
          light: CAL_VARS,
          dark: CAL_VARS,
        },
      });
      cal("on", {
        action: "bookingSuccessfulV2",
        callback: () => trackEvent("walkthrough_booked", { placement: lastPlacement }),
      });
    }).catch((err) => {
      // The embed script didn't load (offline, or blocked). Forget the
      // attempt so the next button or calendar that mounts tries again.
      console.warn("[cal] Embed failed to load:", err);
      calReady = null;
    });
  }, [placement, inline]);
}

/* A button that opens the booking as Cal.com's pop-up. Styling is the
   caller's: pass the button class. The embed script binds to the data-cal-*
   attributes. */
export function BookCallButton({
  className,
  placement,
  plan,
  children = "Book a call",
  onOpen,
}: {
  className?: string;
  placement: string;
  plan?: string;
  children?: ReactNode;
  // Runs on click, after the walkthrough_opened event: the caller's own
  // tracking (the /pricing plan columns send plan_cta_clicked).
  onOpen?: () => void;
}) {
  useCal(placement);
  return (
    <button
      type="button"
      className={className}
      data-cal-namespace={NAMESPACE}
      data-cal-link={CAL_WALKTHROUGH}
      data-cal-config={JSON.stringify(bookingConfig(placement, plan))}
      onClick={() => {
        lastPlacement = placement;
        trackEvent("walkthrough_opened", { placement, plan: plan ?? "" });
        onOpen?.();
      }}
    >
      {children}
    </button>
  );
}

/* The calendar itself, inline (/contact). It fills its box, so the caller
   sizes it (booking.css gives `.cal-inline` a height). */
export function WalkthroughCalendar({ placement }: { placement: string }) {
  useCal(placement, true);
  return <Cal className="cal-inline" namespace={NAMESPACE} calLink={CAL_WALKTHROUGH} config={bookingConfig(placement)} />;
}

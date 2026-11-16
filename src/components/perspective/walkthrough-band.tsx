"use client";

import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";
import { CalendarDays } from "lucide-react";
import { CAL_WALKTHROUGH } from "@/lib/links";
import { trackEvent } from "@/lib/analytics";
import "./booking.css";

/* The coach walkthrough on Cal.com, a pop-up from /contact, themed to the
   site's blue.

   Where a booking came from travels with it as `metadata[placement]`, which
   Cal.com hands back in the BOOKING_CREATED webhook (/api/cal-booking), so the
   Airtable row says which page booked it. */

const NAMESPACE = "walkthrough";

function useCalTheme(placement: string) {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const cal = await getCalApi({ namespace: NAMESPACE });
      if (cancelled) return;
      cal("ui", {
        theme: "light",
        layout: "month_view",
        hideEventTypeDetails: false,
        cssVarsPerTheme: {
          light: { "cal-brand": "#3B82F6" },
          dark: { "cal-brand": "#3B82F6" },
        },
      });
      cal("on", {
        action: "bookingSuccessfulV2",
        callback: () => trackEvent("walkthrough_booked", { placement }),
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [placement]);
}

/* /contact's second direct line, under the email: the same look, a button
   because it opens Cal.com's pop-up rather than leaving the page. The embed
   script binds to the data-cal-* attributes. */
export function BookCallLink() {
  useCalTheme("contact");
  return (
    <button
      type="button"
      className="contact-email contact-book"
      data-cal-namespace={NAMESPACE}
      data-cal-link={CAL_WALKTHROUGH}
      data-cal-config={JSON.stringify({
        layout: "month_view",
        theme: "light",
        "metadata[placement]": "contact",
      })}
      onClick={() => trackEvent("walkthrough_opened", { placement: "contact" })}
    >
      <span className="ce-label">College coaches · 20 min</span>
      <span className="ce-value">
        Book a walkthrough
        <CalendarDays size={17} strokeWidth={1.6} aria-hidden="true" />
      </span>
    </button>
  );
}

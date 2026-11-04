"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { CalendarDays } from "lucide-react";
import { ProofHead } from "./band-parts";
import { CAL_WALKTHROUGH, CONTACT_EMAIL } from "@/lib/links";
import { trackEvent } from "@/lib/analytics";
import "./booking.css";

/* The pilot walkthrough on Cal.com: inline in a band on /pilot, a pop-up from
   /contact. Both share one embed namespace, themed once to the site's blue.

   Where a booking came from travels with it as `metadata[placement]`, which
   Cal.com hands back in the BOOKING_CREATED webhook (/api/cal-booking), so the
   Airtable row says which page booked it. */

const NAMESPACE = "pilot-walkthrough";

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

/* The optional call for coaches, between the FAQ and the way in on /pilot. */
export function WalkthroughBand() {
  useCalTheme("pilot-band");
  return (
    <section className="band" id="walkthrough">
      <div className="wrap">
        <ProofHead
          eyebrow="Rather talk it through"
          title="Book a 20-minute walkthrough."
          aside="Optional, and for coaches. We open the dashboard on a match like yours and answer whatever this page leaves open."
        />
        <div className="book book-band reveal">
          <Cal
            namespace={NAMESPACE}
            calLink={CAL_WALKTHROUGH}
            className="book-embed"
            config={{
              layout: "month_view",
              theme: "light",
              "metadata[placement]": "pilot-band",
            }}
          />
        </div>
        <p className="book-foot reveal">
          Times show in your own time zone. Prefer email?{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </div>
    </section>
  );
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

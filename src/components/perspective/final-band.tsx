import type { ReactNode } from "react";
import { FreeMatchLink, TalkToUsLink } from "./cta-links";
import { FREE_MATCH_LINE, FREE_MATCH_OFFER } from "@/lib/plans";
import { LiveDots } from "./live-dots";

/* The page's one dark band: the closing ask and the hero's two buttons again.
   The hero promised what the product does; by here the visitor has seen it,
   so the headline names the first move instead of repeating the promise. The
   ghost button wears the same glass as the header and hero CTAs, so the three
   dark-surface buttons on the site are one control.

   Every page closes on it. Without props it is the home page's close; a page
   passes its own headline, buttons and note, or just its `placement` to keep
   the two default buttons and tag their clicks. */
export function FinalBand({
  eyebrow = "Get started",
  title = FREE_MATCH_OFFER ? FREE_MATCH_LINE : "Start with the match you already filmed.",
  placement = "home-final",
  actions,
  note = "Start with the match you already filmed.",
}: {
  eyebrow?: ReactNode;
  title?: ReactNode;
  placement?: string;
  actions?: ReactNode;
  note?: ReactNode;
}) {
  return (
    <section className="band final-band" id="start">
      <div className="ac-glow" aria-hidden="true" />
      <LiveDots className="ac-grain" energy={1} />
      <div className="final-inner reveal">
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        <div className="final-actions">
          {actions ?? (
            <>
              <FreeMatchLink className="hbtn hbtn-white" placement={placement} />
              <TalkToUsLink className="hbtn hbtn-glass" placement={placement} />
            </>
          )}
        </div>
        {note ? <span className="final-note">{note}</span> : null}
      </div>
    </section>
  );
}

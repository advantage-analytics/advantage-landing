import type { ReactNode } from "react";
import { ProofHead } from "./band-parts";
import { PILOT_TERMS } from "@/lib/pilot";

/* The fall pilot's commercial terms, told in the page's data voice. Built as
   the home bands are: a full-width head (headline left, the aside flush right
   on its last baseline), then the four terms as one strip of figures across
   the container. Deliberately not a pricing card: no box, no shadow, no tiers.
   Hairline columns and light figures say "these are the facts" where a card
   would say "here is our product tier".

   It reads PILOT_TERMS, so the strip and the rest of /pilot can never quote
   different numbers. No "use client": static markup, rendered on the server. */
export function PilotTermsBand({
  id,
  alt = false,
  eyebrow,
  title,
  aside,
}: {
  id: string;
  alt?: boolean;
  eyebrow: ReactNode;
  title: ReactNode;
  aside: ReactNode;
}) {
  return (
    <section className={`band${alt ? " alt" : ""}`} id={id}>
      <div className="wrap">
        <ProofHead eyebrow={eyebrow} title={title} aside={aside} />
        <dl className="pv-terms reveal">
          {PILOT_TERMS.map((t, i) => (
            // A <dl>'s <div> wrapper may hold only dt/dd, so the index sits
            // inside the <dt> rather than beside it.
            <div className="pv-term" key={t.l}>
              <dt className="l">
                <span className="n" aria-hidden="true">
                  0{i + 1}
                </span>
                {t.l}
              </dt>
              <dd className="v">{t.v}</dd>
              <dd className="s">{t.s}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

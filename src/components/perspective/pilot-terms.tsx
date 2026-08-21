import type { ReactNode } from "react";
import Link from "next/link";
import { Icon } from "./icons";
import { PILOT_TERMS } from "@/lib/pilot";

/* The fall pilot's commercial terms, told in the page's data voice: a narrow
   statement column beside a four-row ledger. Deliberately not a pricing card —
   no box, no shadow, no tiers. Hairline rows and tabular figures say "these are
   the facts" where a card would say "here is our product tier".

   One band, two placements: the landing page shows it with a link through to
   /pilot, and /pilot shows it as its own opening section. Both read the same
   PILOT_TERMS, so the two can never quote different numbers.

   No "use client" here on purpose — it is static markup, so on /pilot (a server
   component) it renders entirely on the server and ships no client JS. The
   landing page's client tree can still import it normally. */
export function PilotTermsBand({
  id,
  alt = false,
  eyebrow,
  title,
  body,
  cta,
}: {
  id: string;
  alt?: boolean;
  eyebrow: ReactNode;
  title: ReactNode;
  body: ReactNode;
  cta?: { href: string; label: string };
}) {
  return (
    <section className={`band${alt ? " alt" : ""} pilot-band`} id={id}>
      <div className="wrap">
        <div className="pb-grid reveal">
          <div className="pb-intro">
            <span className="eyebrow">{eyebrow}</span>
            <h3>{title}</h3>
            <p>{body}</p>
            {cta ? (
              <Link className="pb-link" href={cta.href}>
                {cta.label} <Icon n="arrow" size={13} />
              </Link>
            ) : null}
          </div>
          <dl className="pb-ledger">
            {PILOT_TERMS.map((t, i) => (
              <div className="pb-row" key={t.l}>
                <span className="n" aria-hidden="true">
                  0{i + 1}
                </span>
                <dt className="l">{t.l}</dt>
                <dd className="v">
                  {t.v}
                  {t.s ? <small>{t.s}</small> : null}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

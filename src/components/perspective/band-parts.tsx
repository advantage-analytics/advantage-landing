import type { CSSProperties, ReactNode } from "react";

/* Two pieces the launch bands share. No "use client": both are static markup,
   so the server-safe bands (beta terms, FAQ) can use them without shipping JS.

   BandHead — the section header in its split form: eyebrow and headline on the
   left, a short aside bottom-aligned on the right. Same .show-head row the
   dashboard showcase has always used, so every band on the page sits on one
   header rhythm.

   ProofSide — the left column of a proof band (breakdown, film room, team):
   copy, and for the team band the coach's action, beside a product board. */

export function BandHead({
  eyebrow,
  title,
  aside,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="show-head reveal">
      <div className="sec-head">
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h2>{title}</h2>
      </div>
      {aside ? <p className="band-aside">{aside}</p> : null}
    </div>
  );
}

/* ProofSide — the left column of a proof band: eyebrow, headline and aside
   at the top, the support (the team CTA) pinned to the bottom so it ends
   level with the board beside it. The board is the band's primary; this
   column captions it, which is why the headline is a size down from the
   full-width band head. */
export function ProofSide({
  eyebrow,
  title,
  aside,
  children,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  aside?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="proof-side">
      <div className="proof-head reveal">
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h2>{title}</h2>
        {aside ? <p className="band-aside">{aside}</p> : null}
      </div>
      {children ? <div className="proof-support">{children}</div> : null}
    </div>
  );
}

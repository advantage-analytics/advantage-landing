import type { ReactNode } from "react";

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

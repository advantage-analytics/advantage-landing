import type { ReactNode } from "react";

/* ProofHead — the head of a product band, built as How it works' and the
   beta band's are: eyebrow and headline on the left, the aside flush right
   with its last line on the headline's last baseline. The board runs the
   container's full width below it. */
export function ProofHead({
  eyebrow,
  title,
  aside,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="proof-head reveal">
      <div className="sec-head">
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h2>{title}</h2>
      </div>
      {aside ? <p className="band-aside">{aside}</p> : null}
    </div>
  );
}

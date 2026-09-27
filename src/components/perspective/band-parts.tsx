import type { CSSProperties, ReactNode } from "react";

/* Two pieces the launch bands share. No "use client": both are static markup,
   so the server-safe bands (beta terms, FAQ) can use them without shipping JS.

   BandHead — the section header in its split form: eyebrow and headline on the
   left, a short aside bottom-aligned on the right. Same .show-head row the
   dashboard showcase has always used, so every band on the page sits on one
   header rhythm.

   Trio — a three-column numbered ledger under a hairline. Film room uses it for
   the three notes under its mock; How it works uses it for the three steps. */

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

export type TrioItem = { k: string; t: string; p: ReactNode };

export function Trio({ items, label }: { items: readonly TrioItem[]; label?: string }) {
  return (
    <ol className="trio" aria-label={label}>
      {items.map((it, i) => (
        <li className="trio-item reveal" key={it.k} style={{ "--ri": i } as CSSProperties}>
          <span className="trio-kicker">
            <span className="n">0{i + 1}</span>
            <i aria-hidden="true" />
            {it.k}
          </span>
          <h4>{it.t}</h4>
          <p>{it.p}</p>
        </li>
      ))}
    </ol>
  );
}

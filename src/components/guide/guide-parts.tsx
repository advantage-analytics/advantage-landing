import type { ReactNode } from "react";
import Image from "next/image";
import { CourtFrame } from "./court-frame";

/* The pieces the recording guide and the export guide share. Both pages are
   set in guide.css (`.eg-*`), inside PageFrame. */

/* A setting on a screenshot: the ring outlines its row and the pin carries the
   step number into the gutter. `top` is the row's top edge in px on the 300px
   phone (a 282px screen inside a 9px bezel), measured off the screenshot. */
export interface Mark {
  step: number;
  top: number;
  radius: string;
  suggested?: boolean;
}

const ROW_HEIGHT = 39;
const PIN_SIZE = 22;

export function PhoneShot({
  src,
  alt,
  height,
  caption,
  marks,
}: {
  src: string;
  alt: string;
  height: number;
  caption: string;
  marks: Mark[];
}) {
  return (
    <figure className="eg-shot">
      <div className="eg-shot-stage">
        {marks.map((m) => (
          <span
            key={m.step}
            className={`eg-pin${m.suggested ? " is-suggested" : ""}`}
            style={{ top: m.top + (ROW_HEIGHT - PIN_SIZE) / 2 }}
            aria-hidden="true"
          >
            {m.step}
          </span>
        ))}
        <div className="eg-phone-crop" style={{ height }}>
          <div className="eg-phone">
            <Image
              src={src}
              alt={alt}
              width={603}
              height={1311}
              sizes="282px"
            />
            <span className="eg-island" aria-hidden="true" />
            {marks.map((m) => (
              <span
                key={m.step}
                className={`eg-ring${m.suggested ? " is-suggested" : ""}`}
                style={{ top: m.top - 2, borderRadius: m.radius }}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </div>
      <figcaption className="eg-eyebrow">{caption}</figcaption>
    </figure>
  );
}

export function Step({
  n,
  title,
  suggested,
  children,
}: {
  n: number;
  title: ReactNode;
  suggested?: boolean;
  children: ReactNode;
}) {
  return (
    <li className="eg-step">
      <span className={`eg-num${suggested ? " is-suggested" : ""}`}>{n}</span>
      <div>
        <h4>
          {title}
          {suggested ? <span className="eg-aside">Suggested</span> : null}
        </h4>
        <p>{children}</p>
      </div>
    </li>
  );
}

/* A frame that works beside one that doesn't, each with its verdict. */
export function FramePair() {
  return (
    <div className="eg-frames">
      <figure className="eg-frame">
        <CourtFrame variant="works" />
        <figcaption>
          <svg viewBox="0 0 24 24" className="is-keep" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          <span>
            <strong>Works.</strong> Raised, behind the back fence. The far
            service line (blue) shows above the net, and the space behind the
            near baseline (dashed) is inside the frame.
          </span>
        </figcaption>
      </figure>
      <figure className="eg-frame">
        <CourtFrame variant="wont-work" />
        <figcaption>
          <svg viewBox="0 0 24 24" className="is-skip" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
          <span>
            <strong>Won&rsquo;t work.</strong> Low and close. The net stands in
            front of the far service line, and the near baseline runs out of
            the bottom of the frame.
          </span>
        </figcaption>
      </figure>
    </div>
  );
}

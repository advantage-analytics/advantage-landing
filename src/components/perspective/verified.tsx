import Link from "next/link";
import { ArrowRight, CircleCheck, CircleX } from "lucide-react";
import { VERIFIED } from "@/lib/plans";
import "./verified.css";

/* Verified by Advantage: what the paid step up is and why it exists. Every
   match starts with Advantage Intelligence; on paid plans a reviewer then
   checks every point.

   The section reads as a key beside an example: the life of a match runs
   down the left (Analyzing, Verification pending, Verified by Advantage),
   and a sample of the dashboard's Matches table on the right shows each of
   those marks on a match. Below, the three calls a camera can't settle on
   its own, then the plans.

   The marks are the dashboard's own: its compact spinner while a match is
   analyzed, its result glyphs, and the verified check (the badge path from
   the dashboard's verified-check icon, inlined so it can take currentColor):
   blue once a person has checked the match, grey while that is still to
   come. The dashboard has no pending state yet; it needs one before launch
   for this section to be true. */

// LEGAL REVIEW / CONFIRM: these say what a reviewer does. Keep them true to
// the review process, and in step with the "Paid plans" section of the terms.
const REASONS: readonly { t: string; p: string }[] = [
  {
    t: "Lets and replayed points.",
    p: "A serve that clips the net or a point played twice is counted once.",
  },
  {
    t: "Close line calls.",
    p: "When a ball lands on the line, the reviewer records how the point was actually called.",
  },
  {
    t: "Who won, and how.",
    p: "Winner, error or double fault, confirmed for every point.",
  },
];

const PENDING = "Verification pending";

/* Sample rows in the dashboard's Matches table: date, opponent, the result
   mark, the score, and the Analysis cell. Every state a paid match passes
   through is on screen at once: one still analyzing, one waiting on its
   reviewer, two verified. */
type State = "analyzing" | "pending" | "verified";
const MATCHES: readonly {
  d: string;
  o: string;
  won: boolean;
  s: string;
  state: State;
}[] = [
  {
    d: "Feb 14",
    o: "J. Kim",
    won: true,
    s: "6-4, 3-6, 7-5",
    state: "analyzing",
  },
  { d: "Feb 12", o: "D. Okafor", won: true, s: "6-2, 6-3", state: "pending" },
  { d: "Feb 7", o: "L. Chen", won: false, s: "4-6, 6-7", state: "verified" },
  { d: "Feb 5", o: "M. Park", won: true, s: "7-5, 6-4", state: "verified" },
];

/** The dashboard's verified badge. Colour comes from the parent: .vf-check
    is blue, grey inside anything pending. */
export function VerifiedCheck({ size = 16 }: { size?: number }) {
  return (
    <svg
      className="vf-check"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M7.29948 8.46669L6.33281 7.51669C6.21059 7.39447 6.05792 7.33336 5.87481 7.33336C5.6917 7.33336 5.53326 7.40003 5.39948 7.53336C5.27726 7.65558 5.21615 7.81114 5.21615 8.00003C5.21615 8.18891 5.27726 8.34447 5.39948 8.46669L6.83281 9.90003C6.96615 10.0334 7.1217 10.1 7.29948 10.1C7.47726 10.1 7.63281 10.0334 7.76615 9.90003L10.5995 7.06669C10.7328 6.93336 10.7966 6.7778 10.7908 6.60003C10.785 6.42225 10.7213 6.26669 10.5995 6.13336C10.4661 6.00003 10.3079 5.93069 10.1248 5.92536C9.9417 5.92003 9.78326 5.9838 9.64948 6.11669L7.29948 8.46669ZM5.43281 14.5L4.46615 12.8667L2.63281 12.4667C2.46615 12.4334 2.33281 12.3474 2.23281 12.2087C2.13281 12.07 2.09392 11.9171 2.11615 11.75L2.29948 9.86669L1.04948 8.43336C0.938368 8.31114 0.882812 8.16669 0.882812 8.00003C0.882812 7.83336 0.938368 7.68891 1.04948 7.56669L2.29948 6.13336L2.11615 4.25003C2.09392 4.08336 2.13281 3.93047 2.23281 3.79136C2.33281 3.65225 2.46615 3.56625 2.63281 3.53336L4.46615 3.13336L5.43281 1.50003C5.5217 1.35558 5.64392 1.25825 5.79948 1.20803C5.95503 1.1578 6.11059 1.16625 6.26615 1.23336L7.99948 1.96669L9.73281 1.23336C9.88837 1.16669 10.0439 1.15825 10.1995 1.20803C10.355 1.2578 10.4773 1.35514 10.5661 1.50003L11.5328 3.13336L13.3661 3.53336C13.5328 3.56669 13.6661 3.65292 13.7661 3.79203C13.8661 3.93114 13.905 4.0838 13.8828 4.25003L13.6995 6.13336L14.9495 7.56669C15.0606 7.68891 15.1161 7.83336 15.1161 8.00003C15.1161 8.16669 15.0606 8.31114 14.9495 8.43336L13.6995 9.86669L13.8828 11.75C13.905 11.9167 13.8661 12.0696 13.7661 12.2087C13.6661 12.3478 13.5328 12.4338 13.3661 12.4667L11.5328 12.8667L10.5661 14.5C10.4773 14.6445 10.355 14.7418 10.1995 14.792C10.0439 14.8422 9.88837 14.8338 9.73281 14.7667L7.99948 14.0334L6.26615 14.7667C6.11059 14.8334 5.95503 14.8418 5.79948 14.792C5.64392 14.7422 5.5217 14.6449 5.43281 14.5ZM6.29948 13.3L7.99948 12.5667L9.73281 13.3L10.6661 11.7L12.4995 11.2667L12.3328 9.40003L13.5661 8.00003L12.3328 6.56669L12.4995 4.70003L10.6661 4.30003L9.69948 2.70003L7.99948 3.43336L6.26615 2.70003L5.33281 4.30003L3.49948 4.70003L3.66615 6.56669L2.43281 8.00003L3.66615 9.40003L3.49948 11.3L5.33281 11.7L6.29948 13.3Z"
      />
    </svg>
  );
}

/** The dashboard's compact spinner: a ring that turns while work runs. */
function Spinner() {
  return <span className="vf-spin" aria-hidden="true" />;
}

/** Won or lost: the dashboard's one outcome mark. */
function ResultMark({ won }: { won: boolean }) {
  const Icon = won ? CircleCheck : CircleX;
  return (
    <span className={`vf-res ${won ? "is-won" : "is-lost"}`}>
      <Icon size={14} strokeWidth={1.5} aria-hidden="true" />
      <span className="sr-only">{won ? "Won" : "Lost"}</span>
    </span>
  );
}

function Analysis({ state }: { state: State }) {
  if (state === "analyzing")
    return (
      <span className="vf-st is-analyzing">
        <Spinner />
        Analyzing
      </span>
    );
  return (
    <span className={`vf-st is-${state}`}>
      <VerifiedCheck size={14} />
      {state === "pending" ? PENDING : VERIFIED}
    </span>
  );
}

function MatchTable() {
  return (
    <figure className="vf-table-fig reveal">
      <div
        className="vf-table"
        role="img"
        aria-label="A sample Matches table. The newest match is analyzing, the next is pending verification, and two more are Verified by Advantage."
      >
        <div className="vf-tr vf-th" aria-hidden="true">
          <span className="c-d">Date</span>
          <span>Opponent</span>
          <span>Result</span>
          <span className="c-s">Score</span>
          <span>Analysis</span>
        </div>
        {MATCHES.map((x) => (
          <div className="vf-tr" key={x.o}>
            <span className="c-d">{x.d}</span>
            <span className="c-o">
              {x.o}</span>
            <ResultMark won={x.won} />
            <span className="c-s">{x.s}</span>
            <Analysis state={x.state} />
          </div>
        ))}
      </div>
      <figcaption>Sample data</figcaption>
    </figure>
  );
}

/* The life of a match, as a timeline the height of the table beside it. */
function Timeline() {
  return (
    <ol
      className="vf-steps reveal"
      aria-label="What a match shows as it is checked"
    >
      <li className="vf-step is-analyzing">
        <span className="vf-dot">
          <Spinner />
        </span>
        <strong>Analyzing</strong>
        <span>Advantage Intelligence reads the match.</span>
      </li>
      <li className="vf-step is-pending">
        <span className="vf-dot">
          <VerifiedCheck />
        </span>
        <strong>{PENDING}</strong>
        <span>
          On paid plans, a reviewer checks the calls a camera can’t settle.
        </span>
      </li>
      <li className="vf-step is-verified">
        <span className="vf-dot">
          <VerifiedCheck />
        </span>
        <strong>{VERIFIED}</strong>
        <span>A person confirmed the score and stats.</span>
      </li>
    </ol>
  );
}

export function VerifiedSection() {
  return (
    <section className="band alt" id="verified">
      <div className="wrap">
        <div className="proof-head reveal">
          <div className="sec-head">
            <span className="eyebrow">{VERIFIED}</span>
            <h2>
              AI reads the match.
              <br />{" "}
              <span className="h-tail">A&nbsp;person checks every point.</span>
            </h2>
          </div>
        </div>
        <div className="vf-pair">
          <Timeline />
          <MatchTable />
        </div>
        <ul className="vf-reasons reveal">
          {REASONS.map((r) => (
            <li key={r.t}>
              <strong>{r.t}</strong>
              <span>{r.p}</span>
            </li>
          ))}
        </ul>
        <div className="vf-foot reveal">
          <Link className="proof-link" href="/pricing">
            See plans with Verified
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

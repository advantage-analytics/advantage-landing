import { PageFrame } from "@/components/perspective/page-frame";
import { LiveDots } from "@/components/perspective/live-dots";
import { pageMetadata } from "@/lib/metadata";
import { PricingPlans, PricingFaq } from "./pricing-plans";
import "../pilot/pilot.css";
import "./pricing.css";

const title = "Pricing — Advantage";
const description =
  "Every singles match, human-checked. Plans for college programs, priced by the season, and for players and coaches, billed monthly.";

export const metadata = pageMetadata({ title, description, path: "/pricing" });

/* /pricing — DRAFT on claude/pricing-page. Built from /pilot's parts: the
   mesh masthead with its live dot grid, a band head, the How it works panel
   split into plan columns, the FAQ rows, and the navy band to close. */

const Masthead = () => (
  <header className="pv-hero brand-mesh" id="top">
    <LiveDots />
    <div className="pv-veil" aria-hidden="true" />
    <div className="wrap">
      <span className="h-eyebrow">Pricing</span>
      <h1 className="h-title">Every singles match, human-checked.</h1>
      <p className="h-sub">
        Advantage Intelligence reads your match video, then our reviewers check every point before it reaches your
        dashboard. No hardware to buy.
      </p>
      <div className="h-actions">
        <a className="hbtn hbtn-white" href="#plans">
          See the plans
        </a>
        <a className="hbtn hbtn-glass" href="#questions">
          Questions
        </a>
      </div>
    </div>
  </header>
);

const INCLUDED: readonly { t: string; p: string }[] = [
  { t: "Human-checked data", p: "Our reviewers check the score, server, winner and how every point ended." },
  { t: "Court position maps", p: "Where each player stands, and where they win and lose points." },
  { t: "Stats linked to film", p: "Every shot stat opens the clip it came from." },
  { t: "Fix any point yourself", p: "Correct a point in a click. The original is always kept." },
  { t: "Ask", p: "Question your matches in plain English, or connect them to Claude and other AI tools." },
  {
    t: "The film you already have",
    p: "PlaySight or any camera at 1080p, 30fps, from behind the baseline. SwingVision imports are free.",
  },
];

export default function Page() {
  return (
    <PageFrame hero={<Masthead />}>
      <PricingPlans />

      <section className="band" id="included">
        <div className="wrap">
          <div className="proof-head reveal">
            <div className="sec-head">
              <span className="eyebrow">Every paid plan</span>
              <h2>What comes back from every match.</h2>
            </div>
            <p className="band-aside">The same breakdown on every plan. Plans differ in hours, not in what you see.</p>
          </div>
          <div className="pr-included reveal">
            {INCLUDED.map((x) => (
              <div className="pr-inc" key={x.t}>
                <h3>{x.t}</h3>
                <p>{x.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PricingFaq />

      <section className="band final-band" id="start">
        <div className="ac-glow" aria-hidden="true" />
        <LiveDots className="ac-grain" />
        <div className="final-inner reveal">
          <span className="eyebrow">Your season</span>
          <h2>Talk through your spring.</h2>
          <div className="final-actions">
            <a className="hbtn hbtn-white" href="/contact">
              Book a 15-minute call
            </a>
            <a className="hbtn hbtn-glass" href="/send-a-match">
              Send a match
            </a>
          </div>
          <span className="final-note">Your schedule, your camera setup and which plan fits.</span>
        </div>
      </section>
    </PageFrame>
  );
}

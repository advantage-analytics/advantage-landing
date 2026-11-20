import Link from "next/link";
import { GuideShell } from "@/components/guide/guide-shell";
import { FaqItem } from "@/components/perspective/faq-item";
import { KpiTrend } from "@/components/perspective/sections";
import { MatchEndings, MatchInsight } from "@/components/perspective/match-breakdown";
import { JsonLd } from "@/components/json-ld";
import { EXPORT_GUIDE_HREF, RECORDING_GUIDE_HREF } from "@/lib/match-video";
import { pageMetadata } from "@/lib/metadata";
import { articleLd, faqPageLd } from "@/lib/structured-data";
import { PLAN_FAQ } from "@/lib/plan-faq";
import { COLLEGE_PLANS, FREE_MATCH_LINE, FREE_MATCH_OFFER, usd } from "@/lib/plans";
import { FreeMatchLink, TalkToUsLink } from "@/components/perspective/cta-links";
import "./tennis-analytics.css";

/* /tennis-analytics — the page that explains the subject itself, for the
   player or coach who searched for it (or asked an AI about it) before they
   had heard of Advantage. It answers in the order they ask: what is it, what
   does it measure, how do I get it, is it for me. The opening paragraph and
   the short-answer card are written to be quoted on their own.

   Plain language first (PRODUCT.md): each number is defined in words a
   player already uses. The cards beside them are the home page's own
   product pieces, so every figure on the page is one the product shows.
   The FAQ's answers are plain strings, and the same strings feed the FAQPage
   structured data. */

const PATH = "/tennis-analytics";
const TITLE = "Tennis Analytics: What It Is and How to Get It From Match Video — Advantage";
const DESCRIPTION =
  "Tennis analytics turns a match into numbers you can act on: first serve percentage, points won on serve, how points ended. What each one means, and how to get them from a video filmed on your phone or any camera.";
// Bump with any real edit to the copy; it is shown under the title and sent
// as the article's dateModified.
const UPDATED = "2026-11-04";

export const metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: PATH, ownCard: true });

const SHORT = [
  { k: "What it is", v: "Match statistics and patterns, pulled from the points you actually played." },
  { k: "Who it is for", v: "Any player who competes, from league nights to college duals, and the coaches who work with them." },
  { k: "What you need", v: "A video of a singles match, shot from behind the baseline. That is all." },
];

const MEASURES = [
  {
    t: "First serve percentage",
    d: "How often your first serve lands in. A first serve in puts you on the front foot, so this is usually the first number to watch.",
  },
  {
    t: "Serve points won",
    d: "The share of points you win behind your first serve and behind your second. A big gap between the two shows where pressure gets in.",
  },
  {
    t: "Break points saved",
    d: "How often you hold on when your serve is about to be broken. It is where close sets are won or lost.",
  },
  {
    t: "Return games won",
    d: "How often you break your opponent. Holding serve keeps you level; this is what moves the score.",
  },
  {
    t: "How points ended",
    d: "Winners and aces against errors and double faults. It tells you whether you won the match or your opponent lost it.",
  },
  {
    t: "Rally length",
    d: "Who wins the short points and who wins the long ones. It shows which kind of match to play.",
  },
];

const QA = [
  {
    q: "What is tennis analytics?",
    a: "Tennis analytics is the use of match statistics, like first serve percentage, points won on serve and how points ended, to understand why a match was won or lost and what to practice next.",
  },
  {
    q: "Can I get tennis stats from a phone video?",
    a: "Yes. Film a singles match from behind the baseline on your phone or any camera, upload the file to Advantage, and you get an email when your breakdown is ready.",
  },
  {
    q: "What stats should a tennis player track?",
    a: "Start with first serve percentage, points won behind your first and second serve, and how your points ended: winners and aces against errors and double faults. Then watch how they move across matches.",
  },
  {
    q: "What video works?",
    a: "Video from a phone, a GoPro or court cameras like PlaySight, as long as it’s singles shot from behind the baseline. Side-on film won’t give a full breakdown.",
  },
  PLAN_FAQ.cost,
  PLAN_FAQ.verified,
  PLAN_FAQ.film,
];

const LD = [
  articleLd({ path: PATH, headline: "Tennis analytics, explained", description: DESCRIPTION, dateModified: UPDATED }),
  faqPageLd(QA.map((x) => ({ q: x.q, text: x.a }))),
];

// The rail's sections, in page order.
const SECTIONS = [
  { id: "measures", label: "What it measures" },
  { id: "how", label: "From video to a breakdown" },
  { id: "who", label: "Who it is for" },
  { id: "faq", label: "Common questions" },
];

export default function Page() {
  return (
    <GuideShell
      id="analytics"
      sub="Tennis analytics turns what happens in a match into numbers you can act on: how often your first serve goes in, how your points end, and where you win and lose them. It used to take a team of analysts. Now it takes a video of your match, filmed on your phone or any camera."
      sections={SECTIONS}
    >
      <section>
        <div className="wrap">
          <aside className="ta-short reveal" aria-label="The short answer">
            {SHORT.map((x) => (
              <div key={x.k}>
                <span className="ta-label">{x.k}</span>
                <p>{x.v}</p>
              </div>
            ))}
          </aside>
        </div>
      </section>

      <section className="ta-band" id="measures">
        <div className="wrap">
          <div className="sec-head reveal">
            <h2>The numbers that decide a match.</h2>
            <p>Most matches turn on a handful of things. These are the ones worth tracking, what each means, and why it matters.</p>
          </div>
          <div className="ta-measures">
            <dl className="ta-defs reveal">
              {MEASURES.map((m) => (
                <div key={m.t}>
                  <dt>{m.t}</dt>
                  <dd>{m.d}</dd>
                </div>
              ))}
            </dl>
            <div className="ta-cards reveal">
              <div
                className="ta-crop mb-crop"
                role="img"
                aria-label="From a sample dashboard: first serve percentage at 68%, rising over the last 30 days."
              >
                <div inert>
                  <KpiTrend />
                </div>
              </div>
              <div
                className="ta-crop mb-crop"
                role="img"
                aria-label="From a sample match report: how each player's points ended, in winners, aces, errors and double faults."
              >
                <div inert>
                  <MatchEndings />
                </div>
              </div>
              <p className="ta-note">From a sample player’s dashboard and match report.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="ta-band" id="how">
        <div className="wrap">
          <div className="sec-head reveal">
            <h2>How to get tennis stats from a match video.</h2>
          </div>
          <ol className="ta-steps reveal">
            <li>
              <h3>Film from behind the baseline</h3>
              <p>
                Clip your phone or any camera to the back fence, raised up if you can, and record the whole singles
                match. The <Link href={RECORDING_GUIDE_HREF}>recording guide</Link> covers placement and settings.
              </p>
            </li>
            <li>
              <h3>Upload the file</h3>
              <p>
                Add the video to your Advantage account. The <Link href={EXPORT_GUIDE_HREF}>export guide</Link> shows how
                to get it off each kind of camera.
              </p>
            </li>
            <li>
              <h3>Read your breakdown</h3>
              <p>
                You get an email when it’s ready: where you won points, where you lost them, and what to work on, each
                linked to the moment on video.
              </p>
            </li>
          </ol>
          <div
            className="ta-crop ta-insight mb-crop reveal"
            role="img"
            aria-label="From a sample match report: a written insight naming the pattern that decided the match and what to keep doing."
          >
            <div inert>
              <MatchInsight />
            </div>
          </div>
        </div>
      </section>

      <section className="ta-band" id="who">
        <div className="wrap">
          <div className="sec-head reveal">
            <h2>For players, and for the coaches who work with them.</h2>
          </div>
          <div className="ta-lanes reveal">
            <div className="ta-lane">
              <span className="ta-label">Players</span>
              <h3>See your own game in numbers.</h3>
              <p>Track your serve, your errors and your trends from one match to the next.{FREE_MATCH_OFFER ? ` ${FREE_MATCH_LINE}` : ""}</p>
              <FreeMatchLink className="btn btn-primary" placement="tennis-analytics" icon={false} />
            </div>
            <div className="ta-lane">
              <span className="ta-label">Coaches and programs</span>
              <h3>Every dual, every court, one page.</h3>
              <p>
                College plans cover your full roster, from {usd(COLLEGE_PLANS[0].spring.price)} for the spring season.{" "}
                <Link href="/pricing">See pricing</Link>
              </p>
              <TalkToUsLink className="btn btn-ink" placement="tennis-analytics" />
            </div>
          </div>
        </div>
      </section>

      <section className="ta-band" id="faq">
        <div className="wrap faq">
          <div className="faq-intro sec-head reveal">
            <h2>Common questions.</h2>
          </div>
          <div className="faq-list reveal">
            {QA.map((x) => (
              <FaqItem key={x.q} q={x.q}>
                {x.a}
              </FaqItem>
            ))}
          </div>
        </div>
      </section>
      <JsonLd data={LD} />
    </GuideShell>
  );
}

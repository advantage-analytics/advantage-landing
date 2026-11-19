import Link from "next/link";
import { permanentRedirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { PageFrame, PageHero } from "@/components/perspective/page-frame";
import { CONTACT_EMAIL } from "@/lib/links";
import { COLLEGE_PLANS, usd } from "@/lib/plans";
import { pageMetadata } from "@/lib/metadata";
import "../guides/guides.css";
import "./pilot.css";

/* /pilot, for the rest of the Free Fall Season Pilot: a notice for programs
   already in it, linked from emails sent during the pilot. It states the terms
   they signed up on, and what January brings. No sign-up and no marketing;
   new programs start from /pricing.

   From January 1, 2027 the page sends every visitor to /pricing. The page is
   regenerated hourly, so the switch happens on its own within the hour; once
   it has, replace this route with a redirect in next.config.ts. */

const PILOT_ENDS = new Date("2027-01-01T08:00:00Z"); // midnight, Pacific time
export const revalidate = 3600;

export const metadata = pageMetadata({
  title: "The Free Fall Season Pilot — Advantage",
  description:
    "For college programs in the Free Fall Season Pilot: free through December 31, 2026. Nothing is charged before January 2027.",
  path: "/pilot",
  // A notice for programs already in the pilot, not a page to be found.
  robots: { index: false, follow: true },
});

const TERMS: readonly { k: string; v: string; s: string }[] = [
  { k: "Cost", v: "Free", s: "through December 31, 2026" },
  { k: "Film", v: "75 hours a month", s: "for each team. Men’s and women’s are set up on their own." },
  { k: "Commitment", v: "None", s: "no hardware, no contract" },
  { k: "Paid plans", v: "January 2027", s: "nothing is charged before then" },
];

const NEXT: readonly { task: string; when: string; name: string; href: string }[] = [
  {
    task: "See the college plans",
    when: `Priced by the season, from ${usd(COLLEGE_PLANS[0].spring.price)} for spring. Every plan covers your full roster.`,
    name: "Pricing",
    href: "/pricing",
  },
  {
    task: "Talk it through",
    when: "A 20-minute call on Zoom about your season and which plan fits.",
    name: "Book a call",
    href: "/contact#book",
  },
];

export default function Page() {
  if (Date.now() >= PILOT_ENDS.getTime()) permanentRedirect("/pricing");
  return (
    <PageFrame
      hero={
        <PageHero
          compact
          eyebrow="Free Fall Season Pilot"
          title="Your pilot is free through December 31."
          sub="For programs already in the pilot. Nothing is charged before January 2027. Here is what happens next."
        />
      }
    >
      <div className="gi-list">
        <section>
          <h2 className="gi-label">The terms</h2>
          <dl className="pl-terms">
            {TERMS.map((t) => (
              <div key={t.k}>
                <dt>{t.k}</dt>
                <dd>
                  {t.v}
                  <span>{t.s}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>
        <section>
          <h2 className="gi-label">In January: choose a plan</h2>
          <p className="pl-intro">Paid plans begin in January 2027. Until then, everything is free.</p>
          <ul className="gi-rows">
            {NEXT.map((n) => (
              <li key={n.href}>
                <Link className="gi-row" href={n.href}>
                  <span className="gi-text">
                    <span className="gi-task">{n.task}</span>
                    <span className="gi-when">{n.when}</span>
                    <span className="gi-name">{n.name}</span>
                  </span>
                  <ArrowRight className="gi-arrow" size={18} strokeWidth={1.6} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <p className="gi-foot">
          Questions about your pilot? A person reads every message:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </div>
    </PageFrame>
  );
}

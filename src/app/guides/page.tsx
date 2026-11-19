import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageFrame, PageHero } from "@/components/perspective/page-frame";
import { FIRST_MATCH_STEPS, GUIDES } from "@/components/guide/guides";
import { CONTACT_EMAIL } from "@/lib/links";
import { pageMetadata } from "@/lib/metadata";
import "./guides.css";

export const metadata = pageMetadata({
  title: "Guides: filming, uploading and reading your tennis matches — Advantage",
  description:
    "Four short guides: how to film a match, upload it, ask an AI app about your matches, and understand your numbers.",
  path: "/guides",
  ownCard: true,
});

/* /guides, task-first. Each guide is named by what the visitor wants to do,
   in plain verbs, with what it covers and the guide's own name as a small
   label. The first match's two steps come first; their heading says the
   order ("film it, then upload it"), so the rows carry no markers. The two
   references follow. One narrow column, each row one link. */

const STEPS = GUIDES.slice(0, FIRST_MATCH_STEPS);
const REFERENCE = GUIDES.slice(FIRST_MATCH_STEPS);

function Row({ g }: { g: (typeof GUIDES)[number] }) {
  return (
    <Link className="gi-row" href={g.href}>
      <span className="gi-text">
        <span className="gi-task">{g.task}</span>
        <span className="gi-when">{g.when}</span>
        <span className="gi-name">{g.name}</span>
      </span>
      <ArrowRight className="gi-arrow" size={18} strokeWidth={1.6} aria-hidden="true" />
    </Link>
  );
}

export default function Page() {
  return (
    <PageFrame
      hero={
        <PageHero
          compact
          eyebrow="Guides"
          title="From the court to your breakdown."
          sub="Four short guides. For your first match, follow the first two in order."
        />
      }
    >
      <div className="gi-list">
        <section>
          <h2 className="gi-label">Your first match: film it, then upload it</h2>
          <ol className="gi-rows">
            {STEPS.map((g) => (
              <li key={g.id}>
                <Row g={g} />
              </li>
            ))}
          </ol>
        </section>
        <section>
          <h2 className="gi-label">When you need them</h2>
          <ul className="gi-rows">
            {REFERENCE.map((g) => (
              <li key={g.id}>
                <Row g={g} />
              </li>
            ))}
          </ul>
        </section>
        <p className="gi-foot">
          Can&rsquo;t find what you need? A person reads every message:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </div>
    </PageFrame>
  );
}

import Image from "next/image";
import { GraduationCap, UserRound, UsersRound } from "lucide-react";
import { PageFrame, PageHero } from "@/components/perspective/page-frame";
import { LiveDots } from "@/components/perspective/live-dots";
import { FreeMatchLink, TalkToUsLink } from "@/components/perspective/cta-links";
import { FinalBand } from "@/components/perspective/final-band";
import { pageMetadata } from "@/lib/metadata";
import { FREE_MATCH_LINE, FREE_MATCH_OFFER } from "@/lib/plans";
import "./about.css";

export const metadata = pageMetadata({
  title: "About Advantage: Tennis Analytics Built by a Former College Player",
  description:
    "Why Advantage exists: match analysis used to take a team of analysts. Built in Los Angeles by Cj Gimena, a former Bakersfield College player and former UCLA team manager.",
  path: "/about",
  ownCard: true,
});

/* /about. The mesh masthead, then three bands in one statement-left form (the
   mission, why it exists, who it is for), the founder in a navy band, the UCLA
   photo as the proof, and the navy closing band. */

const AUDIENCES = [
  {
    Icon: UserRound,
    name: "Players",
    line: "See where your points are won and lost, and what to work on before the next match.",
  },
  {
    Icon: UsersRound,
    name: "Coaches",
    line: "Every player’s matches in one place, with every stat linked to the clip it came from.",
  },
  {
    Icon: GraduationCap,
    name: "College programs",
    line: "Your full roster and every dual in one place, with a reviewer on every point when you upgrade.",
  },
] as const;

export default function Page() {
  return (
    <PageFrame
      hero={
        <PageHero
          eyebrow="About"
          title="Why I built Advantage."
          sub="Performance intelligence for competitive tennis, built by a former collegiate player who lived the gap between talent and the numbers."
          actions={
            <>
              <FreeMatchLink className="hbtn hbtn-white" placement="about-hero" />
              <TalkToUsLink className="hbtn hbtn-glass" placement="about-hero" />
            </>
          }
        />
      }
    >
      {/* Mission, then the reason for it: one band, statement left, prose right. */}
      <section className="band">
        <div className="wrap">
          <div className="ab-split reveal">
            <div className="ab-lead sec-head">
              <span className="eyebrow">Our mission</span>
              <h2>
                Every point matters. <span className="h-tail">On the court and in the data.</span>
              </h2>
            </div>
            <div className="ab-prose">
              <p className="ab-lede">
                Playing at Bakersfield College and managing the team at UCLA, I saw a clear gap: programs rich in
                talent, without the detailed statistics to turn that talent into consistent results.
              </p>
              <p>
                Advantage is how I’m closing that gap. It combines match analytics with a deep understanding of
                tennis, so raw match data becomes a game plan players and coaches can act on.
              </p>
              <p>
                From point-by-point breakdowns to clear reports, it helps players develop, coaches refine their game
                plans and programs recruit. Data that works for the game, and for those who play it.
              </p>
            </div>
          </div>

          <div className="ab-split ab-why reveal">
            <div className="ab-lead sec-head">
              <span className="eyebrow">Why it exists</span>
              <h2>
                Talent was never the gap. <span className="h-tail">The numbers were.</span>
              </h2>
            </div>
            <div className="ab-prose">
              <p>
                Programs are rich in talent, but they rarely have the detailed, actionable statistics that turn
                potential into consistent results. Analysis like that used to take a team of analysts. Now it takes a
                video of your match.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who it is for: the same form, the audiences as rows. White marks the
          turn from the story to the people it serves. */}
      <section className="band alt">
        <div className="wrap">
          <div className="ab-split reveal">
            <div className="ab-lead sec-head">
              <span className="eyebrow">Built for</span>
              <h2>
                Everyone who competes. <span className="h-tail">From league nights to college duals.</span>
              </h2>
            </div>
            <ul className="ab-rows">
              {AUDIENCES.map(({ Icon, name, line }) => (
                <li className="ab-row" key={name}>
                  <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
                  <h3>{name}</h3>
                  <p>{line}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* The founder, in navy: the page's one dark band before the close. */}
      <section className="ab-founder navy-surface">
        <div className="ac-glow" aria-hidden="true" />
        <LiveDots className="ac-grain" energy={1} />
        <div className="wrap ab-founder-inner reveal">
          <Image
            className="ab-portrait"
            src="/assets/marketing/founder-portrait.jpg"
            alt="Cj Gimena, Advantage’s founder"
            width={1200}
            height={1500}
            sizes="240px"
          />
          <figure className="ab-quote">
            <span className="eyebrow">From the founder</span>
            <blockquote>“Every point tells you something. Most players never get to hear it.”</blockquote>
            <figcaption>
              <span className="who">Cj Gimena, founder</span>
              <span className="bio">Former collegiate player at Bakersfield College · Former UCLA team manager</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Where it started: the UCLA photo as the proof. */}
      <section className="band">
        <div className="wrap ab-origin reveal">
          <div className="ab-origin-copy sec-head">
            <span className="eyebrow">Where it started</span>
            <h2>
              Built from inside college tennis. <span className="h-tail">Not from the stands.</span>
            </h2>
            <p>Advantage started courtside at UCLA, seeing what a top program needs from its numbers.</p>
          </div>
          <figure className="ab-photo">
            <Image
              src="/assets/marketing/team-ucla.jpg"
              sizes="(max-width: 900px) 100vw, 620px"
              alt="UCLA men’s tennis on court after beating USC in the 2025 NCAA Super Regional; Cj Gimena stands at the far left"
              width={1800}
              height={1200}
            />
            <figcaption>
              <span className="score">UCLA 4, USC 2 · NCAA Super Regional, May 2025</span>
              <span>Cj, far left, with UCLA men’s tennis after the win that sent the Bruins to the NCAA quarterfinals.</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <FinalBand
        title="See what your match says about your game."
        placement="about-final"
        note={FREE_MATCH_OFFER ? FREE_MATCH_LINE : null}
      />
    </PageFrame>
  );
}

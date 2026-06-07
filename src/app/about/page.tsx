import { PageFrame, PageHead } from "@/components/perspective/page-frame";
import "./about.css";

export const metadata = {
  title: "About — Advantage",
  description:
    "Our story and mission: performance intelligence for competitive tennis, built by former collegiate players in Los Angeles, California.",
};

// Identity facts for the closing bar — drawn only from the copy.
const FACTS = [
  { k: "Based in", v: "Los Angeles, CA" },
  { k: "Team", v: "6 specialists" },
  { k: "Origin", v: "Collegiate tennis" },
];

export default function Page() {
  return (
    <PageFrame>
      <PageHead
        eyebrow="About us"
        title="Our story and mission."
        lede="Performance intelligence for competitive tennis, built by former collegiate players who lived the gap between talent and the numbers."
        meta="Los Angeles, California"
      />

      <section className="band about-band">
        <div className="wrap">
          {/* Full-width article. The photo sits at the top right at its natural
              aspect (uncropped) and the story wraps around it. */}
          <article className="about-article">
            <figure className="about-inset reveal">
              <img
                src="/assets/marketing/team-ucla.jpg"
                alt="Advantage's founder, left, courtside while managing the UCLA team"
              />
              <figcaption className="about-inset-cap">
                <i className="dot" aria-hidden="true" />
                Our founder · courtside at UCLA
              </figcaption>
            </figure>

            <p>
              At Advantage, we believe every point matters, both on the court and
              in the data. Born from first hand experience in collegiate tennis,
              we saw a clear gap: while programs were rich in talent, they often
              lacked the detailed, actionable statistics needed to turn potential
              into consistent results. Our mission is to bridge that gap,
              empowering players and coaches with the insights they need to
              succeed.
            </p>
            <p>
              Based in Los Angeles, California, Advantage is powered by a team of
              six dedicated professionals, including data analysts, graphic
              designers, web developers, and accountants, all working together to
              deliver clear, impactful analysis. We combine advanced analytics
              with a deep understanding of tennis to transform raw match data into
              strategies that drive performance.
            </p>
            <p>
              From in-depth match breakdowns to visually engaging reports, our
              work turns complex numbers into a competitive advantage. Whether
              it’s optimizing player development, refining game plans, or enhancing
              recruiting strategies, Advantage is here to make data work for the
              game, and for those who play it.
            </p>
          </article>

          {/* Identity facts as a full-width horizontal spec bar. */}
          <ul className="about-facts-bar reveal">
            {FACTS.map((f) => (
              <li className="about-fact-cell" key={f.k}>
                <span className="k">{f.k}</span>
                <span className="v">{f.v}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageFrame>
  );
}

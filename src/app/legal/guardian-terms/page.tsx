import Link from "next/link";
import { PageFrame, PageHead } from "@/components/perspective/page-frame";
import "../legal.css";

export const metadata = {
  title: "Guardian Terms — Advantage",
  description:
    "The terms a parent or legal guardian agrees to when they create and manage an Advantage account for a junior player.",
};

export default function Page() {
  return (
    <PageFrame>
      <PageHead
        eyebrow="Legal"
        title="Guardian Terms"
        meta="Version 1.0 · Last updated September 25, 2026"
      />
      <section className="band">
        <div className="wrap">
          <article className="legal-doc">
            <section className="legal-sec">
              <h2>1. Who These Terms Are For</h2>
              <p>
                These Guardian Terms apply when a parent or legal guardian
                (&quot;you&quot;) creates and manages an Advantage account for a
                player under 18 (the &quot;Player&quot;). They add to our{" "}
                <Link className="legal-link" href="/legal/terms-and-conditions">
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link className="legal-link" href="/legal/privacy-policy">
                  Privacy Policy
                </Link>
                , which also apply. Where these Guardian Terms say something
                more specific about a Player, they take precedence.
              </p>
              <p>
                You agree to these terms when you tick the guardian consent box
                during sign-up. We record the date and time you gave consent.
              </p>
            </section>

            <section className="legal-sec">
              <h2>2. Your Consent</h2>
              <p>By creating a guardian account, you confirm that:</p>
              <ul className="legal-list">
                <li>You are the Player&apos;s parent or legal guardian.</li>
                <li>
                  You consent to Advantage collecting and analyzing match video
                  and match data of the Player, and to the other uses described
                  in these terms.
                </li>
                <li>
                  You have the authority to give this consent and will tell us
                  if that changes.
                </li>
              </ul>
              <p>
                You can withdraw your consent at any time by deleting the
                account or by contacting us. Withdrawing consent stops new
                uploads and starts the deletion described in Section 7.
              </p>
            </section>

            <section className="legal-sec">
              <h2>3. Managing the Account</h2>
              <p>
                The account is yours to manage on the Player&apos;s behalf. The
                Player does not have their own login. You decide what is
                uploaded, which teams the Player joins, and who it is shared
                with. You are responsible for the account&apos;s activity, as
                described in our Terms and Conditions.
              </p>
              <p>
                You manage the account until it is handed over to the Player.
                Handing an account over is not yet available in the Service.
                When the Player is ready, or turns 18, contact us and we will
                arrange it with you. We will not hand the account over without
                you while the Player is under 18.
              </p>
            </section>

            <section className="legal-sec">
              <h2>4. What We Collect About the Player</h2>
              <ul className="legal-list">
                <li>
                  <strong>Profile details:</strong> the Player&apos;s name and
                  high-school graduating class, which you provide during
                  sign-up.
                </li>
                <li>
                  <strong>Match video:</strong> video you upload of the
                  Player&apos;s matches.
                </li>
                <li>
                  <strong>Match data:</strong> scores, statistics, shot and
                  court positions, and other analysis produced from uploaded
                  video or imported match files.
                </li>
              </ul>
              <p>
                We do not collect the Player&apos;s contact details, and we do
                not collect health or biometric data. Only collect and upload
                what is needed for the Player&apos;s tennis analysis.
              </p>
            </section>

            <section className="legal-sec">
              <h2>5. How We Use Match Video</h2>
              <ul className="legal-list">
                <li>
                  We use match video of the Player only to produce the
                  statistics, court visualizations and match reports you see in
                  the Service.
                </li>
                <li>
                  Video of a Player is never used to train models, and is never
                  used for advertising or marketing.
                </li>
                <li>
                  Video is stored with our cloud hosting provider and sent to
                  our video analysis provider, who processes it on our behalf
                  and returns the results. These providers may use it only to
                  deliver the Service to you.
                </li>
                <li>
                  Uploaded video is kept for up to one year after it was last
                  viewed. We show a warning in the Service before it expires,
                  and you can remove a video sooner at any time.
                </li>
              </ul>
            </section>

            <section className="legal-sec">
              <h2>6. Who Can See the Player&apos;s Matches</h2>
              <p>
                Match video and match data of a Player are never shown outside
                the people you share them with:
              </p>
              <ul className="legal-list">
                <li>
                  <strong>Personal matches</strong> are visible only on your
                  account.
                </li>
                <li>
                  <strong>Team matches.</strong> When you add the Player to a
                  team on Advantage, matches filed to that team are visible to
                  the team&apos;s members, including coaches, staff and
                  teammates. This is how a team workspace works. Before you join
                  a team, make sure you&apos;re comfortable with who its members
                  are.
                </li>
                <li>
                  <strong>Clubs and private teams</strong> are visible only to
                  their own members and are never listed in our public school
                  directory.
                </li>
              </ul>
            </section>

            <section className="legal-sec">
              <h2>7. Deleting the Account or the Player&apos;s Data</h2>
              <p>
                You can delete the account at any time from Settings. Deleting
                it removes the Player&apos;s profile and personal matches.
              </p>
              <p>
                Matches you filed to a team belong to that team and stay with it
                after the account is deleted. Your details as uploader are
                removed from them. To have a team match of the Player removed,
                ask the team&apos;s owner or contact us.
              </p>
              <p>
                You can also ask us to review, correct or delete any information
                we hold about the Player by contacting us at the address below.
                We may ask you to confirm that you are the account&apos;s
                guardian before we act.
              </p>
            </section>

            <section className="legal-sec">
              <h2>8. Changes to These Terms</h2>
              <p>
                We may update these Guardian Terms. If a change affects how we
                collect, use or share a Player&apos;s information, we will tell
                you by email before it takes effect, and ask for your consent
                again where the law requires it.
              </p>
            </section>

            <section className="legal-sec">
              <h2>9. Contact</h2>
              <p>
                Questions about these terms, or requests about a Player&apos;s
                information, go to{" "}
                <a
                  className="legal-link"
                  href="mailto:team@advantage-analytics.com"
                >
                  team@advantage-analytics.com
                </a>
                .
              </p>
            </section>
          </article>
        </div>
      </section>
    </PageFrame>
  );
}

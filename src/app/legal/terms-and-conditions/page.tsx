import Link from "next/link";
import { PageFrame, PageHead } from "@/components/perspective/page-frame";
import "../legal.css";

export const metadata = {
  title: "Terms and Conditions — Advantage",
  description: "The terms that govern your use of the Advantage platform and services.",
};

export default function Page() {
  return (
    <PageFrame>
      <PageHead
        eyebrow="Legal"
        title="Terms and Conditions"
        meta="Version 2.0 · Last updated October 25, 2026"
      />
      <section className="band">
        <div className="wrap">
          <article className="legal-doc">
            <section className="legal-sec">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using Advantage (the &quot;Service&quot;), you agree to be legally bound by
                these Terms and Conditions (&quot;Terms&quot;). If you do not agree with any part of these
                Terms, do not use the Service.
              </p>
            </section>

            <section className="legal-sec">
              <h2>2. Description of Service</h2>
              <p>
                Advantage is a tennis analytics platform for players, parents of junior players, coaches
                and programs. You can upload match video for analysis by Advantage Intelligence, import
                match files from apps such as SwingVision, and see statistics, court visualizations and AI
                match summaries. You can ask questions about your matches with Ask, connect AI assistants
                to your account, and share matches with your team or by link.
              </p>
            </section>

            <section className="legal-sec">
              <h2>3. User Eligibility</h2>
              <p>
                You must be at least 18 years old to create or hold an Advantage account, with one
                exception: a player aged 13 to 17 may hold their own account only to join a high school,
                club or academy team through that team&apos;s invitation, with their parent or
                guardian&apos;s permission. Players under 13 cannot hold their own account. Any other
                player under 18 uses Advantage through an account that their parent or legal guardian
                creates and manages under our{" "}
                <Link className="legal-link" href="/legal/guardian-terms">
                  Guardian Terms
                </Link>
                .
              </p>
              <p>
                By using the Service, you represent and warrant that you meet these requirements and, if
                you are 18 or older, that you have the legal capacity to enter into a binding agreement.
              </p>
            </section>

            <section className="legal-sec">
              <h2>4. Account Creation, Security and Teams</h2>
              <p>
                To access certain features of the Service, you must create an account by providing
                accurate and complete information. You are responsible for maintaining the confidentiality
                of your account credentials and for all activities that occur under your account. You
                agree to notify Advantage immediately if you suspect any unauthorized use of your account.
              </p>
              <p>
                If you create or claim a team on Advantage, you are its owner and are responsible for who
                you invite and what is uploaded to it. You confirm that you have the right to upload video
                of the players on the team, and that they, or for players under 18 their parents or
                guardians, have agreed to being filmed and to the analysis of their matches.
              </p>
            </section>

            <section className="legal-sec">
              <h2>5. Intellectual Property Rights</h2>
              <p>
                All intellectual property rights in the Service, including but not limited to the analytics
                tools, algorithms, software, and content, are owned exclusively by Advantage or its
                licensors.
              </p>
              <p>
                Reports generated from your data are the property of Advantage; however, you are granted a
                broad, non-exclusive, non-transferable license to use, download, and share these reports for
                your personal, non-commercial purposes, including coaching, recruitment, and performance
                tracking.
              </p>
              <p>
                You may not reproduce, distribute, or commercially exploit the Service or its outputs beyond
                these personal uses without prior written consent from Advantage.
              </p>
              <p>
                Examples of prohibited uses include, but are not limited to: selling or licensing reports to
                third parties, using reports for commercial advertising, or incorporating the analytics tools
                or data into other products or services.
              </p>
            </section>

            <section className="legal-sec">
              <h2>6. User-Generated Content</h2>
              <p>
                You retain ownership of the data and content you submit to Advantage, such as match video,
                match data and personal information. By submitting such content, you grant Advantage a
                worldwide, non-exclusive, royalty-free, sublicensable, and transferable license to use,
                reproduce, modify, distribute, and display the content to provide and improve the Service,
                including to train and improve the models that analyze match video and write match
                summaries. We never use video from junior player accounts, from accounts of players under
                18, or from high school or junior teams to train models.
              </p>
              <p>
                Advantage reserves the right to remove or refuse any content that violates these Terms, is
                unlawful, offensive, or infringes on the rights of others.
              </p>
              <p>
                You agree not to submit content that is false, misleading, infringing, or otherwise
                objectionable.
              </p>
            </section>

            <section className="legal-sec">
              <h2>7. Sharing and Team Content</h2>
              <p>
                Matches filed to a team belong to that team and stay with it if you leave the team or
                delete your account. If you create a public link to a match, anyone with the link can view
                it, and you are responsible for what you share. Only upload or share video you have the
                right to share.
              </p>
            </section>

            <section className="legal-sec">
              <h2>8. Connected Apps</h2>
              <p>
                You can connect AI assistants such as Claude, ChatGPT or Cursor to your account. A
                connected app acts on your behalf with the access described in our{" "}
                <Link className="legal-link" href="/legal/privacy-policy">
                  Privacy Policy
                </Link>
                , and your use of it is governed by its own terms. You can disconnect it at any time in
                Settings &rsaquo; Connections.
              </p>
            </section>

            <section className="legal-sec">
              <h2>9. Payments and Analysis Hours</h2>
              <p>
                Each account includes a monthly allowance of video analysis hours. The allowance depends on
                the type of account, is shown in the Service, and resets each month.
              </p>
              <p>
                You can buy additional hours in packs. Purchased hours are valid for 12 months from the date
                of purchase. Prices are shown before you pay, and payments are processed by our payment
                provider.
              </p>
              <p>
                All sales are final, except where the law requires a refund. If a payment is refunded or
                reversed, the unused hours from that purchase are removed. Hours used to analyze a match
                are not returned if the match is later deleted.
              </p>
              <p>
                Plans for programs and teams are arranged with us directly. If you accept pilot terms in
                the Service, those terms also apply.
              </p>
              <p>
                Advantage reserves the right to modify prices or monthly allowances with prior notice to
                users. A change does not affect hours you have already bought.
              </p>
            </section>

            <section className="legal-sec">
              <h2>10. Usage Limits</h2>
              <p>
                The Service sets limits on use, which are shown in the Service and may change. They
                currently include 20 Ask questions a month, videos of up to 8 GB recorded at 1080p and 30
                frames per second or better, and two club, high school or academy teams you create per
                account.
              </p>
            </section>

            <section className="legal-sec">
              <h2>11. Data Usage and Privacy</h2>
              <p>
                Your privacy is important to us. Advantage collects and processes personal and performance
                data to provide and improve the Service. By using the Service, you consent to the collection,
                use, and sharing of your data as described in our Privacy Policy.
              </p>
              <p>
                We do not sell your personal data to third parties. Please review the Privacy Policy for
                detailed information about how we collect, use, and protect your information.
              </p>
            </section>

            <section className="legal-sec">
              <h2>12. Prohibited Conduct</h2>
              <p>When using Advantage, you agree not to:</p>
              <ul className="legal-list">
                <li>
                  Use the Service for any unlawful purpose or in violation of any applicable laws or
                  regulations.
                </li>
                <li>Attempt to gain unauthorized access to the Service, accounts, systems, or networks.</li>
                <li>
                  Reverse engineer, decompile, or otherwise attempt to extract the source code or underlying
                  algorithms.
                </li>
                <li>
                  Scrape, copy, or harvest data or content from the Service without explicit permission.
                </li>
                <li>Submit false, misleading, or infringing information or content.</li>
                <li>
                  Engage in any activity that disrupts or interferes with the normal operation of the
                  Service.
                </li>
                <li>Use the Service to harass, abuse, or harm other users.</li>
              </ul>
            </section>

            <section className="legal-sec">
              <h2>13. Disclaimers and Limitations of Liability</h2>
              <p>
                The Service and all content, including analytics and reports, are provided &quot;as is&quot;
                and &quot;as available&quot; without warranties of any kind, express or implied. Advantage
                does not guarantee the accuracy, completeness, or reliability of the analytics or reports.
                Match summaries, key moments and Ask answers are written with the help of AI and may be
                inaccurate or incomplete.
              </p>
              <p>
                To the fullest extent permitted by law, Advantage and its affiliates shall not be liable for
                any indirect, incidental, special, consequential, or punitive damages arising out of or
                related to your use of the Service.
              </p>
              <p>
                Your use of the Service is at your sole risk. It is your responsibility to verify and
                interpret analytics appropriately before making decisions based on them.
              </p>
            </section>

            <section className="legal-sec">
              <h2>14. Termination and Suspension</h2>
              <p>
                Advantage reserves the right, at its sole discretion and without prior notice, to suspend or
                terminate your account and access to the Service, for any reason or no reason, including but
                not limited to violation of these Terms, suspected fraud, or behavior harmful to the platform
                or other users.
              </p>
              <p>
                Upon termination, your right to use the Service will cease, and Advantage may delete or
                deactivate your account and any related data in accordance with our data retention policies.
              </p>
              <p>
                You may terminate your account at any time by following the procedures provided in the
                Service. Termination does not relieve you of any payment obligations incurred prior to
                termination.
              </p>
            </section>

            <section className="legal-sec">
              <h2>15. Modifications to Terms</h2>
              <p>
                Advantage reserves the right to modify or update these Terms at any time. When changes are
                made, Advantage will post the updated Terms on the Service and update the &quot;Last
                Updated&quot; date.
              </p>
              <p>
                Continued use of the Service after such modifications constitutes your acceptance of the
                revised Terms. If you do not agree to the new Terms, you must stop using the Service.
              </p>
            </section>

            <section className="legal-sec">
              <h2>16. Governing Law and Dispute Resolution</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the State of
                California, without regard to its conflict of law principles.
              </p>
              <p>
                Any disputes arising out of or relating to these Terms or the use of the Service shall be
                resolved through binding arbitration in Bakersfield, California, in accordance with the rules
                of the American Arbitration Association.
              </p>
              <p>
                You and Advantage agree to waive the right to a trial by jury or to participate in
                class-action lawsuits or class-wide arbitration.
              </p>
            </section>

            <section className="legal-sec">
              <h2>17. Contact Information</h2>
              <p>If you have any questions about these Terms or the Service, please contact us at:</p>
              <p>
                Email:{" "}
                <a className="legal-link" href="mailto:team@advantage-analytics.com">
                  team@advantage-analytics.com
                </a>
              </p>
            </section>
          </article>
        </div>
      </section>
    </PageFrame>
  );
}

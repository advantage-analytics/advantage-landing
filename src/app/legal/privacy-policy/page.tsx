import Link from "next/link";
import { PageFrame, PageHead } from "@/components/perspective/page-frame";
import "../legal.css";

export const metadata = {
  title: "Privacy Policy — Advantage",
  description: "How Advantage collects, uses, and protects your information.",
};

export default function Page() {
  return (
    <PageFrame>
      <PageHead
        eyebrow="Legal"
        title="Privacy Policy"
        meta="Version 1.4 · Last updated October 25, 2026"
      />
      <section className="band">
        <div className="wrap">
          <article className="legal-doc">
            <section className="legal-sec">
              <h2>1. Introduction</h2>
              <p>
                At Advantage (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), we value your privacy and are
                committed to protecting your personal information. This Privacy Policy explains how we
                collect, use, disclose, and safeguard your information when you use our tennis analytics
                platform and services (the &quot;Service&quot;).
              </p>
              <p>
                We are committed to complying with applicable data protection laws, including the
                California Consumer Privacy Act (CCPA) and the European General Data Protection Regulation
                (GDPR), where applicable.
              </p>
              <p>Please note that Advantage does not collect any health or biometric data.</p>
              <p>
                By using the Service, you agree to the collection and use of your information as described
                in this policy. Please read it carefully to understand our practices regarding your
                personal data.
              </p>
              <p>If you do not agree with our policies and practices, please do not use the Service.</p>
            </section>

            <section className="legal-sec">
              <h2>2. Information We Collect</h2>
              <p>When you use Advantage, we collect the following types of information:</p>
              <p>
                <strong>Personal Information:</strong> This includes your name, email address, the role
                you choose (player, coach or parent), your college or team, the answers you give during
                sign-up, and any other information you provide when creating an account. If you sign in
                with Google, we receive your name, email address and photo from Google. In Settings you
                can also add a profile photo, date of birth, phone number, country and state, and your
                playing hand and backhand.
              </p>
              <p>
                <strong>Match Data:</strong> This includes match statistics, scores, shot and court
                positions, opponents, the AI match summaries and key moments produced from them, and
                other tennis-related performance data you submit to the Service.
              </p>
              <p>
                <strong>Match Video:</strong> Video you upload of your matches, and match files you
                import from other apps such as SwingVision.
              </p>
              <p>
                <strong>Team Data:</strong> If you run a team on Advantage, the players you add to it:
                their name, class year and playing hand.
              </p>
              <p>
                <strong>Ask History:</strong> The questions you ask Advantage about your matches, and its
                answers.
              </p>
              <p>
                <strong>Usage Data:</strong> We collect information about how you interact with the
                Service, such as IP addresses, device type, browser information, pages visited, and
                timestamps.
              </p>
              <p>
                <strong>Third-Party Data:</strong> If you connect your account to third-party services or
                platforms, we may receive information from those services in accordance with your consent.
              </p>
              <p>
                <strong>Information from Public Sources:</strong> We collect the work email addresses of
                college tennis coaching staff from their schools&apos; public staff directories. We use
                them to tell a program about its page on Advantage and to offer it access. Every such
                email includes a way to object and stop further emails.
              </p>
              <p>
                When you buy analysis hours, our payment provider collects your card details. We never see
                or store your card number. We keep a record of what you bought and when.
              </p>
              <p>We do not collect health or biometric data.</p>
            </section>

            <section className="legal-sec">
              <h2>3. How We Use Your Information</h2>
              <p>Advantage uses the information we collect for the following purposes:</p>
              <ul className="legal-list">
                <li>To provide, operate, and maintain the Service.</li>
                <li>To process your account registration and your purchases of analysis hours.</li>
                <li>To analyze and generate tennis performance reports based on the data you submit.</li>
                <li>
                  To analyze uploaded match video and produce statistics, court visualizations, AI match
                  summaries and key moments.
                </li>
                <li>
                  To train and improve the models that analyze match video and write match summaries. Our
                  video analysis provider uses match video of adult players to improve its analysis
                  models. We never use video from junior player accounts, or from high school or junior
                  teams, to train models.
                </li>
                <li>
                  To communicate with you, including sending service-related announcements, updates,
                  support messages, usage alerts, and a warning before a video is deleted.
                </li>
                <li>
                  To review the quality of our analysis, which may include a member of our team looking at
                  a match.
                </li>
                <li>To improve and customize the Service and develop new features.</li>
                <li>To detect, prevent, and address technical issues, fraud, or abuse.</li>
                <li>To comply with legal obligations.</li>
              </ul>
              <p>
                We send emails that help you get started with Advantage, which you can turn off in
                Settings, and marketing emails to college coaching staff at their work addresses as
                described in Section 2. You can unsubscribe from any marketing email.
              </p>
            </section>

            <section className="legal-sec">
              <h2>4. How We Share Your Information</h2>
              <p>We do not sell your personal information.</p>
              <p>We may share your information with:</p>
              <p>
                <strong>Service Providers:</strong> Trusted third-party companies that perform services on
                our behalf, such as cloud hosting and storage, video analysis, email delivery, payment
                processing, product analytics, and customer support. Our video analysis provider receives
                your match video to analyze it on our behalf, and may use video of adult players to
                improve its analysis models.
              </p>
              <p>
                <strong>AI Service Providers:</strong> Ask answers and match summaries are written with
                the help of an AI model from a third-party provider. We send it your first name and the
                statistics needed to answer your question or summarise your match.
              </p>
              <p>
                <strong>Teams You Join:</strong> Matches filed to a team are visible to the team&apos;s
                members, including its coaches and your teammates. Your personal matches are never
                visible to your team.
              </p>
              <p>
                <strong>Public Match Links:</strong> If you create a link to a match, anyone with the link
                can see its score and statistics, and its video if you choose to include it. The video can
                be removed from the link at any time.
              </p>
              <p>
                <strong>College Programs:</strong> The rosters and match results of college programs on
                Advantage are visible to other signed-in Advantage users, for scouting. College names can
                be searched by anyone.
              </p>
              <p>
                <strong>Apps You Connect:</strong> If you connect an AI assistant such as Claude,
                ChatGPT or Cursor to your Advantage account, it acts on your behalf: it can read your
                match statistics, and those of teams you belong to, and ask questions that use your
                monthly Ask allowance and are saved to your Ask history. It can also change the details of a match you created (such as
                the opponent, tournament or date, but never the score) and start a video upload draft
                that you finish in Advantage. It cannot delete a match or its statistics. What that app does with the
                information is governed by its own privacy policy. You can disconnect it at any time in
                Settings &rsaquo; Connections in Advantage, or by removing it in the app.
              </p>
              <p>
                <strong>Legal Authorities:</strong> If required by law, legal process, or to protect the
                rights, property, or safety of Advantage, our users, or others.
              </p>
              <p>
                <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of
                assets, your information may be transferred as part of the business transaction.
              </p>
              <p>
                <strong>With Your Consent:</strong> We may share your information with third parties if you
                give us explicit permission to do so.
              </p>
              <p>
                We require all third parties to handle your information securely and in accordance with
                applicable data protection laws.
              </p>
            </section>

            <section className="legal-sec">
              <h2>5. User Rights</h2>
              <p>
                Depending on your location and applicable law, you may have the following rights regarding
                your personal information:
              </p>
              <p>
                <strong>Access:</strong> The right to request a copy of the personal data we hold about
                you.
              </p>
              <p>
                <strong>Correction:</strong> The right to request correction of inaccurate or incomplete
                data.
              </p>
              <p>
                <strong>Deletion:</strong> The right to request deletion of your personal data, subject to
                certain legal exceptions.
              </p>
              <p>
                <strong>Data Portability:</strong> The right to request a portable copy of your data in a
                commonly used format.
              </p>
              <p>
                <strong>Opt-Out:</strong> The right to opt out of receiving marketing communications from
                us.
              </p>
              <p>
                <strong>Withdraw Consent:</strong> Where we rely on consent, you may withdraw it at any
                time.
              </p>
              <p>
                To exercise these rights, please contact us at{" "}
                <a className="legal-link" href="mailto:team@advantage-analytics.com">
                  team@advantage-analytics.com
                </a>
                .
              </p>
              <p>We will respond to your requests in accordance with applicable laws.</p>
            </section>

            <section className="legal-sec">
              <h2>6. Cookies and Tracking Technologies</h2>
              <p>
                Advantage uses cookies and similar tracking technologies to enhance your experience,
                analyze usage, and improve the Service.
              </p>
              <p>
                <strong>Essential Cookies:</strong> Necessary for basic operation of the Service.
              </p>
              <p>
                <strong>Analytics Cookies:</strong> Help us understand how users interact with the Service
                to improve functionality. This includes recordings of how pages are used, with the text
                you type and the content on screen masked so that we cannot see it.
              </p>
              <p>We do not use cookies for advertising purposes.</p>
              <p>
                You can control or disable cookies through your browser settings; however, some features of
                the Service may not function properly if cookies are disabled.
              </p>
            </section>

            <section className="legal-sec">
              <h2>7. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal
                information against unauthorized access, disclosure, alteration, or destruction.
              </p>
              <p>
                These measures include encryption, secure servers, access controls, and regular security
                assessments.
              </p>
              <p>
                However, no method of transmission over the internet or electronic storage is completely
                secure. While we strive to protect your data, we cannot guarantee absolute security.
              </p>
            </section>

            <section className="legal-sec">
              <h2>8. Data Retention</h2>
              <p>
                Advantage retains your personal information only as long as necessary to provide the
                Service, comply with legal obligations, resolve disputes, and enforce our agreements.
              </p>
              <p>When data is no longer needed, we securely delete or anonymize it.</p>
              <p>
                <strong>Match video:</strong> Uploaded match video is kept for up to one year after it was
                last viewed, then deleted. We email you 30 days before. The statistics from it are kept.
                You can remove a video sooner at any time. Our video analysis provider has no more than
                14 days to download a video for analysis.
              </p>
              <p>
                <strong>Team matches:</strong> Matches you file to a team on Advantage belong to that team
                and stay with it if you delete your account. Your details as uploader are removed from them.
                Your personal matches are deleted with your account.
              </p>
              <p>
                <strong>Your account:</strong> Deleting your account also deletes your Ask history and
                the usage records for your personal matches. You can&apos;t delete your account while you own a team; contact us to hand
                the team over first.
              </p>
            </section>

            <section className="legal-sec">
              <h2>9. International Data Transfers</h2>
              <p>
                Advantage&apos;s servers and service providers may be located in various countries,
                including the United States and Canada.
              </p>
              <p>
                By using the Service, you acknowledge and consent to the transfer of your information to
                countries that may have different data protection laws than your country of residence.
              </p>
              <p>
                We take appropriate measures to ensure that your data is protected in accordance with
                applicable laws, including implementing standard contractual clauses where required.
              </p>
            </section>

            <section className="legal-sec">
              <h2>10. Children&apos;s Privacy</h2>
              <p>
                Children cannot create their own Advantage account. A player under 18 uses Advantage through
                an account that their parent or legal guardian creates and manages. We collect information
                about a junior player only through that account, with the guardian&apos;s consent, as
                described in our{" "}
                <Link className="legal-link" href="/legal/guardian-terms">
                  Guardian Terms
                </Link>
                .
              </p>
              <p>
                We never use video from junior player accounts, or from high school or junior teams, to
                train models.
              </p>
              <p>
                If we learn that we have collected personal information from a child under 13 without a
                parent or guardian&apos;s consent, we will take prompt steps to delete it.
              </p>
              <p>
                If you are a parent or guardian and believe that your child has provided us with personal
                information, please contact us at{" "}
                <a className="legal-link" href="mailto:team@advantage-analytics.com">
                  team@advantage-analytics.com
                </a>
                .
              </p>
            </section>

            <section className="legal-sec">
              <h2>11. Policy Updates</h2>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices,
                legal requirements, or the Service.
              </p>
              <p>
                When we make material changes, we will notify you by posting the updated policy on our
                Service and updating the &quot;Last Updated&quot; date.
              </p>
              <p>
                We encourage you to review this policy periodically to stay informed about how we protect
                your information.
              </p>
              <p>
                Your continued use of the Service after changes constitutes acceptance of the revised
                policy.
              </p>
            </section>

            <section className="legal-sec">
              <h2>12. Contact Information</h2>
              <p>
                If you have any questions, concerns, or requests regarding this Privacy Policy or your
                personal data, please contact us at:
              </p>
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

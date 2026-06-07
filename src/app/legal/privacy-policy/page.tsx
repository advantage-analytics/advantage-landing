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
        meta="Version 1.0 · Last updated August 13, 2025"
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
                <strong>Personal Information:</strong> This includes your name, email address, username,
                and any other information you provide when creating an account.
              </p>
              <p>
                <strong>Performance Data:</strong> This includes match statistics, scores, and other
                tennis-related performance data you submit to the Service.
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
                Please note that Advantage does not collect or store payment or billing information. All
                payments are processed securely by our trusted third-party payment providers.
              </p>
              <p>We do not collect health or biometric data.</p>
            </section>

            <section className="legal-sec">
              <h2>3. How We Use Your Information</h2>
              <p>Advantage uses the information we collect for the following purposes:</p>
              <ul className="legal-list">
                <li>To provide, operate, and maintain the Service.</li>
                <li>To process your account registration and manage your subscription plans.</li>
                <li>To analyze and generate tennis performance reports based on the data you submit.</li>
                <li>
                  To communicate with you, including sending service-related announcements, updates, and
                  support messages.
                </li>
                <li>To improve and customize the Service and develop new features.</li>
                <li>To detect, prevent, and address technical issues, fraud, or abuse.</li>
                <li>To comply with legal obligations.</li>
              </ul>
              <p>We do not use your personal data for marketing purposes unless you explicitly opt-in.</p>
            </section>

            <section className="legal-sec">
              <h2>4. How We Share Your Information</h2>
              <p>We do not sell your personal information.</p>
              <p>We may share your information with:</p>
              <p>
                <strong>Service Providers:</strong> Trusted third-party companies that perform services on
                our behalf, such as data hosting, analytics, and customer support.
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
                to improve functionality.
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
            </section>

            <section className="legal-sec">
              <h2>9. International Data Transfers</h2>
              <p>
                Advantage&apos;s servers and service providers may be located in various countries,
                including the United States.
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
                Advantage does not knowingly collect personal information from children under the age of
                13.
              </p>
              <p>
                If we become aware that we have inadvertently collected such information, we will take
                prompt steps to delete it.
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

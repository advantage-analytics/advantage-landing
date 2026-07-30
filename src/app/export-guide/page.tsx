import type { ReactNode } from "react";
import { Check, X } from "lucide-react";
import {
  CampaignFrame,
  CampaignHead,
} from "@/components/campaign/campaign-frame";
import { MAX_UPLOAD_LABEL, MAX_UPLOAD_HOURS } from "@/lib/match-intake";
import { CONTACT_EMAIL } from "@/lib/links";
import "./export-guide.css";

export const metadata = {
  title: "Sending a large match file — Advantage",
  // Built from the constants, not restated: a stale figure here is the least
  // recoverable kind, since it is what search results and link previews show.
  description: `The upload window takes files up to ${MAX_UPLOAD_LABEL}, about ${MAX_UPLOAD_HOURS} of video. If yours is bigger, paste a share link instead — there's no size limit on links.`,
};

/* This page used to be a compression tutorial: HandBrake presets, an ffmpeg
   command, a bitrate table. All of it deleted on purpose.

   The size ceiling is there to stop upload abuse, not because anything downstream
   needs a small file, so it can sit high enough that virtually no real match
   trips it. And the coaches reading this are not technical — asking them to
   install an encoder to send us a video is exactly the resistance the campaign
   can't afford. Everything below is achievable with software they already have,
   and the first answer is simply "don't upload it, link it": a share URL has no
   size limit at all, so the problem disappears rather than being worked around. */

const KEEP: ReactNode[] = [
  <>The full court in frame, from behind the baseline</>,
  <>
    The resolution you shot &mdash; <strong>1080p is plenty</strong>
  </>,
  <>The whole match, changeovers and all</>,
];

const SKIP: ReactNode[] = [
  <>
    Cropping or zooming &mdash; we read the court lines, so we need them in frame
  </>,
  <>Highlight reels &mdash; the patterns live in the full sequence of points</>,
];

export default function Page() {
  return (
    <CampaignFrame className="eg-page">
      <CampaignHead
        eyebrow="Sending a match"
        title="If your file is too big to upload."
        lede={`The upload window takes files up to ${MAX_UPLOAD_LABEL}, which is roughly ${MAX_UPLOAD_HOURS} of phone video. Almost every match fits. If yours doesn't, you don't need to compress anything.`}
      />

      <article className="eg-doc">
        <section className="eg-sec">
          <h2>Check the size first</h2>
          <p>
            Most files are already under the line.{" "}
            <strong>On a Mac</strong>, right-click the file and choose{" "}
            <strong>Get Info</strong>. <strong>On Windows</strong>,
            right-click and choose <strong>Properties</strong>. Under{" "}
            {MAX_UPLOAD_LABEL} and you&rsquo;re done &mdash; go send it.
          </p>
          <p>
            PlaySight and similar court systems export files sized for
            streaming, so those clear the line comfortably. Phone video runs
            around 60MB a minute, so an hour is about 3.5GB and even a long
            three-setter usually lands well inside {MAX_UPLOAD_LABEL}.
          </p>
          <p className="campaign-note">
            The ceiling is there to keep the upload window from being abused,
            not because we need a small file. Bigger is fine by us.
          </p>
        </section>

        {/* The whole answer, really. A link has no size limit, so the
            oversized-file problem stops existing rather than being solved. */}
        <section className="eg-sec">
          <h2>Over the line? Send a link instead</h2>
          <p>
            <strong>There&rsquo;s no size limit on a link.</strong>{" "}
            If the match is already in Google Drive, Dropbox, iCloud, PlaySight or
            Hudl, copy the share link and paste it into the form instead of
            uploading. That&rsquo;s the whole fix, and it takes about ten
            seconds.
          </p>
          <p>
            One thing to check: set the sharing on it to{" "}
            <strong>&ldquo;anyone with the link can view&rdquo;</strong>,
            otherwise it opens for you and nobody else.
          </p>
        </section>

        <section className="eg-sec">
          <h2>Or send us one set</h2>
          <p>
            If linking isn&rsquo;t an option, send a single set rather than
            the whole match. Your phone and your laptop can both shorten a
            video without any extra software &mdash; Photos on iPhone and
            Mac, Photos on Windows &mdash; and a set is still a full run of
            points, which is what we read.
          </p>
          <p>
            We&rsquo;d rather have the whole match, so treat this as the last
            resort rather than the default.
          </p>
        </section>

        <section className="eg-sec">
          <h2>What we read, and what we don&rsquo;t</h2>
          <div className="eg-cols">
            <div className="eg-col">
              <span className="eyebrow">Keep</span>
              <ul className="campaign-list">
                {KEEP.map((item, i) => (
                  <li className="campaign-item is-keep" key={i}>
                    <Check size={15} strokeWidth={1.75} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="eg-col">
              <span className="eyebrow">Skip</span>
              <ul className="campaign-list">
                {SKIP.map((item, i) => (
                  <li className="campaign-item is-skip" key={i}>
                    <X size={15} strokeWidth={1.75} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="campaign-note">
            Audio is the one thing you can throw away freely &mdash; we
            don&rsquo;t use it.
          </p>
        </section>

        {/* The way back. Most readers arrive from the form in a new tab and
            can simply close this one, but anyone landing here from the
            confirmation email needs a route to the form. */}
        <section className="eg-sec">
          <h2>Still stuck?</h2>
          <p>
            Send a note to{" "}
            <a className="campaign-link" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>{" "}
            and we&rsquo;ll sort it out with you &mdash; a file we have to
            wrestle with is our problem, not yours.
          </p>
          <a className="campaign-btn campaign-btn-primary" href="/send-a-match">
            Back to your match
          </a>
        </section>
      </article>
    </CampaignFrame>
  );
}

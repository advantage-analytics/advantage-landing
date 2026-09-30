import type { ReactNode } from "react";
import { Check, X } from "lucide-react";
import {
  CampaignFrame,
  CampaignHead,
} from "@/components/campaign/campaign-frame";
import { CONTACT_EMAIL, links } from "@/lib/links";
import {
  VIDEO_FORMATS,
  VIDEO_MAX_SIZE,
  VIDEO_MIN_FPS,
  VIDEO_MIN_RESOLUTION,
  VIDEO_SIZE_PER_HOUR,
} from "@/lib/match-video";
import "./export-guide.css";

export const metadata = {
  title: "Getting match video into Advantage — Advantage",
  // Built from the constants, not restated: a stale figure here is the least
  // recoverable kind, since it is what search results and link previews show.
  description: `How to get match video off the camera and into the Advantage dashboard: ${VIDEO_MIN_RESOLUTION} or better, ${VIDEO_MIN_FPS} or higher, ${VIDEO_FORMATS}, under ${VIDEO_MAX_SIZE}.`,
};

/* Linked from the dashboard uploader, the home page's How it works and FAQ,
   and the footer. Whoever is here has a match on a phone, a court system or a
   drive and wants it in the dashboard, so the sections run in the order they
   meet the problem: film it right, get the file off the device, check its
   size, and trim it if it's over.

   The limits come from lib/match-video, which the home page and /pilot read
   too. There is no link upload and no compression step on purpose: the
   uploader takes the original file, and the coaches reading this are not
   technical — every step below uses software they already have. */

const KEEP: ReactNode[] = [
  <>The full court in frame, from behind the baseline</>,
  <>
    The resolution you shot &mdash; <strong>{VIDEO_MIN_RESOLUTION} or better</strong>
  </>,
  <>
    Complete games &mdash; the whole match, changeovers and all, if it fits
  </>,
];

const SKIP: ReactNode[] = [
  <>
    Cropping or zooming &mdash; we read the court lines, so we need them in frame
  </>,
  <>Highlight reels &mdash; the patterns live in the full sequence of points</>,
  <>Doubles &mdash; singles only for now</>,
];

export default function Page() {
  return (
    <CampaignFrame className="eg-page">
      <CampaignHead
        eyebrow="Export guide"
        title="Getting match video into Advantage."
        lede={`Upload the original file from the camera. It needs to be ${VIDEO_MIN_RESOLUTION} or better at ${VIDEO_MIN_FPS} or higher, ${VIDEO_FORMATS}, under ${VIDEO_MAX_SIZE}, and cover complete games of a singles match.`}
      />

      <article className="eg-doc">
        <section className="eg-sec">
          <h2>Check your settings before you film</h2>
          <p>
            <strong>On an iPhone</strong>, open <strong>Settings</strong>{" "}
            &rarr; <strong>Camera</strong> &rarr; <strong>Record Video</strong>{" "}
            and choose {VIDEO_MIN_RESOLUTION} at {VIDEO_MIN_FPS} or higher.
          </p>
          <p>
            <strong>On Android</strong>, open the Camera app, switch to video
            and tap the settings gear. Set the video size or resolution to{" "}
            {VIDEO_MIN_RESOLUTION} (sometimes labelled FHD) at {VIDEO_MIN_FPS}{" "}
            or higher. The exact wording varies by phone.
          </p>
          <p className="campaign-note">
            4K is fine too. It makes much bigger files, though, so a long match
            is more likely to go over {VIDEO_MAX_SIZE}.
          </p>
        </section>

        {/* The one rule under all four routes: the original file. A share or
            message copy is re-encoded smaller, sometimes under the floor. */}
        <section className="eg-sec">
          <h2>Get the file off the device</h2>
          <p>
            Whatever route you take, upload the <strong>original file</strong>,
            not a copy made for sharing. Messaging apps and email shrink video
            to send it, and a shrunk copy can fall below{" "}
            {VIDEO_MIN_RESOLUTION}.
          </p>
          <ul className="eg-routes">
            <li>
              <strong>iPhone to Mac.</strong> AirDrop it, or in Photos on the
              Mac choose <strong>File</strong> &rarr; <strong>Export</strong>{" "}
              &rarr; <strong>Export Unmodified Original</strong>.
            </li>
            <li>
              <strong>Phone to Windows.</strong> Connect with a USB cable and
              import it with the Photos app. On Android, choose{" "}
              <strong>File transfer</strong> when the phone asks.
            </li>
            <li>
              <strong>PlaySight or Hudl.</strong> Download the match video from
              the platform, at the highest quality it offers.
            </li>
            <li>
              <strong>Google Drive or Dropbox.</strong> Download the file to
              your computer first, then upload that. The download is the
              original.
            </li>
          </ul>
        </section>

        <section className="eg-sec">
          <h2>Check the size</h2>
          <p>
            <strong>On a Mac</strong>, right-click the file and choose{" "}
            <strong>Get Info</strong>. <strong>On Windows</strong>, right-click
            and choose <strong>Properties</strong>. Under {VIDEO_MAX_SIZE}
            {" "}and it&rsquo;s ready to upload.
          </p>
          <p>
            An hour of {VIDEO_MIN_RESOLUTION} phone video at {VIDEO_MIN_FPS} is about{" "}
            {VIDEO_SIZE_PER_HOUR}, so most matches fit.
          </p>
        </section>

        <section className="eg-sec">
          <h2>Over {VIDEO_MAX_SIZE}? Trim it to complete games</h2>
          <p>
            Cut the video down to a run of complete games, one set for
            example, and upload that. Photos on iPhone, Mac and Windows can all
            trim a video, and trimming keeps the resolution. Start and end the
            clip between games, not partway through one.
          </p>
          <p className="campaign-note is-caution">
            Don&rsquo;t use a compression app. They lower the resolution or
            frame rate, and the tracking needs both.
          </p>
          <p>
            Still over, or can&rsquo;t trim it? Email{" "}
            <a className="campaign-link" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>{" "}
            and we&rsquo;ll sort it out with you.
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

        {/* The way back. Most readers arrive from the uploader and can close
            this tab; anyone landing from the home page or a search needs the
            door. Signed-out visitors go through sign-in first. */}
        <section className="eg-sec">
          <h2>Ready to upload</h2>
          <p>
            The uploader is in your dashboard. The breakdown lands there too,
            and we email you when it&rsquo;s ready.
          </p>
          <a className="campaign-btn campaign-btn-primary" href={links.uploadMatch}>
            Upload a match
          </a>
        </section>
      </article>
    </CampaignFrame>
  );
}

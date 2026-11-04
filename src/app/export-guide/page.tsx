import Link from "next/link";
import { PageFrame } from "@/components/perspective/page-frame";
import { CONTACT_EMAIL, links } from "@/lib/links";
import {
  RECORDING_GUIDE_HREF,
  VIDEO_FORMAT_BEST,
  VIDEO_MAX_SIZE,
  VIDEO_MIN_FPS,
  VIDEO_MIN_RESOLUTION,
  VIDEO_SIZE_PER_HOUR,
} from "@/lib/match-video";
import { pageMetadata } from "@/lib/metadata";
import { MovedAnchors } from "./moved-anchors";
import "@/components/guide/guide.css";

export const metadata = pageMetadata({
  title: "Getting match video into Advantage — Advantage",
  // Built from the constants, not restated: a stale figure here is the least
  // recoverable kind, since it is what search results and link previews show.
  description: `How to get a filmed match into the Advantage dashboard: the original file off your phone, GoPro, PlaySight or SwingVision, ${VIDEO_MIN_RESOLUTION} or better at ${VIDEO_MIN_FPS} or higher, under ${VIDEO_MAX_SIZE}, and what the uploader does for you.`,
  path: "/export-guide",
  ownCard: true,
});

/* After the match. Whoever is here has a match on a phone, a court system or
   a drive and wants it in the dashboard. Filming it (where the camera goes,
   its settings) is the recording guide's job; this page starts from the file.
   Linked from the dashboard's Help page, the home page's How it works and FAQ,
   the footer, /send-a-match and the recording guide's last section.

   The sections run in the order the reader meets the problem: what the
   uploader checks, getting the original off the device, the size, trimming,
   and what each refusal means. The uploader does more than it used to (it
   converts HEVC and 4K, trims in its own step and compresses a file over the
   limit in the browser), so the page says so before it asks anyone to edit a
   file themselves.

   The limits come from lib/match-video, which the home page and /pilot read
   too. The refusal messages are quoted from the dashboard
   (lib/match-video/types.ts ERROR_SPECS and lib/video/trim-plan.ts
   oversizeVideoMessage); when they change there, change them here. The
   coaches reading this are not technical: every step uses software they
   already have. */

const SECTIONS = [
  { id: "checks", label: "What the uploader checks" },
  { id: "off-the-device", label: "Get the file off" },
  { id: "size", label: "Size and trimming" },
  { id: "uploader-says", label: "If the uploader says…" },
  { id: "upload", label: "Upload" },
];

export default function Page() {
  return (
    <PageFrame>
      <MovedAnchors />
      <div className="wrap eg-page">
        <section className="eg-head">
          <span className="eg-eyebrow">Export guide</span>
          <h1>Getting match video into Advantage.</h1>
          <p className="eg-lede">
            You&rsquo;ve filmed the match. Get the original file off the device
            and upload it; the uploader checks it and handles the rest. Not
            filmed yet? Start with the{" "}
            <Link className="eg-link" href={RECORDING_GUIDE_HREF}>
              recording guide
            </Link>
            .
          </p>
        </section>

        <nav className="eg-anchors" aria-label="On this page">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`}>
              {s.label}
            </a>
          ))}
        </nav>

        <section className="eg-sec" id="checks">
          <h2>What the uploader checks</h2>
          <p className="eg-prose">
            The uploader reads these off the file when you pick it, before
            anything uploads. If one fails, it says which and why.
          </p>
          <dl className="eg-specs">
            <dt>Resolution</dt>
            <dd>{VIDEO_MIN_RESOLUTION} or better</dd>
            <dt>Frame rate</dt>
            <dd>
              {VIDEO_MIN_FPS} or higher
              <span className="eg-aside">60 fps is better</span>
            </dd>
            <dt>Size</dt>
            <dd>
              Under {VIDEO_MAX_SIZE}
              <span className="eg-aside">
                An hour of {VIDEO_MIN_RESOLUTION} phone video at {VIDEO_MIN_FPS}{" "}
                is about {VIDEO_SIZE_PER_HOUR}
              </span>
            </dd>
            <dt>Format</dt>
            <dd>
              {VIDEO_FORMAT_BEST} works best
              <span className="eg-aside">
                Most phone and camera formats are accepted
              </span>
            </dd>
          </dl>
          <p className="eg-note">
            HEVC and 4K video are converted to {VIDEO_MIN_RESOLUTION}{" "}
            {VIDEO_FORMAT_BEST} in your browser before they upload. How the match
            was filmed is yours to check &mdash; where the camera stood, one
            camera, singles, complete games &mdash; and that&rsquo;s all in the{" "}
            <Link className="eg-link" href={RECORDING_GUIDE_HREF}>
              recording guide
            </Link>
            .
          </p>
        </section>

        {/* The one rule under every route: the original file. A share or
            message copy is re-encoded smaller, sometimes under the floor. */}
        <section className="eg-sec" id="off-the-device">
          <h2>Get the file off the device</h2>
          <p className="eg-prose">
            Whatever route you take, upload the <strong>original file</strong>,
            not a copy made for sharing. Messaging apps and email shrink video to
            send it, and a shrunk copy can fall below {VIDEO_MIN_RESOLUTION}.
          </p>
          <ul className="eg-routes">
            <li>
              <strong>iPhone to Mac.</strong> AirDrop it, or in Photos on the Mac
              choose <strong>File</strong> &rarr; <strong>Export</strong> &rarr;{" "}
              <strong>Export Unmodified Original</strong>.
            </li>
            <li>
              <strong>Phone to Windows.</strong> Connect with a USB cable and
              import it with the Photos app. On Android, choose{" "}
              <strong>File transfer</strong> when the phone asks.
            </li>
            <li>
              <strong>GoPro or another action camera.</strong> Copy the file to
              your computer from the memory card with a card reader, or over the
              USB cable.
            </li>
            <li>
              <strong>PlaySight or Hudl.</strong> Download the full match from the
              platform at the highest quality it offers, from the camera behind
              the baseline, not a highlight clip.
            </li>
            <li>
              <strong>Google Drive or Dropbox.</strong> Download the file to your
              computer first, then upload that. The download is the original.
            </li>
            <li id="swingvision">
              <strong>SwingVision.</strong> For the stats, export the
              match&rsquo;s data from SwingVision and import the .xlsx. It takes
              about a minute, needs no video and uses no analysis hours.{" "}
              <a className="eg-link" href={links.swingVisionHelp}>
                How to export from SwingVision
              </a>
              . For the film, open the match in Advantage and choose{" "}
              <strong>Add video</strong> on its Film tab.
              {/* TODO: say how to save the full match video out of SwingVision
                  once that's confirmed. */}
            </li>
          </ul>
        </section>

        <section className="eg-sec" id="size">
          <h2>Size and trimming</h2>
          <p className="eg-prose">
            <strong>On a Mac</strong>, right-click the file and choose{" "}
            <strong>Get Info</strong>. <strong>On Windows</strong>, right-click
            and choose <strong>Properties</strong>. Most matches filmed on a
            phone&rsquo;s defaults come in under {VIDEO_MAX_SIZE}.
          </p>
          <table className="eg-table">
            <thead>
              <tr>
                <th scope="col">iPhone setting</th>
                <th scope="col">Per minute</th>
                <th scope="col">Two-hour match</th>
                <th scope="col">At upload</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1080p30 &middot; High Efficiency</td>
                <td className="is-num">about 60 MB</td>
                <td className="is-num">about 7 GB</td>
                <td>Goes up as filmed, converted to {VIDEO_FORMAT_BEST}</td>
              </tr>
              <tr>
                <td>1080p30 &middot; Most Compatible</td>
                <td className="is-num">about 130 MB</td>
                <td className="is-num">about 15 GB</td>
                <td>Over {VIDEO_MAX_SIZE}: trimmed or compressed first</td>
              </tr>
            </tbody>
          </table>

          <h3 className="eg-subhead">Trim it in the uploader</h3>
          <p className="eg-prose">
            The uploader&rsquo;s video check step plays your file and lets you
            set where the match starts and ends. It cuts the file in your browser
            without lowering the quality, before anything uploads. Start just
            before the first serve and end after the last point, between games
            rather than partway through one.
          </p>
          <p className="eg-prose">
            The score you enter has to cover only the games you kept.
          </p>

          <h3 className="eg-subhead">Over {VIDEO_MAX_SIZE}</h3>
          <p className="eg-prose">
            If the part you keep is still over {VIDEO_MAX_SIZE}, the uploader
            compresses it to {VIDEO_MIN_RESOLUTION} in your browser first. That
            takes a while on a long match: keep the tab open and the computer
            awake. If your browser can&rsquo;t do it, the uploader says so, and
            you can trim the video in Photos on iPhone, Mac or Windows before you
            add it again.
          </p>
          <p className="eg-note is-caution">
            Don&rsquo;t use a compression app. They lower the resolution or frame
            rate, and the tracking needs both.
          </p>
        </section>

        <section className="eg-sec" id="uploader-says">
          <h2>If the uploader says&hellip;</h2>
          <p className="eg-prose">
            Each message as the uploader shows it, and what to do about it.
          </p>
          <table className="eg-table">
            <thead>
              <tr>
                <th scope="col">The message</th>
                <th scope="col">What happened</th>
                <th scope="col">Do this</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="is-quote">
                  This video is &hellip; GB, over the {VIDEO_MAX_SIZE} limit, and this
                  browser can&rsquo;t compress this video.
                </td>
                <td>
                  The file is too big to go up as filmed, and this browser
                  can&rsquo;t shrink it.
                </td>
                <td>
                  Export it at {VIDEO_MIN_RESOLUTION} as an {VIDEO_FORMAT_BEST}{" "}
                  under {VIDEO_MAX_SIZE}, or trim it in Photos, and add it again.
                </td>
              </tr>
              <tr>
                <td className="is-quote">
                  This video cannot be played. Export it as an MP4 with H.264
                  video and try again.
                </td>
                <td>
                  The file came from an editing app or a court system in a format
                  browsers can&rsquo;t read.
                </td>
                <td>
                  Export it again as an MP4 at {VIDEO_MIN_RESOLUTION} from the app
                  it came from.
                </td>
              </tr>
              <tr>
                <td>A video below {VIDEO_MIN_RESOLUTION} is turned away</td>
                <td>
                  Usually a copy shrunk for sharing, or a camera set to 720p.
                </td>
                <td>
                  <a className="eg-link" href="#off-the-device">
                    Get the original file
                  </a>
                  , and check the{" "}
                  <Link className="eg-link" href={`${RECORDING_GUIDE_HREF}#settings`}>
                    camera settings
                  </Link>{" "}
                  before the next match.
                </td>
              </tr>
              <tr>
                <td className="is-quote">
                  This file is empty. Choose a video file.
                </td>
                <td>The copy off the device didn&rsquo;t finish.</td>
                <td>Copy it off the device again.</td>
              </tr>
              <tr>
                <td className="is-quote">This video is not long enough.</td>
                <td>
                  You&rsquo;re adding film to an imported SwingVision match, and
                  the video stops before the match does.
                </td>
                <td>Use the recording of the whole match.</td>
              </tr>
            </tbody>
          </table>
          <p className="eg-prose">
            Something else, or still stuck? Email{" "}
            <a className="eg-link" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>{" "}
            and we&rsquo;ll sort it out with you.
          </p>
        </section>

        {/* The way back. Most readers arrive from the dashboard and can close
            this tab; anyone landing from the home page or a search needs the
            door. Signed-out visitors go through sign-in first. */}
        <section className="eg-sec" id="upload">
          <h2>Ready to upload</h2>
          <p className="eg-prose">
            The uploader is in your dashboard. The breakdown lands there too, and
            we email you when it&rsquo;s ready.
          </p>
          <a className="eg-btn" href={links.uploadMatch}>
            Upload a match
          </a>
        </section>
      </div>
    </PageFrame>
  );
}

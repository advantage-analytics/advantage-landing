import type { ReactNode } from "react";
import Image from "next/image";
import { Check, X } from "lucide-react";
import { PageFrame } from "@/components/perspective/page-frame";
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
  description: `How to film a match and get the video into the Advantage dashboard: ${VIDEO_MIN_RESOLUTION} or better, ${VIDEO_MIN_FPS} or higher, ${VIDEO_FORMATS}, under ${VIDEO_MAX_SIZE}. Settings for iPhone, Android, GoPro, PlaySight and SwingVision.`,
};

/* Linked from the dashboard uploader and its Help page, the home page's How it
   works and FAQ, and the footer. Whoever is here has a match on a phone, a
   court system or a drive and wants it in the dashboard, so the sections run
   in the order they meet the problem: set the camera up, get the file off the
   device, check its size, and trim it if it's over.

   The limits come from lib/match-video, which the home page and /pilot read
   too. The uploader takes the original file, and the coaches reading this are
   not technical: every step uses software they already have.

   The iPhone screenshots are iOS 26's own Settings › Camera screens, captured
   from the simulator with the settings this guide recommends. Formats stays on
   High Efficiency on purpose: Most Compatible (H.264) doubles the file, about
   130 MB a minute at 1080p30 against 60, so a full match goes over the size
   limit. The uploader converts HEVC in the browser before it uploads; HDR is
   the setting that hurts, because its colour doesn't survive that
   conversion. */

const SECTIONS = [
  { id: "settings", label: "Camera settings" },
  { id: "off-the-device", label: "Get the file off" },
  { id: "size", label: "Check the size" },
  { id: "trim", label: "Trim it" },
  { id: "what-we-read", label: "What we read" },
  { id: "upload", label: "Upload" },
];

const CAMERAS = [
  { id: "iphone", label: "iPhone" },
  { id: "android", label: "Android" },
  { id: "gopro", label: "GoPro" },
  { id: "playsight", label: "PlaySight and court cameras" },
  { id: "swingvision", label: "SwingVision" },
];

const KEEP: ReactNode[] = [
  <>The full court in frame, from behind the baseline</>,
  <>
    The resolution you shot &mdash;{" "}
    <strong>{VIDEO_MIN_RESOLUTION} or better</strong>
  </>,
  <>Complete games &mdash; the whole match, changeovers and all, if it fits</>,
];

const SKIP: ReactNode[] = [
  <>
    Cropping or zooming &mdash; we read the court lines, so we need them in
    frame
  </>,
  <>Highlight reels &mdash; the patterns live in the full sequence of points</>,
  <>Doubles &mdash; singles only for now</>,
];

/* A setting on a screenshot: the ring outlines its row and the pin carries the
   step number into the gutter. `top` is the row's top edge in px on the 300px
   phone (a 282px screen inside a 9px bezel), measured off the screenshot. */
interface Mark {
  step: number;
  top: number;
  radius: string;
  suggested?: boolean;
}

const ROW_HEIGHT = 39;
const PIN_SIZE = 22;

function PhoneShot({
  src,
  alt,
  height,
  caption,
  marks,
}: {
  src: string;
  alt: string;
  height: number;
  caption: string;
  marks: Mark[];
}) {
  return (
    <figure className="eg-shot">
      <div className="eg-shot-stage">
        {marks.map((m) => (
          <span
            key={m.step}
            className={`eg-pin${m.suggested ? " is-suggested" : ""}`}
            style={{ top: m.top + (ROW_HEIGHT - PIN_SIZE) / 2 }}
            aria-hidden="true"
          >
            {m.step}
          </span>
        ))}
        <div className="eg-phone-crop" style={{ height }}>
          <div className="eg-phone">
            <Image
              src={src}
              alt={alt}
              width={603}
              height={1311}
              sizes="282px"
            />
            <span className="eg-island" aria-hidden="true" />
            {marks.map((m) => (
              <span
                key={m.step}
                className={`eg-ring${m.suggested ? " is-suggested" : ""}`}
                style={{ top: m.top - 2, borderRadius: m.radius }}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </div>
      <figcaption className="eg-eyebrow">{caption}</figcaption>
    </figure>
  );
}

function Step({
  n,
  title,
  suggested,
  children,
}: {
  n: number;
  title: ReactNode;
  suggested?: boolean;
  children: ReactNode;
}) {
  return (
    <li className="eg-step">
      <span className={`eg-num${suggested ? " is-suggested" : ""}`}>{n}</span>
      <div>
        <h4>
          {title}
          {suggested ? <span className="eg-aside">Suggested</span> : null}
        </h4>
        <p>{children}</p>
      </div>
    </li>
  );
}

export default function Page() {
  return (
    <PageFrame>
      <div className="wrap eg-page">
        <section className="eg-head">
          <span className="eg-eyebrow">Export guide</span>
          <h1>Getting match video into Advantage.</h1>
          <p className="eg-lede">
            Upload the original file from the camera. It needs to be{" "}
            {VIDEO_MIN_RESOLUTION} or better at {VIDEO_MIN_FPS} or higher,{" "}
            {VIDEO_FORMATS}, under {VIDEO_MAX_SIZE}, and cover complete games of a
            singles match.
          </p>
        </section>

        <nav className="eg-anchors" aria-label="On this page">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`}>
              {s.label}
            </a>
          ))}
        </nav>

        <section className="eg-sec" id="settings">
          <h2>Check your settings before you film</h2>
          <p className="eg-prose">
            Find your camera below. Whatever you film on, you&rsquo;re after the
            same file: {VIDEO_MIN_RESOLUTION} or better, {VIDEO_MIN_FPS}
            {" or higher, from one camera behind the baseline that doesn’t move."}
          </p>
          <nav className="eg-cameras" aria-label="Cameras">
            {CAMERAS.map((c) => (
              <a key={c.id} className="eg-chip" href={`#${c.id}`}>
                {c.label}
              </a>
            ))}
          </nav>

          <div className="eg-device" id="iphone">
            <h3>iPhone</h3>
            <p className="eg-prose">
              Open <strong>Settings</strong> &rarr; <strong>Camera</strong> &rarr;{" "}
              <strong>Record Video</strong>. Set it once and every match after is
              ready to upload.
            </p>

            <div className="eg-pair">
              <ol className="eg-steps eg-steps-1">
                <Step n={1} title="Choose 1080p HD at 30 fps">
                  It&rsquo;s the default. 60 fps follows fast exchanges better,
                  where your iPhone lists it. 4K works too, but a long match is
                  more likely to go over {VIDEO_MAX_SIZE}.
                </Step>
              </ol>
              <PhoneShot
                src="/assets/export-guide/iphone-record-top.png"
                alt="iPhone Settings, Camera, Record Video, with 1080p HD at 30 fps selected"
                height={420}
                caption="Camera › Record Video"
                marks={[{ step: 1, top: 142, radius: "4px" }]}
              />
            </div>

            <div className="eg-pair">
              <ol className="eg-steps eg-steps-2" start={2}>
                <Step n={2} title="Turn off HDR Video">
                  Further down Record Video. It&rsquo;s on by default, and HDR
                  colour can&rsquo;t survive the conversion before upload, so the
                  saved video looks paler and flatter than on your phone. The
                  analysis isn&rsquo;t affected.
                </Step>
                <Step n={3} title="Leave Auto FPS off" suggested>
                  In low light it drops {VIDEO_MIN_FPS} video to 24, below what
                  the analysis needs.
                </Step>
              </ol>
              <PhoneShot
                src="/assets/export-guide/iphone-record-hdr.png"
                alt="iPhone Record Video settings scrolled down, with HDR Video off and Auto FPS off"
                height={520}
                caption="Record Video, scrolled down"
                marks={[
                  { step: 2, top: 336, radius: "20px" },
                  { step: 3, top: 431, radius: "20px", suggested: true },
                ]}
              />
            </div>

            <p className="eg-note">
              Leave <strong>Formats</strong> on <strong>High Efficiency</strong>.
              Most Compatible skips the conversion before upload, but it doubles
              the file, so a full match goes over {VIDEO_MAX_SIZE}. The screens
              are from iOS 26; older versions word a few of these differently.
            </p>
          </div>

          <div className="eg-device" id="android">
            <h3>Android</h3>
            <p className="eg-prose">
              Open the Camera app, switch to video and tap the settings gear. Set
              the video size or resolution to {VIDEO_MIN_RESOLUTION} (sometimes
              labelled FHD) at {VIDEO_MIN_FPS} or higher, and turn off HDR video
              if your phone offers it. The exact wording varies by phone.
            </p>
          </div>

          <div className="eg-device" id="gopro">
            <h3>GoPro</h3>
            <dl className="eg-specs">
              <dt>Resolution</dt>
              <dd>1080</dd>
              <dt>Frame rate</dt>
              <dd>30 or 60</dd>
              <dt>Lens</dt>
              <dd>
                Linear
                <span className="eg-aside">
                  Suggested &middot; keeps the court lines straight
                </span>
              </dd>
            </dl>
            {/* TODO: a long GoPro recording is saved as several files of about
                4 GB each. Say whether to upload one part at a time or join them
                first, once that's settled. */}
            <p className="eg-prose">
              Copy the file to your computer from the memory card with a card
              reader, or over the USB cable.
            </p>
          </div>

          <div className="eg-device" id="playsight">
            <h3>PlaySight and court cameras</h3>
            <p className="eg-prose">
              Pick the camera behind the baseline, not the side view; most
              PlaySight courts already film from there. Download the full match
              from the platform at the highest quality it offers, not a highlight
              clip. Hudl works the same way.
            </p>
          </div>

          <div className="eg-device" id="swingvision">
            <h3>SwingVision</h3>
            <p className="eg-prose">
              <strong>For the stats</strong>, export the match&rsquo;s data from
              SwingVision and import the .xlsx. It takes about a minute, needs no
              video and uses no analysis hours.{" "}
              <a className="eg-link" href={links.swingVisionHelp}>
                How to export from SwingVision
              </a>
            </p>
            {/* TODO: say how to save the full match video out of SwingVision
                once that's confirmed. */}
            <p className="eg-prose">
              <strong>For the film</strong>, SwingVision records on your iPhone,
              so the iPhone settings above apply. Open the match in Advantage and
              choose <strong>Add video</strong> on its Film tab.
            </p>
          </div>
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
              <strong>PlaySight or Hudl.</strong> Download the match video from
              the platform, at the highest quality it offers.
            </li>
            <li>
              <strong>Google Drive or Dropbox.</strong> Download the file to your
              computer first, then upload that. The download is the original.
            </li>
          </ul>
        </section>

        <section className="eg-sec" id="size">
          <h2>Check the size</h2>
          <p className="eg-prose">
            <strong>On a Mac</strong>, right-click the file and choose{" "}
            <strong>Get Info</strong>. <strong>On Windows</strong>, right-click
            and choose <strong>Properties</strong>. Under {VIDEO_MAX_SIZE}
            {" and it’s ready to upload."}
          </p>
          <p className="eg-prose">
            An hour of {VIDEO_MIN_RESOLUTION} phone video at {VIDEO_MIN_FPS} is
            about {VIDEO_SIZE_PER_HOUR}, so most matches fit.
          </p>
        </section>

        <section className="eg-sec" id="trim">
          <h2>Over {VIDEO_MAX_SIZE}? Trim it to complete games</h2>
          <p className="eg-prose">
            Cut the video down to a run of complete games, one set for example,
            and upload that. Photos on iPhone, Mac and Windows can all trim a
            video, and trimming keeps the resolution. Start and end the clip
            between games, not partway through one.
          </p>
          <p className="eg-note is-caution">
            Don&rsquo;t use a compression app. They lower the resolution or frame
            rate, and the tracking needs both.
          </p>
          <p className="eg-prose">
            Still over, or can&rsquo;t trim it? Email{" "}
            <a className="eg-link" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>{" "}
            and we&rsquo;ll sort it out with you.
          </p>
        </section>

        <section className="eg-sec" id="what-we-read">
          <h2>What we read, and what we don&rsquo;t</h2>
          <div className="eg-cols">
            <div>
              <span className="eg-eyebrow">Keep</span>
              <ul className="eg-list">
                {KEEP.map((item, i) => (
                  <li className="eg-item is-keep" key={i}>
                    <Check size={15} strokeWidth={1.75} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="eg-eyebrow">Skip</span>
              <ul className="eg-list">
                {SKIP.map((item, i) => (
                  <li className="eg-item is-skip" key={i}>
                    <X size={15} strokeWidth={1.75} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="eg-note">
            Audio is the one thing you can throw away freely &mdash; we
            don&rsquo;t use it.
          </p>
        </section>

        {/* The way back. Most readers arrive from the uploader and can close
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

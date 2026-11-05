import type { ReactNode } from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { PageFrame } from "@/components/perspective/page-frame";
import { FramePair, PhoneShot, Step } from "@/components/guide/guide-parts";
import {
  EXPORT_GUIDE_HREF,
  VIDEO_MAX_SIZE,
  VIDEO_MIN_FPS,
  VIDEO_MIN_RESOLUTION,
} from "@/lib/match-video";
import { pageMetadata } from "@/lib/metadata";
import "@/components/guide/guide.css";

export const metadata = pageMetadata({
  title: "Filming a match for Advantage — Advantage",
  description: `Where to put the camera and how to set it before you film: behind the back fence, raised, one camera that doesn't move, ${VIDEO_MIN_RESOLUTION} or better at ${VIDEO_MIN_FPS} or higher. Settings for iPhone, Android, GoPro, PlaySight and SwingVision.`,
  path: "/recording-guide",
  ownCard: true,
});

/* Before the match. Whoever is here is about to film and wants the camera
   right the first time, so the page runs in the order they set up: where the
   camera goes, what the frame has to show, the camera's own settings, then
   what to do while it records. Getting the file off the device afterwards is
   the export guide's job, and the page ends on the door to it.

   Placement leads because it is the one requirement the dashboard uploader
   can't check: it reads resolution, frame rate, size and format off the file,
   but nothing can see where the camera stood. The two frames are the
   uploader's own (see guide/court-frame.tsx), so the guide and the uploader
   show the same picture.

   The iPhone screenshots are iOS 26's own Settings › Camera screens, captured
   from the simulator with the settings this guide recommends. Formats stays on
   High Efficiency on purpose: Most Compatible (H.264) doubles the file, about
   130 MB a minute at 1080p30 against 60, so a full match goes over the size
   limit. The uploader converts HEVC in the browser before it uploads; HDR is
   the setting that hurts, because its colour doesn't survive that
   conversion. */

const SECTIONS = [
  { id: "placement", label: "Where to put the camera" },
  { id: "frame", label: "What the frame shows" },
  { id: "settings", label: "Camera settings" },
  { id: "during", label: "During the match" },
  { id: "after", label: "After the match" },
];

const CAMERAS = [
  { id: "iphone", label: "iPhone" },
  { id: "android", label: "Android" },
  { id: "gopro", label: "GoPro" },
  { id: "playsight", label: "PlaySight and court cameras" },
  { id: "swingvision", label: "SwingVision" },
];

const KEEP: ReactNode[] = [
  <>Every court line, both sidelines included</>,
  <>The far service line, clear of the net</>,
  <>The space behind the near baseline, where the player serves and returns</>,
];

const SKIP: ReactNode[] = [
  <>Zooming or panning during a point</>,
  <>A side view, or a second camera cut in</>,
  <>Doubles &mdash; singles only for now</>,
];

export default function Page() {
  return (
    <PageFrame>
      <div className="wrap eg-page">
        <section className="eg-head">
          <span className="eg-eyebrow">Recording guide</span>
          <h1>Filming a match Advantage can read.</h1>
          <p className="eg-lede">
            One camera behind the back fence, raised, held still, recording the
            whole match. Set it up before the first serve and the file is ready
            to upload when you walk off court.
          </p>
        </section>

        <nav className="eg-anchors" aria-label="On this page">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`}>
              {s.label}
            </a>
          ))}
        </nav>

        <section className="eg-sec" id="placement">
          <h2>Put the camera behind the back fence</h2>
          <p className="eg-prose">
            The court mapping reads the lines, so it needs the court from one
            end, high enough to see over the net. Raise the camera to head
            height or above, centre it on the court, and fix it there.
          </p>
          <FramePair />
          <div className="eg-rules">
            <div className="eg-rule">
              <h4>Behind the back fence</h4>
              <p>
                From one end of the court, never the side. Most PlaySight
                courts already film from there.
              </p>
            </div>
            <div className="eg-rule">
              <h4>Raised and centred</h4>
              <p>
                Head height or above, in line with the centre mark, so both
                sidelines are in frame.
              </p>
            </div>
            <div className="eg-rule">
              <h4>Fixed, never held</h4>
              <p>
                A tripod, or a phone clamped to the fence. Following the play
                breaks the analysis.
              </p>
            </div>
          </div>
        </section>

        <section className="eg-sec" id="frame">
          <h2>What the frame needs to show</h2>
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
            Audio isn&rsquo;t used, so wind and court noise don&rsquo;t matter.
          </p>
        </section>

        <section className="eg-sec" id="settings">
          <h2>Check your settings before you film</h2>
          <p className="eg-prose">
            Find your camera below. Whatever you film on, you&rsquo;re after{" "}
            {VIDEO_MIN_RESOLUTION} or better at {VIDEO_MIN_FPS} or higher.
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
              ready.
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
          </div>

          <div className="eg-device" id="playsight">
            <h3>PlaySight and court cameras</h3>
            <p className="eg-prose">
              Pick the camera behind the baseline, not the side view; most
              PlaySight courts already film from there. There&rsquo;s nothing to
              set on court. Hudl works the same way.
            </p>
          </div>

          <div className="eg-device" id="swingvision">
            <h3>SwingVision</h3>
            <p className="eg-prose">
              SwingVision records on your iPhone, so the iPhone settings above
              apply. Mount it the same way, behind the back fence and raised.
              Importing its stats needs no video at all; the{" "}
              <Link className="eg-link" href={`${EXPORT_GUIDE_HREF}#swingvision`}>
                export guide
              </Link>{" "}
              covers it.
            </p>
          </div>
        </section>

        <section className="eg-sec" id="during">
          <h2>During the match</h2>
          <div className="eg-rules">
            <div className="eg-rule">
              <h4>Start before the first serve</h4>
              <p>
                Press record during the warm-up. You mark where the match starts
                when you upload, so a few extra minutes cost nothing; a missed
                first game can&rsquo;t be got back.
              </p>
            </div>
            <div className="eg-rule">
              <h4>Leave it running</h4>
              <p>
                Keep recording through changeovers and set breaks. The analysis
                reads the full sequence of points, and one file is one upload.
              </p>
            </div>
            <div className="eg-rule">
              <h4>Check space and battery</h4>
              <p>
                At {VIDEO_MIN_RESOLUTION} and 30 fps an iPhone uses about 60 MB a
                minute, so two hours needs around 7 GB free. A power bank on the
                fence covers a long match.
              </p>
            </div>
          </div>
        </section>

        <section className="eg-sec" id="after">
          <h2>After the match</h2>
          <p className="eg-prose">
            Stop recording after the last point. The file is ready as it is:
            don&rsquo;t edit or compress it, and don&rsquo;t send it to yourself
            in a messaging app, which shrinks it.
          </p>
          <div className="eg-next">
            <div>
              <h3>Next: get the file into Advantage</h3>
              <p>
                The export guide covers getting the original off the device, the
                size limit and what the uploader does for you.
              </p>
            </div>
            <Link className="eg-btn" href={EXPORT_GUIDE_HREF}>
              Open the export guide
            </Link>
          </div>
        </section>
      </div>
    </PageFrame>
  );
}

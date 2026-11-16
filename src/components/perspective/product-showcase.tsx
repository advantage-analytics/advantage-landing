"use client";

import {
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { ArrowRight, ChartScatter, Table2, UsersRound } from "lucide-react";
import { ProofHead } from "./band-parts";
import { TourPlayer, type TourCut } from "./product-tour";
import { RosterTour } from "./roster-tour";
import { useQueryString } from "@/lib/use-query-string";

/* The product, once: three screens of the dashboard under one head, one at a
   time. Statistics is the tour video; Visualizations is a match's court maps;
   Roster is the team page. It takes the place of the separate tour and team
   bands, and answers both of the nav's anchors (#tour and #team).

   The tabs carry the dashboard's own names and glyphs for these screens. Every
   screen is the same 16:10 frame with a row of captions and one line of note
   under it, and all three panels sit in one grid cell, so the band is the
   same height on every tab and nothing below it moves on a switch. */

const VIEWS = {
  match: {
    label: "Statistics",
    icon: Table2,
    title: "Every number",
    tail: "opens the point.",
    aside:
      "Pick any number and the film jumps to that point, every shot and where it landed.",
  },
  viz: {
    label: "Visualizations",
    icon: ChartScatter,
    title: "See where",
    tail: "every ball landed.",
    aside:
      "Court maps of your serves, returns and rally shots, marked by whether you won the point.",
  },
  team: {
    label: "Roster",
    icon: UsersRound,
    title: "Every player,",
    tail: "one roster.",
    aside:
      "Records, form and each player’s last match, in the order they play.",
  },
} as const;

type View = keyof typeof VIEWS;
const ORDER: readonly View[] = ["match", "viz", "team"];

/* How the three screens are chosen, while the design is being decided:
   "pill" is the segmented control; "frame" puts the tabs on the top edge of
   the screen, like the tabs of a window; "words" makes the three names the
   band's headline, the chosen one in ink; "line" is plain words on a rule
   with the chosen one underlined. ?sw= in the address overrides it, for
   comparing them. Keep one and delete the rest. */
type Switcher = "pill" | "frame" | "words" | "line";
const SWITCHER: Switcher = "frame";
const isSwitcher = (v: string | null): v is Switcher =>
  v === "pill" || v === "frame" || v === "words" || v === "line";
const TABS_CLASS: Record<Switcher, string> = {
  pill: "ps-tabs",
  frame: "ps-frame",
  words: "ps-words",
  line: "ps-line",
};

// Under the Visualizations and Roster screens: five numbered lines, in the
// same form and voice as the five steps under the tour video.
const VIZ_STEPS: readonly string[] = [
  "See where every serve landed.",
  "See where your returns went.",
  "See where you stood to return.",
  "See every shot of the rally.",
  "Switch to your opponent.",
];

/* The Visualizations video: a screen recording of Rudy Quan vs Nikita
   Volonski at 2880x1800, made as docs/visualizations-video.md describes. The tab plays it like the
   Statistics tour, its five lines lighting up at these times. */
const VIZ_CUT: TourCut = {
  base: "/assets/marketing/product-viz-v1",
  steps: [
    { at: 0, line: VIZ_STEPS[0] },
    { at: 3.0, line: VIZ_STEPS[1] },
    { at: 6.0, line: VIZ_STEPS[2] },
    { at: 9.0, line: VIZ_STEPS[3] },
    { at: 16.4, line: VIZ_STEPS[4] },
  ],
  label:
    "Product tour: a match's court maps, from serves to returns to the rally, one map opened and filtered by depth, then switched to the opponent",
  stepsLabel: "What the court maps show",
};

const ROSTER_STEPS: readonly string[] = [
  "Set your lineup in order.",
  "Check every player’s record.",
  "Read their form at a glance.",
  "See who they played last.",
  "Know when a match is ready.",
];

function Panel({ id, view, children }: { id: View; view: View; children: ReactNode }) {
  const current = id === view;
  return (
    <div
      className="ps-panel"
      role="tabpanel"
      id={`ps-panel-${id}`}
      aria-labelledby={`ps-tab-${id}`}
      data-off={!current || undefined}
      inert={!current}
    >
      {children}
    </div>
  );
}

/* `centered` gives this band the AI connector's centred two-tone head; without
   it the band keeps the site's split head. */
export function ProductShowcase({ centered = false }: { centered?: boolean }) {
  const [view, setView] = useState<View>("match");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const asked = new URLSearchParams(useQueryString()).get("sw");
  const switcher = isSwitcher(asked) ? asked : SWITCHER;
  const v = VIEWS[view];
  const index = ORDER.indexOf(view);

  // Arrow keys move along the tabs and select as they go, Home and End jump
  // to the ends: the keyboard pattern for a tab list.
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    const next =
      e.key === "Home"
        ? 0
        : e.key === "End"
          ? ORDER.length - 1
          : step
            ? (index + step + ORDER.length) % ORDER.length
            : -1;
    if (next < 0) return;
    e.preventDefault();
    setView(ORDER[next]);
    tabs.current[next]?.focus();
  };

  const tablist = (
    <div
      // No reveal-on-scroll here: the page's observer adds its class by hand,
      // and a class React re-sets (when ?sw= picks another switcher) loses it.
      className={TABS_CLASS[switcher]}
      id="team"
      role="tablist"
      aria-label="Screens of the product"
      style={{ "--ps-i": index, "--ps-n": ORDER.length } as CSSProperties}
      onKeyDown={onKey}
    >
      {switcher === "pill" ? (
        <span className="ps-thumb" aria-hidden="true" />
      ) : null}
      {ORDER.map((k, i) => {
        const Icon = VIEWS[k].icon;
        const on = view === k;
        return (
          <button
            key={k}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`ps-tab-${k}`}
            aria-selected={on}
            aria-controls={`ps-panel-${k}`}
            tabIndex={on ? 0 : -1}
            className={on ? "is-on" : ""}
            onClick={() => setView(k)}
          >
            {switcher === "pill" || switcher === "frame" ? (
              <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
            ) : null}
            {VIEWS[k].label}
          </button>
        );
      })}
    </div>
  );

  return (
    <section
      className={`band proof-band${centered ? " heads-centered" : ""}`}
      id="tour"
      data-sw={switcher}
    >
      <div className="wrap">
        {switcher === "words" ? (
          // The three names are the headline; the sentence that was the
          // headline leads the line under them.
          <div className={`proof-head${asked ? "" : " reveal"}`}>
            <div className="sec-head">
              <span className="eyebrow">Product</span>
              {tablist}
            </div>
            <p className="band-aside">
              <strong>
                {v.title} {v.tail}
              </strong>{" "}
              {v.aside}
            </p>
          </div>
        ) : (
          <ProofHead
            eyebrow="Product"
            title={v.title}
            tail={v.tail}
            aside={v.aside}
          />
        )}

        <div className={`ps-layout is-${switcher}`}>
          {switcher === "words" ? null : tablist}

          <div className="ps-stack">
            <Panel id="match" view={view}>
              <TourPlayer active={view === "match"} />
              <p className="tour-note">
                <strong>Condensed film.</strong> Changeovers and the time
                between points are cut out, so you watch only the tennis.
              </p>
            </Panel>

            <Panel id="viz" view={view}>
              <TourPlayer cut={VIZ_CUT} active={view === "viz"} />
              <p className="tour-note">
                <strong>Every dot is a shot.</strong> Green for a point you won,
                red for one you lost, grey for a ball that went out.
              </p>
            </Panel>

            <Panel id="team" view={view}>
              {/* The roster board, played in code with invented players; its
                  five lines light up as it goes (roster-tour.tsx). */}
              <RosterTour steps={ROSTER_STEPS} active={view === "team"} />
              <p className="tour-note">
                <strong>For college programs.</strong> Every plan covers your
                full roster.{" "}
                <Link className="proof-link" href="/pricing">
                  See college plans
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </p>
            </Panel>
          </div>
        </div>
      </div>
    </section>
  );
}

// The answers the home page FAQ, /pricing and /tennis-analytics share, so a
// visitor who reads two of them never gets two versions. Plain text: each one
// is also quoted in the FAQPage structured data. Every figure is read from
// lib/plans and lib/match-video.

import { VIDEO_MIN_RESOLUTION } from "./match-video";
import {
  COLLEGE_PLANS,
  ENTRY_COACH_PLAN,
  EXTRA_HOUR_PRICE,
  FREE_MATCH_LINE,
  FREE_MATCH_OFFER,
  HOURS_PER_MATCH,
  PRIORITY_ADDON_PERCENT,
  RUSH_PRICE,
  VERIFIED,
  usd,
} from "./plans";

export type Qa = { q: string; a: string };

const coach = ENTRY_COACH_PLAN;
const starter = COLLEGE_PLANS[0];

export const PLAN_FAQ = {
  cost: {
    q: "What does it cost?",
    a: `${FREE_MATCH_OFFER ? `${FREE_MATCH_LINE} ` : ""}Plans for players and coaches start at ${usd(coach.monthly)} a month. College plans start at ${usd(starter.spring.price)} for the spring season.`,
  },
  verified: {
    q: `What does ${VERIFIED} mean?`,
    a: "Advantage Intelligence reads your match video first. On paid plans a reviewer then checks every point: who won it and how it ended. A match that has been checked carries the Verified mark.",
  },
  hours: {
    q: "What counts as an hour?",
    a: `An hour of match video analyzed. Plans are charged in hours. A singles match is about ${HOURS_PER_MATCH} hours of video, so the match counts beside each plan are an estimate.`,
  },
  video: {
    q: "What video works?",
    a: `Singles, ${VIDEO_MIN_RESOLUTION} or higher, with the camera behind the baseline and raised up if you can. A phone, a GoPro or court cameras like PlaySight all work.`,
  },
  condensed: {
    q: "What is condensed film?",
    a: "Your match with the changeovers and the time between points cut out, so you watch only the tennis.",
  },
  moreHours: {
    q: "What about unused and extra hours?",
    a: `You can buy extra hours at ${usd(EXTRA_HOUR_PRICE)} each at any time. We email you at 80% of your hours and when they run out. Monthly hours do not carry over to the next month.`,
  },
  speeds: {
    q: "What are Priority and Rush?",
    a: `Every match is Standard unless you choose otherwise. Priority moves your match up the line, and Rush moves it to the front. Rush is ${usd(RUSH_PRICE)} a match. Priority is included on Elite and a ${PRIORITY_ADDON_PERCENT}% add-on on Program.`,
  },
  doubles: { q: "Does doubles work?", a: "Not yet. Doubles is coming. Singles only for now." },
  switching: {
    q: "Can we switch plans?",
    a: "Yes. Email us and we move you up, or down at your next renewal.",
  },
  accounts: {
    q: "Do players need their own account?",
    a: "Yes. Each player signs in with their own account and joins the team. Everyone in the team workspace can see the team's film.",
  },
  ai: {
    q: "Can I use Advantage with my AI app?",
    a: "Yes. Connect Claude, ChatGPT or another AI app to your account and ask about your matches there.",
  },
  ready: {
    q: "How do I know when a match is ready?",
    a: "You get an email when it's ready.",
  },
} as const satisfies Record<string, Qa>;

// /pricing's questions, in the order a buyer asks them.
export const PRICING_QA: readonly Qa[] = [
  PLAN_FAQ.verified,
  PLAN_FAQ.hours,
  PLAN_FAQ.video,
  PLAN_FAQ.condensed,
  PLAN_FAQ.moreHours,
  PLAN_FAQ.speeds,
  PLAN_FAQ.doubles,
  PLAN_FAQ.switching,
  PLAN_FAQ.accounts,
];

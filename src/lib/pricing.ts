// Draft paid plans for January 2027, shown only on the /design/pricing
// preview. Nothing here is sold yet: the beta and the fall pilot stay free
// through PILOT_END_DATE (src/lib/pilot.ts). When the plans are final this
// file becomes the one source for the public pricing page, as pilot.ts is for
// /pilot.

export type Audience = "players" | "teams";
export type Billing = "monthly" | "yearly";

export type Plan = {
  id: string;
  name: string;
  forWho: string;
  monthly: number;
  // The yearly price for players and coaches; a 6-month season for programs.
  yearly: number;
  yearlyUnit: "yr" | "season";
  hours: string;
  hoursNote: string;
  features: readonly string[];
  cta: string;
  featured?: boolean;
};

export const PLANS: Record<Audience, readonly Plan[]> = {
  players: [
    {
      id: "free",
      name: "Free",
      forWho: "Try it on one of your matches.",
      monthly: 0,
      yearly: 0,
      yearlyUnit: "yr",
      hours: "1 match",
      hoursNote: "Once, up to 2 hours",
      features: [
        "Unlimited SwingVision imports",
        "Stats, court maps and AI match review",
        "One video match on us",
      ],
      cta: "Start free",
    },
    {
      id: "player",
      name: "Player",
      forWho: "For club and league players.",
      monthly: 29,
      yearly: 290,
      yearlyUnit: "yr",
      hours: "3 hours",
      hoursNote: "About 2 matches a month",
      features: [
        "Everything in Free",
        "3 hours of match video every month",
        "Top up any time with credits",
      ],
      cta: "Choose Player",
      featured: true,
    },
    {
      id: "player-pro",
      name: "Player Pro",
      forWho: "For juniors, recruits and tournament players.",
      monthly: 49,
      yearly: 490,
      yearlyUnit: "yr",
      hours: "5 hours",
      hoursNote: "About 4 matches a month",
      features: [
        "Everything in Player",
        "5 hours of match video every month",
        "Lowest cost per match for players",
      ],
      cta: "Choose Player Pro",
    },
  ],
  teams: [
    {
      id: "coach",
      name: "Coach",
      forWho: "For private coaches and academies.",
      monthly: 149,
      yearly: 1490,
      yearlyUnit: "yr",
      hours: "15 hours",
      hoursNote: "Shared across up to 10 players",
      features: [
        "One workspace for up to 10 players",
        "Hours shared across the group",
        "Each player sees their own matches",
      ],
      cta: "Choose Coach",
    },
    {
      id: "program-lite",
      name: "Program Lite",
      forWho: "For high schools and smaller college teams.",
      monthly: 299,
      yearly: 1500,
      yearlyUnit: "season",
      hours: "25 hours",
      hoursNote: "About 19 matches a month",
      features: [
        "The whole roster in one team workspace",
        "Team-wide stats and match reports",
        "Season pricing that fits your calendar",
      ],
      cta: "Choose Program Lite",
    },
    {
      id: "program",
      name: "Program",
      forWho: "For college programs.",
      monthly: 549,
      yearly: 2750,
      yearlyUnit: "season",
      hours: "50 hours",
      hoursNote: "About 38 matches a month",
      features: [
        "Everything in Program Lite",
        "Enough film for a full dual-match season",
        "15% off for fall pilot programs",
      ],
      cta: "Choose Program",
      featured: true,
    },
  ],
};

export const CREDIT_PACKS: readonly { hours: string; price: number; note: string }[] = [
  { hours: "1 hour", price: 14, note: "About one match" },
  { hours: "5 hours", price: 60, note: "$12 an hour" },
];

export const PILOT_DISCOUNT = "15% off your first paid season";

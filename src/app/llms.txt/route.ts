import { CONTACT_EMAIL } from "@/lib/links";
import { absoluteUrl } from "@/lib/site";
import {
  COACH_PLANS,
  COLLEGE_PLANS,
  EXTRA_HOUR_PRICE,
  FREE_MATCH_OFFER,
  HOURS_PER_MATCH,
  VERIFIED,
  usd,
} from "@/lib/plans";

/* /llms.txt — a plain-text brief for AI assistants and answer engines
   (llmstxt.org): what Advantage is, in the site's own facts, and where to
   read more. Built from the same constants the pages quote, so it cannot
   drift from them. Static: rebuilt on deploy. */
export const dynamic = "force-static";

export function GET() {
  const coach = COACH_PLANS.filter((p) => p.id !== "free")
    .map(
      (p) =>
        `- ${p.name}: ${usd(p.monthly)} a month or ${usd(p.yearly)} a year, ${p.hours} hours of video a month (about ${p.matches} singles matches). Every match is ${VERIFIED}.`,
    )
    .join("\n");
  const college = COLLEGE_PLANS.map(
    (p) =>
      `- ${p.name}: ${usd(p.spring.price)} for the spring season (${p.spring.hours} hours, about ${p.spring.matches} matches) or ${usd(p.fullYear.price)} for the full year (${p.fullYear.hours} hours, about ${p.fullYear.matches} matches). Every match is ${VERIFIED}.`,
  ).join("\n");
  const body = `# Advantage

> Advantage is a tennis analytics app. A player or coach films a singles match from behind the baseline on a phone or any camera, uploads the video, and gets a breakdown by email when it is ready: where points were won, where they were lost, and what to work on, each linked to the moment on video.

## What it measures

- First serve percentage, and points won behind the first and second serve
- Break points saved and return games won
- How points ended: winners and aces against unforced errors and double faults
- Rally length, and trends across every match uploaded
- A short written read on what decided the match (Advantage Intelligence)

## Who it is for

- Players who compete, from league players to college athletes
- Private coaches
- College programs, with every player on the roster

## Pricing

Plans are charged in hours of match video. A singles match is about ${HOURS_PER_MATCH} hours of video, so match counts are estimates. Extra hours are ${usd(EXTRA_HOUR_PRICE)} each.
${FREE_MATCH_OFFER ? "\nYour first match is free: Advantage Intelligence stats and film for one match, not verified.\n" : ""}
Players and coaches:
${coach}

College programs:
${college}

${VERIFIED} means that after Advantage Intelligence reads the video, a reviewer checks every point: who won it and how it ended.

Advantage was built by former collegiate tennis players in Los Angeles, California.

## Pages

- [Tennis analytics, explained](${absoluteUrl("/tennis-analytics")}): what tennis analytics is, which numbers matter, and how to get them from match video
- [Home](${absoluteUrl("/")}): how Advantage works and what you see after an upload
- [Pricing](${absoluteUrl("/pricing")}): every plan, for players, coaches and college programs
- [Recording guide](${absoluteUrl("/recording-guide")}): where to put the camera and which settings to use when filming a match
- [Export guide](${absoluteUrl("/export-guide")}): how to get the match video off a phone, GoPro or court camera
- [Use Advantage in your AI app](${absoluteUrl("/mcp")}): connect Claude, ChatGPT or any MCP app to an Advantage account
- [About](${absoluteUrl("/about")})

## Contact

${CONTACT_EMAIL}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

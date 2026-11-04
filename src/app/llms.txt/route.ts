import { CONTACT_EMAIL } from "@/lib/links";
import { absoluteUrl } from "@/lib/site";
import {
  BETA_END_SHORT,
  INDIVIDUAL_BETA_SHORT,
  PILOT_HOURS,
  PILOT_HOURS_SCOPE,
  PILOT_PAID_PLANS_BEGIN,
} from "@/lib/pilot";

/* /llms.txt — a plain-text brief for AI assistants and answer engines
   (llmstxt.org): what Advantage is, in the site's own facts, and where to
   read more. Built from the same constants the pages quote, so it cannot
   drift from them. Static: rebuilt on deploy. */
export const dynamic = "force-static";

export function GET() {
  const beta = BETA_END_SHORT.replace(/ /g, " ");
  const body = `# Advantage

> Advantage is a tennis analytics app. A player or coach films a singles match from behind the baseline on a phone or any camera, uploads the video, and within 24 hours gets a breakdown: where points were won, where they were lost, and what to work on, each linked to the moment on video.

## What it measures

- First serve percentage, and points won behind the first and second serve
- Break points saved and return games won
- How points ended: winners and aces against unforced errors and double faults
- Rally length, and trends across every match uploaded
- A short written read on what decided the match (Advantage Intelligence)

## Who it is for

- Players who compete, from league players to college athletes. ${INDIVIDUAL_BETA_SHORT}
- Coaches and college programs. The fall pilot gives a program ${PILOT_HOURS} of film ${PILOT_HOURS_SCOPE}, free through ${beta}. Paid plans begin in ${PILOT_PAID_PLANS_BEGIN}.

Advantage was built by former collegiate tennis players in Los Angeles, California.

## Pages

- [Tennis analytics, explained](${absoluteUrl("/tennis-analytics")}): what tennis analytics is, which numbers matter, and how to get them from match video
- [Home](${absoluteUrl("/")}): how Advantage works and what you see after an upload
- [Pilot program](${absoluteUrl("/pilot")}): the offer for college programs
- [Export guide](${absoluteUrl("/export-guide")}): how to film a match and get the video off a phone, GoPro or court camera
- [Use Advantage in your AI app](${absoluteUrl("/mcp")}): connect Claude, ChatGPT or any MCP app to an Advantage account
- [About](${absoluteUrl("/about")})

## Contact

${CONTACT_EMAIL}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

import { EXPORT_GUIDE_HREF, RECORDING_GUIDE_HREF } from "@/lib/match-video";

/* Every guide, in reading order: the two steps a first match needs, then the
   two references. The /guides index, each guide's "More guides" list and the
   breadcrumb all read this, so a renamed or added guide changes in one place.
   FIRST_MATCH_STEPS says how many from the top are the first match's steps. */

export const GUIDES_HREF = "/guides";

export type GuideId = "recording" | "export" | "mcp" | "analytics";

export const GUIDES: readonly {
  id: GuideId;
  href: string;
  // The guide's short name: the breadcrumb, the "More guides" label.
  name: string;
  title: string;
  // On /guides, each guide is named by what the visitor wants to do, with
  // when they'd use it.
  task: string;
  when: string;
}[] = [
  {
    id: "recording",
    href: RECORDING_GUIDE_HREF,
    name: "Recording guide",
    title: "Filming a match Advantage can read.",
    task: "Film your match",
    when: "Where to put the camera and the settings for your phone or camera.",
  },
  {
    id: "export",
    href: EXPORT_GUIDE_HREF,
    name: "Export guide",
    title: "Getting match video into Advantage.",
    task: "Upload it",
    when: "Get the file off your device and into Advantage.",
  },
  {
    id: "mcp",
    href: "/mcp",
    name: "AI connector",
    title: "Connect Advantage to your AI app.",
    task: "Ask an AI app about your matches",
    when: "Connect Claude, ChatGPT, Cursor or any MCP app to your account.",
  },
  {
    id: "analytics",
    href: "/tennis-analytics",
    name: "Tennis analytics",
    title: "Tennis analytics, explained.",
    task: "Understand your numbers",
    when: "What first serve percentage and how points ended tell you.",
  },
];

export const FIRST_MATCH_STEPS = 2;

export const guide = (id: GuideId) => GUIDES.find((g) => g.id === id)!;

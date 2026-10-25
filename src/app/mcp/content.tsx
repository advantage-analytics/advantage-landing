import type { ReactNode } from "react";
import { links } from "@/lib/links";

/* The facts the /mcp guide is built from: every app's steps, the tools,
   privacy and troubleshooting. Kept apart from the layout so a step changes
   in one place. App ids double as the URL hash (/mcp#cursor) that opens the
   guide on that app; the dashboard's Settings › Connections links to them. */

export const url = links.mcp;

export type Snippet = { label: string; code: string; json?: boolean };
export type Step = { text: ReactNode; code?: Snippet };
export type App = {
  id: string;
  label: string;
  title: string;
  kind: string;
  sub: string;
  steps: Step[];
  note?: ReactNode;
};

const remoteJson = `{
  "mcpServers": {
    "advantage": {
      "url": "${url}"
    }
  }
}`;

export const apps: App[] = [
  {
    id: "claude",
    label: "Claude",
    title: "claude.ai and Claude Desktop",
    kind: "In the app",
    sub: "The two share connectors, so adding it in one adds it to both.",
    steps: [
      {
        text: (
          <>
            Open <strong>Settings</strong> → <strong>Connectors</strong> →{" "}
            <strong>Add custom connector</strong>.
          </>
        ),
      },
      {
        text: (
          <>
            Name it <strong>Advantage</strong> and paste the server URL.
          </>
        ),
        code: { label: "Remote MCP server URL", code: url },
      },
      {
        text: (
          <>
            Press <strong>Connect</strong>, sign in to Advantage, and choose{" "}
            <strong>Allow</strong>. The tools appear in the chat’s tool menu.
          </>
        ),
      },
    ],
    note: "On a Team or Enterprise plan, an admin adds the connector once for everyone; each person still signs in with their own Advantage account.",
  },
  {
    id: "claude-code",
    label: "Claude Code",
    title: "Claude Code",
    kind: "Terminal",
    sub: "Two commands, then a new session.",
    steps: [
      {
        text: "Add the server.",
        code: {
          label: "Terminal",
          code: `claude mcp add --transport http advantage ${url}`,
        },
      },
      {
        text: (
          <>
            Sign in. A browser tab opens; choose <strong>Allow</strong>.
          </>
        ),
        code: { label: "Terminal", code: "claude mcp login advantage" },
      },
      {
        text: "Start a new Claude Code session. One that was already running does not pick up the connector.",
      },
    ],
    note: (
      <>
        Add <code>--scope user</code> to the first command to use it in every
        project, not only the current folder.
      </>
    ),
  },
  {
    id: "chatgpt",
    label: "ChatGPT",
    title: "ChatGPT",
    kind: "In the app",
    sub: "Custom connectors need developer mode on plans that offer it.",
    steps: [
      {
        text: (
          <>
            Open <strong>Settings</strong> →{" "}
            <strong>Apps &amp; Connectors</strong> → <strong>Create</strong>.
          </>
        ),
      },
      {
        text: (
          <>
            Name it <strong>Advantage</strong>, paste the server URL, and set
            authentication to <strong>OAuth</strong>.
          </>
        ),
        code: { label: "MCP server URL", code: url },
      },
      {
        text: (
          <>
            Press <strong>Create</strong>, then <strong>Connect</strong>. Sign
            in to Advantage and choose <strong>Allow</strong>.
          </>
        ),
      },
    ],
  },
  {
    id: "cursor",
    label: "Cursor",
    title: "Cursor",
    kind: "Config file",
    sub: ".cursor/mcp.json for one project, ~/.cursor/mcp.json for all of them.",
    steps: [
      {
        text: "Add Advantage to your MCP config.",
        code: { label: ".cursor/mcp.json", code: remoteJson, json: true },
      },
      {
        text: (
          <>
            Open <strong>Cursor Settings</strong> → <strong>MCP</strong>, find{" "}
            <strong>advantage</strong>, and press <strong>Login</strong>.
          </>
        ),
      },
    ],
  },
  {
    id: "vscode",
    label: "VS Code",
    title: "VS Code",
    kind: "Config file",
    sub: "Copilot Chat, in agent mode.",
    steps: [
      {
        text: "Add Advantage to your workspace’s MCP config.",
        code: {
          label: ".vscode/mcp.json",
          json: true,
          code: `{
  "servers": {
    "advantage": {
      "type": "http",
      "url": "${url}"
    }
  }
}`,
        },
      },
      {
        text: (
          <>
            Press <strong>Start</strong> above the server entry and sign in when
            asked.
          </>
        ),
      },
    ],
  },
  {
    id: "other",
    label: "Other apps",
    title: "Any other MCP app",
    kind: "Config file",
    sub: "Windsurf, Codex, Gemini CLI, Zed and others.",
    steps: [
      {
        text: "If the app supports remote servers with OAuth, give it the URL.",
        code: { label: "mcp.json", code: remoteJson, json: true },
      },
      {
        text: (
          <>
            If it only runs local servers, bridge it with{" "}
            <code>mcp-remote</code> (needs Node.js).
          </>
        ),
        code: {
          label: "mcp.json",
          json: true,
          code: `{
  "mcpServers": {
    "advantage": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "${url}"]
    }
  }
}`,
        },
      },
    ],
  },
];

export type Tool = { name: string; desc: string; access: string; write?: true };

/* The dashboard's src/lib/services/mcp/server.ts, in its order. `ask` is a
   write: it saves the exchange to the player's Ask history. */
export const tools: Tool[] = [
  {
    name: "list_workspaces",
    desc: "Your personal workspace and every team you belong to.",
    access: "Read",
  },
  {
    name: "list_matches",
    desc: "The matches in scope, newest first.",
    access: "Read",
  },
  {
    name: "get_match",
    desc: "One match: its statistics, the AI summary, key moments and links to open or share it.",
    access: "Read",
  },
  {
    name: "opponent_scouting",
    desc: "Your record against an opponent, with recent meetings and trends.",
    access: "Read",
  },
  {
    name: "describe_views",
    desc: "What each statistic means and what a query can read.",
    access: "Read",
  },
  {
    name: "run_query",
    desc: "A read-only query over your statistics.",
    access: "Read",
  },
  {
    name: "ask",
    desc: "Advantage answers a whole question. Saved to your Ask history.",
    access: "Uses a question",
    write: true,
  },
  {
    name: "update_match",
    desc: "Fixes the opponent, tournament, round, date, match type or surface on a match you created. Never the score.",
    access: "Writes",
    write: true,
  },
  {
    name: "prepare_video_upload",
    desc: "Saves an upload draft and gives you the link to pick the video and finish.",
    access: "Writes",
    write: true,
  },
];

export const prompts = [
  {
    text: "How has my first-serve percentage moved over my last five matches?",
    note: "Reads your statistics",
  },
  {
    text: "Summarise my last match and the one thing I should work on.",
    note: "Reads one match report",
  },
  {
    text: "What’s my record against my next opponent, and how did those matches go?",
    note: "Opponent scouting",
  },
  {
    text: "I played a match yesterday at the Fall Open. Start a video upload for it.",
    note: "Saves a draft you finish in Advantage",
  },
];

export const privacy: { lead: string; body: ReactNode }[] = [
  {
    lead: "It works as you.",
    body: "It sees your matches and those of teams you belong to, nothing another account could not already see.",
  },
  {
    lead: "It cannot delete anything.",
    body: "It can fix a match’s details on a match you created, never the score, the format or who played, and save an upload draft you finish yourself.",
  },
  {
    lead: "Whole questions count.",
    body: "The ask tool uses one of your monthly Ask questions and appears in your Ask history. The other tools do not.",
  },
  {
    lead: "You never share a password.",
    body: "You sign in on Advantage’s own page, and the app gets access you can end at any time.",
  },
];

export const faqs = [
  {
    q: "The tools don’t show up after connecting",
    a: "Start a new chat or session; one that was already open keeps its old tool list. In Claude, check Advantage is switched on in the chat’s tool menu.",
  },
  {
    q: "The sign-in tab keeps reopening",
    a: "Sign in to Advantage in the same browser first, then press Connect again. A pop-up blocker can close the tab before Allow comes back.",
  },
  {
    q: "It can’t find my team",
    a: "Name the team in your question. You need to be on the team in Advantage; until you join, it sees only your own matches.",
  },
  {
    q: "“Ask limit reached”",
    a: "You have used this month’s Ask questions. Reading matches and statistics still works; whole questions come back on the 1st.",
  },
];

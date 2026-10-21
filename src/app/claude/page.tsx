import {
  CampaignFrame,
  CampaignHead,
} from "@/components/campaign/campaign-frame";
import { CONTACT_EMAIL, links } from "@/lib/links";
import "../export-guide/export-guide.css";

export const metadata = {
  title: "Use Advantage in Claude — Advantage",
  description:
    "Connect Claude to your Advantage account and ask about your tennis matches in claude.ai, Claude Desktop or Claude Code.",
};

/* The public instructions for the Ask connector (the dashboard's /api/mcp,
   docs/ask-mcp-connector.md there). Claude's Connectors Directory asks for a
   documentation page anyone can open; the dashboard's own copy, Settings ›
   Connections, sits behind sign-in. Same reference-page shell as the export
   guide. Claude is named in text only: Anthropic's trademark guidelines allow
   its logo only with prior approval. */

export default function Page() {
  return (
    <CampaignFrame className="eg-page">
      <CampaignHead
        eyebrow="Connect Claude"
        title="Use Advantage in Claude."
        lede="Connect your own Claude to your Advantage account and ask about your matches in claude.ai, Claude Desktop or Claude Code. It works as you: it reads what your account can see, and the only things it can change are a match's details and a new upload draft."
      />

      <article className="eg-doc">
        <section className="eg-sec">
          <h2>Connect in claude.ai or Claude Desktop</h2>
          <ul className="eg-routes">
            <li>
              In Claude, open <strong>Settings</strong> &rarr;{" "}
              <strong>Connectors</strong> &rarr;{" "}
              <strong>Add custom connector</strong>.
            </li>
            <li>
              Name it <strong>Advantage</strong> and paste this address:{" "}
              <code>{links.mcp}</code>
            </li>
            <li>
              Press <strong>Connect</strong>, sign in to Advantage, and choose{" "}
              <strong>Allow</strong>.
            </li>
          </ul>
          <p className="campaign-note">
            claude.ai and Claude Desktop share connectors, so connecting in one
            adds it to both.
          </p>
        </section>

        <section className="eg-sec">
          <h2>Connect in Claude Code</h2>
          <p>
            In a terminal, run{" "}
            <code>claude mcp add --transport http advantage {links.mcp}</code>,
            then <code>claude mcp login advantage</code> to sign in. Start a new
            Claude Code session afterwards; one that was already running does
            not pick up the connector.
          </p>
        </section>

        <section className="eg-sec">
          <h2>What Claude can do</h2>
          <ul className="eg-routes">
            <li>
              <strong>Read your matches</strong> &mdash; yours and those of
              teams you belong to: a full match report, your record against an
              opponent, and your statistics (serve, return, rallies and
              patterns) through read-only queries.
            </li>
            <li>
              <strong>Ask Advantage a question.</strong> Each one uses one of
              your monthly Ask questions and appears in your Ask history, the
              same as asking in the dashboard.
            </li>
            <li>
              <strong>Fix a match&rsquo;s details</strong> on a match you
              created &mdash; opponent, tournament, round, date, match type,
              surface. Never the score, the format or who played; those stay
              on the match page.
            </li>
            <li>
              <strong>Start a video upload.</strong> Claude fills in a draft
              from what you tell it and gives you a link. You pick the file and
              answer the setup questions in Advantage; nothing is created or
              charged until you do.
            </li>
          </ul>
          <p>
            Claude sees only what your account can already see, and it cannot
            delete a match or its statistics.
          </p>
        </section>

        <section className="eg-sec">
          <h2>ChatGPT and Cursor</h2>
          <p>
            The same address works in other AI apps. In{" "}
            <strong>ChatGPT</strong>, open <strong>Settings</strong> &rarr;{" "}
            <strong>Apps &amp; Connectors</strong> &rarr;{" "}
            <strong>Create</strong>, paste <code>{links.mcp}</code> with OAuth
            sign-in, then <strong>Connect</strong>. In{" "}
            <strong>Cursor</strong>, add it as an MCP server named{" "}
            <code>advantage</code> and sign in from Cursor&rsquo;s MCP
            settings.
          </p>
        </section>

        <section className="eg-sec">
          <h2>Disconnect</h2>
          <p>
            Open <a href={links.connections}>Settings &rsaquo; Connections</a>{" "}
            in Advantage and press <strong>Disconnect</strong>, or remove the
            connector in Claude. Either one ends its access.
          </p>
          <p>
            Questions? Email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        </section>
      </article>
    </CampaignFrame>
  );
}

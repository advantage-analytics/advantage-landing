import { Plus } from "lucide-react";
import { DocsFrame } from "@/components/docs/docs-frame";
import { CONTACT_EMAIL, links } from "@/lib/links";
import { apps, faqs, privacy, prompts, tools, url } from "./content";
import { CopyButton, SetupPicker } from "./mcp-client";
import "./mcp-guide.css";

export const metadata = {
  title: "Use Advantage in your AI app — Advantage",
  description:
    "Connect Claude, ChatGPT, Cursor or any MCP app to your Advantage account and ask about your tennis matches in plain language.",
};

/* The public instructions for the Ask connector (the dashboard's /api/mcp,
   docs/ask-mcp-connector.md there): the one place each app's setup is
   written. The dashboard's Settings › Connections keeps the address and
   links here by app (/mcp#<app id>); its help centre topic links here too.
   /claude redirects to this page (next.config.ts), because Claude's
   Connectors Directory listing names it as the documentation URL.

   Laid out the way developer docs read: the setup is one framed workspace
   (apps on the left, steps, and a dark code pane for the apps that take a
   command or a config file). Apps are named in text only: Anthropic's
   trademark guidelines allow its logo only with prior approval, and the
   others are treated the same. */

const sections = [
  ["setup", "Setup"],
  ["examples", "Try asking"],
  ["tools", "Tools"],
  ["privacy", "Sign-in and privacy"],
  ["troubleshooting", "Troubleshooting"],
  ["disconnect", "Disconnect"],
];

export default function Page() {
  const writes = tools.filter((t) => t.write).length;
  return (
    <DocsFrame className="mcp">
      <section className="mcp-head">
        <h1>Connect Advantage to your AI app</h1>
        <p className="mcp-lede">
          Ask Claude, ChatGPT, Cursor or any app that supports MCP about your
          matches. It reads what your account can see and changes only your Ask
          history, a match’s details and a new upload draft.
        </p>
        <div className="mcp-urlbar">
          <code>{url}</code>
          <CopyButton value={url} label="Copy server URL" />
        </div>
      </section>

      <nav className="mcp-anchors" aria-label="On this page">
        {sections.map(([id, label]) => (
          <a key={id} href={`#${id}`}>
            {label}
          </a>
        ))}
      </nav>

      <section className="mcp-sec" id="setup">
        <h2>Setup</h2>
        <p className="mcp-prose">
          Pick your app. The first time, a browser tab opens so you can sign in
          to Advantage and choose <strong>Allow</strong>.
        </p>
        <SetupPicker apps={apps} />
      </section>

      <section className="mcp-sec" id="examples">
        <h2>Try asking</h2>
        <ul className="mcp-prompts">
          {prompts.map((p) => (
            <li key={p.text}>
              <span>“{p.text}”</span>
              <span>{p.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mcp-sec" id="tools">
        <h2>Tools</h2>
        <p className="mcp-prose">
          {tools.length} tools, picked by your app. {writes} of them change
          something you can see in Advantage, and most apps ask before using
          one.
        </p>
        <dl className="mcp-tools">
          {tools.map((t) => (
            <div key={t.name} className="mcp-tool">
              <dt>{t.name}</dt>
              <dd>{t.desc}</dd>
              <dd className={`mcp-access${t.write ? " is-write" : ""}`}>
                {t.access}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mcp-sec" id="privacy">
        <h2>Sign-in and privacy</h2>
        <ul className="mcp-privacy">
          {privacy.map((p) => (
            <li key={p.lead}>
              <strong>{p.lead}</strong>
              <span>{p.body}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mcp-sec mcp-faq" id="troubleshooting">
        <h2>Troubleshooting</h2>
        <div>
          {faqs.map((f) => (
            <details key={f.q}>
              <summary>
                {f.q}
                <Plus size={16} strokeWidth={1.75} aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mcp-sec" id="disconnect">
        <h2>Disconnect</h2>
        <p className="mcp-prose">
          Open{" "}
          <a className="mcp-link" href={links.connections}>
            Settings › Connections
          </a>{" "}
          in Advantage and press <strong>Disconnect</strong> beside the app, or
          remove the connector in the app itself. Either one ends its access.
          Questions? Email{" "}
          <a className="mcp-link" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </section>
    </DocsFrame>
  );
}

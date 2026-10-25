"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Check, Copy } from "lucide-react";
import type { App } from "./content";

/* The guide's interactive pieces: copy buttons, code blocks and the setup
   picker. Everything else on /mcp stays a Server Component. Every app's panel
   is rendered and hidden with `hidden`, so all six apps' steps are in the HTML
   for search and for a reader with scripts off. */

export function CopyButton({
  value,
  label = "Copy",
  className = "mcp-copy",
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
        } catch {
          return;
        }
        setCopied(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), 1600);
      }}
    >
      {copied ? (
        <Check size={14} strokeWidth={2} aria-hidden="true" />
      ) : (
        <Copy size={14} strokeWidth={2} aria-hidden="true" />
      )}
      <span aria-live="polite">{copied ? "Copied" : label}</span>
    </button>
  );
}

/* JSON keys and strings, told apart; anything else is left as is. Enough for
   the config snippets here, not a general highlighter. */
function highlight(code: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /("(?:[^"\\]|\\.)*")(\s*:)?/g;
  let last = 0;
  for (const m of code.matchAll(re)) {
    const at = m.index ?? 0;
    if (at > last) out.push(code.slice(last, at));
    out.push(
      <span key={at} className={m[2] ? "tk-key" : "tk-str"}>
        {m[1]}
      </span>,
    );
    if (m[2]) out.push(m[2]);
    last = at + m[0].length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

export function CodeBlock({
  label,
  code,
  json = false,
}: {
  label: string;
  code: string;
  json?: boolean;
}) {
  return (
    <div className="mcp-code">
      <div className="mcp-code-head">
        <span className="mcp-code-label">{label}</span>
        <CopyButton value={code} />
      </div>
      <pre>
        <code>{json ? highlight(code) : code}</code>
      </pre>
    </div>
  );
}

/* Apps set up inside their own settings (claude.ai, ChatGPT) have nothing to
   paste but the URL, so their steps run full width with it inline. Apps that
   take a command or a config file get the dark code pane beside the steps. */
const needsCodePane = (app: App) => app.kind !== "In the app";

function Steps({ app, inlineCode }: { app: App; inlineCode: boolean }) {
  return (
    <ol className="mcp-steps">
      {app.steps.map((step, i) => (
        <li key={i} className="mcp-step">
          <span className="mcp-step-n" aria-hidden="true">
            {i + 1}
          </span>
          <div className="mcp-step-body">
            <p>{step.text}</p>
            {inlineCode && step.code ? (
              <CodeBlock
                label={step.code.label}
                code={step.code.code}
                json={step.code.json}
              />
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function SetupPicker({ apps }: { apps: App[] }) {
  const [active, setActive] = useState(apps[0].id);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const root = useRef<HTMLDivElement>(null);

  // /mcp#cursor opens on Cursor: Settings › Connections in the dashboard
  // links each app this way. The hash follows the picker after that, so a
  // copied link opens where the reader was.
  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.slice(1);
      if (!apps.some((a) => a.id === id)) return;
      setActive(id);
      root.current?.scrollIntoView({ block: "start" });
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [apps]);

  const pick = (id: string) => {
    setActive(id);
    window.history.replaceState(null, "", `#${id}`);
  };

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const step =
      event.key === "ArrowDown" || event.key === "ArrowRight"
        ? 1
        : event.key === "ArrowUp" || event.key === "ArrowLeft"
          ? -1
          : 0;
    if (!step) return;
    event.preventDefault();
    const i = (index + step + apps.length) % apps.length;
    pick(apps[i].id);
    refs.current[i]?.focus();
  };

  return (
    <div className="mcp-setup" ref={root}>
      <div
        className="mcp-apps"
        role="tablist"
        aria-label="App"
        aria-orientation="vertical"
      >
        {apps.map((app, i) => (
          <button
            key={app.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`mcp-tab-${app.id}`}
            aria-selected={app.id === active}
            aria-controls={`mcp-panel-${app.id}`}
            tabIndex={app.id === active ? 0 : -1}
            className="mcp-app"
            onClick={() => pick(app.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            <span className="mcp-app-name">{app.label}</span>
            <span className="mcp-app-kind">{app.kind}</span>
          </button>
        ))}
      </div>
      {apps.map((app) => {
        const pane = needsCodePane(app);
        return (
          <div
            key={app.id}
            role="tabpanel"
            id={`mcp-panel-${app.id}`}
            aria-labelledby={`mcp-tab-${app.id}`}
            hidden={app.id !== active}
            className={`mcp-panel${pane ? " has-pane" : ""}`}
          >
            <div className="mcp-steps-col">
              <h3>{app.title}</h3>
              <p className="mcp-sub">{app.sub}</p>
              <Steps app={app} inlineCode={!pane} />
              {app.note ? <p className="mcp-note">{app.note}</p> : null}
            </div>
            {pane ? (
              <div className="mcp-code-col">
                {app.steps.map((s, i) =>
                  s.code ? (
                    <div key={i} className="mcp-code-step">
                      <span className="mcp-code-step-n">Step {i + 1}</span>
                      <CodeBlock
                        label={s.code.label}
                        code={s.code.code}
                        json={s.code.json}
                      />
                    </div>
                  ) : null,
                )}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

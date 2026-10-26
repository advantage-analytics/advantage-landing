"use client";

import {
  useEffect,
  useLayoutEffect,
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
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
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
        // In-app browsers and insecure contexts block the clipboard API; say
        // so rather than leave a stale clipboard to be pasted.
        let next: "copied" | "failed" = "copied";
        try {
          await navigator.clipboard.writeText(value);
        } catch {
          next = "failed";
        }
        setState(next);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setState("idle"), 2400);
      }}
    >
      {state === "copied" ? (
        <Check size={14} strokeWidth={2} aria-hidden="true" />
      ) : (
        <Copy size={14} strokeWidth={2} aria-hidden="true" />
      )}
      <span aria-live="polite">
        {state === "copied"
          ? "Copied"
          : state === "failed"
            ? "Couldn’t copy, select it instead"
            : label}
      </span>
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
  // copied link opens where the reader was. A layout effect, so a deep link
  // switches before first paint instead of flashing Claude's steps.
  useLayoutEffect(() => {
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
        const pane = Boolean(app.codePane);
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

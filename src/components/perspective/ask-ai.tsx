"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

/* "Ask any AI to…" under a feature band: two or three things a visitor could
   type into their own AI app about what the band just showed. Every chip goes
   to the connector guide. Each label finishes the sentence the row starts. */
export function AskAi({ prompts, placement }: { prompts: readonly string[]; placement: string }) {
  return (
    <div className="ask-ai reveal">
      <span className="ask-ai-lead">Ask any AI to…</span>
      {prompts.map((p) => (
        <Link
          className="ask-ai-chip"
          href="/mcp"
          key={p}
          onClick={() => trackEvent("ai_connector_setup_clicked", { app: "prompt", placement })}
        >
          {p}
        </Link>
      ))}
    </div>
  );
}

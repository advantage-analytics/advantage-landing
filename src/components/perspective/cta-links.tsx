"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { trackCta } from "@/lib/analytics";
import { FREE_MATCH_OFFER, salesHref, signUpHref } from "@/lib/plans";

/* The site's two ways in, as links with click tracking. A client leaf so the
   bands that hold them (the final band, the pricing page) can stay server
   components. Styling is the caller's: pass the button class. */

type Props = {
  className?: string;
  placement: string;
  children?: ReactNode;
  icon?: number | false;
  onClick?: () => void;
};

// Sign-up in the dashboard. While the free first match is on offer the button
// says so; without it, the same button is a plain sign-up.
export function FreeMatchLink({ className, placement, children, icon = 16, onClick }: Props) {
  return (
    <a
      className={className}
      href={signUpHref("free")}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        trackCta("free_match", placement);
        onClick?.();
      }}
    >
      {children ?? (FREE_MATCH_OFFER ? "Upload a free match" : "Sign up")}
      {icon ? <ArrowUpRight size={icon} aria-hidden="true" /> : null}
    </a>
  );
}

// The sales form on /contact, where college programs ask for a quote.
export function TalkToUsLink({ className, placement, children = "Talk to us", onClick }: Omit<Props, "icon">) {
  return (
    <Link
      className={className}
      href={salesHref()}
      onClick={() => {
        trackCta("talk_to_us", placement);
        onClick?.();
      }}
    >
      {children}
    </Link>
  );
}

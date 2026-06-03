import Image from "next/image";
import { Container } from "@/components/primitives/container";
import { links } from "@/lib/links";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

const columns = [
  {
    title: "Product",
    items: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#showcase" },
      { label: "Pricing", href: "#pricing" },
      { label: "Sign in", href: links.signIn },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Beta insights", href: "#" },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-ink-border)] bg-[var(--color-surface-muted)]">
      <Container className="grid grid-cols-2 gap-10 py-14 sm:grid-cols-3 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="col-span-2 sm:col-span-3 lg:col-span-1">
          <Image
            src="/logos/logo.svg"
            alt="Advantage"
            width={132}
            height={24}
            className="h-[22px] w-auto"
          />
          <p className="mt-4 max-w-[34ch] text-sm leading-relaxed text-[var(--color-ink-500)]">
            Performance intelligence for competitive tennis. Built for the modern athlete.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href="#"
              aria-label="Advantage on X"
              className="inline-flex size-9 items-center justify-center rounded-md border border-[var(--color-ink-border)] bg-white text-[var(--color-ink-500)] transition-colors hover:text-[var(--color-ink-900)]"
            >
              <XIcon className="size-3.5" />
            </a>
            <a
              href="#"
              aria-label="Advantage on Instagram"
              className="inline-flex size-9 items-center justify-center rounded-md border border-[var(--color-ink-border)] bg-white text-[var(--color-ink-500)] transition-colors hover:text-[var(--color-ink-900)]"
            >
              <InstagramIcon className="size-4" />
            </a>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-ink-400)]">
              {col.title}
            </h3>
            <ul className="mt-4 space-y-3">
              {col.items.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-[var(--color-ink-700)] transition-colors hover:text-[var(--color-ink-900)]"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className="border-t border-[var(--color-ink-border)]">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-xs text-[var(--color-ink-400)] sm:flex-row">
          <p>© {new Date().getFullYear()} Advantage Analytics. Built for the modern athlete.</p>
          <p className="font-mono">Tennis intelligence, centralized.</p>
        </Container>
      </div>
    </footer>
  );
}

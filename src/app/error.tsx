"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="relative isolate mx-auto w-full max-w-5xl py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0 -z-20 texture-dots opacity-30" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,color-mix(in_oklab,var(--accent)_18%,transparent)_0,transparent_44%),radial-gradient(circle_at_78%_76%,color-mix(in_oklab,var(--primary)_16%,transparent)_0,transparent_50%)]" />

      <div className="glass-card relative overflow-hidden border border-foreground/20 p-6 md:p-10 lg:p-12">
        <span className="pointer-events-none absolute right-2 top-0 font-sans text-[7rem] font-black leading-none tracking-[-0.08em] text-foreground/6 sm:text-[9rem] md:text-[12rem]">
          ERR
        </span>

        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-theme-subtle">
              Runtime Exception
            </p>
            <h1 className="max-w-3xl text-balance font-sans text-5xl font-black uppercase leading-[0.86] tracking-tighter text-foreground sm:text-6xl md:text-7xl">
              This section
              <span className="ml-2 text-accent">failed.</span>
            </h1>
            <p className="max-w-[62ch] text-base text-theme-muted md:text-lg">
              A render error interrupted this route segment. Retry the segment
              now, or jump to a stable page.
            </p>
          </div>

          <div className="space-y-3 border-t border-foreground/15 pt-6 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <button
              type="button"
              onClick={reset}
              className="group inline-flex min-h-12 w-full items-center justify-between rounded-2xl border border-primary/45 bg-primary/12 px-4 py-3 transition-ui hover:-translate-y-0.5 hover:bg-primary/18 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">
                Retry Segment
              </span>
              <span className="text-primary transition-ui group-hover:translate-x-0.5">
                ↻
              </span>
            </button>
            <Link
              href="/"
              className="group inline-flex min-h-12 w-full items-center justify-between rounded-2xl border border-foreground/20 bg-background/70 px-4 py-3 transition-ui hover:-translate-y-0.5 hover:border-accent/50 hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-theme-subtle transition-ui group-hover:text-foreground">
                Return Home
              </span>
              <span className="text-accent transition-ui group-hover:translate-x-0.5">
                →
              </span>
            </Link>
            <Link
              href="/projects"
              className="group inline-flex min-h-12 w-full items-center justify-between rounded-2xl border border-foreground/20 bg-background/70 px-4 py-3 transition-ui hover:-translate-y-0.5 hover:border-primary/50 hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-theme-subtle transition-ui group-hover:text-foreground">
                Open Projects
              </span>
              <span className="text-primary transition-ui group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

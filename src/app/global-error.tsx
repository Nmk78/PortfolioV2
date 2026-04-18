"use client";

interface GlobalErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalErrorPage({ error, reset }: GlobalErrorPageProps) {
  return (
    <html lang="en">
      <body className="relative min-h-screen overflow-x-hidden bg-background px-4 py-12 text-foreground sm:px-6 md:px-8">
        <div className="pointer-events-none absolute inset-0 -z-20 texture-grid opacity-35" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_14%_20%,color-mix(in_oklab,var(--primary)_18%,transparent)_0,transparent_45%),radial-gradient(circle_at_84%_78%,color-mix(in_oklab,var(--accent)_18%,transparent)_0,transparent_50%)]" />

        <section className="mx-auto w-full max-w-4xl">
          <div className="glass-card relative overflow-hidden border border-foreground/20 p-6 md:p-10 lg:p-12">
            <span className="pointer-events-none absolute right-3 top-0 font-sans text-[7rem] font-black leading-none tracking-[-0.08em] text-foreground/6 sm:text-[9rem] md:text-[12rem]">
              500
            </span>

            <div className="relative z-10 space-y-8">
              <div className="space-y-4 border-b border-foreground/15 pb-8">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-theme-subtle">
                  Global Failure
                </p>
                <h1 className="max-w-3xl text-balance font-sans text-5xl font-black uppercase leading-[0.86] tracking-tighter text-foreground sm:text-6xl md:text-7xl">
                  App shell
                  <span className="ml-2 text-primary">interrupted.</span>
                </h1>
                <p className="max-w-[62ch] text-base text-theme-muted md:text-lg">
                  A critical runtime exception stopped the entire application.
                  Retry boot sequence or return to the root route.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={reset}
                  className="group inline-flex min-h-12 items-center justify-between rounded-2xl border border-primary/45 bg-primary/12 px-4 py-3 transition-ui hover:-translate-y-0.5 hover:bg-primary/18 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground">
                    Retry App
                  </span>
                  <span className="text-primary transition-ui group-hover:translate-x-0.5">
                    ↻
                  </span>
                </button>
                <a
                  href="/"
                  className="group inline-flex min-h-12 items-center justify-between rounded-2xl border border-foreground/20 bg-background/70 px-4 py-3 transition-ui hover:-translate-y-0.5 hover:border-primary/50 hover:bg-background/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-theme-subtle transition-ui group-hover:text-foreground">
                    Return Home
                  </span>
                  <span className="text-primary transition-ui group-hover:translate-x-0.5">
                    →
                  </span>
                </a>
              </div>

              {process.env.NODE_ENV !== "production" ? (
                <pre className="overflow-x-auto rounded-2xl border border-foreground/20 bg-background/80 p-4 font-mono text-xs leading-relaxed text-theme-subtle">
                  {error?.message || "Unknown global error"}
                </pre>
              ) : null}
            </div>
          </div>
        </section>
      </body>
    </html>
  );
}

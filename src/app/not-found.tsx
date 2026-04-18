import Link from "next/link";

const primaryActions = [
  { href: "/", label: "Back Home" },
  { href: "/projects", label: "View Projects" },
  { href: "/about", label: "Read About" },
];

export default function NotFound() {
  return (
    <section className="relative isolate mx-auto w-full max-w-8xl py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0 -z-20 texture-grid opacity-40" />
      {/* <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_14%,color-mix(in_oklab,var(--primary)_22%,transparent)_0,transparent_42%),radial-gradient(circle_at_88%_84%,color-mix(in_oklab,var(--accent)_22%,transparent)_0,transparent_48%)]" /> */}

      <div className="relative overflow-hidden p-6 md:p-10 lg:p-12">
        <span className="pointer-events-none absolute right-4 top-2 font-sans text-[8rem] font-black leading-none tracking-[-0.08em] text-foreground/6 sm:text-[10rem] md:text-[13rem]">
          404
        </span>

        <div className="relative z-10 space-y-8">
          <div className="space-y-4 border-b border-foreground/15 pb-8">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-theme-subtle">
              Lost Route
            </p>
            <h1 className="max-w-3xl text-balance font-sans text-5xl font-black uppercase leading-[0.86] tracking-tighter text-foreground sm:text-6xl md:text-7xl">
              The page is
              <span className="ml-2 text-primary">gone.</span>
            </h1>
            <p className="max-w-[64ch] text-base text-theme-muted md:text-lg">
              This URL is not available in the current portfolio structure.
              Choose a verified path below.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-[1.3fr_1fr_1fr]">
            {primaryActions.map((action, index) => (
              <Link
                key={action.href}
                href={action.href}
                className="group relative inline-flex min-h-14 items-center justify-between overflow-hidden px-4 py-3 shadow-[0_14px_34px_color-mix(in_oklab,var(--foreground)_11%,transparent)] transition-ui hover:-translate-y-0.5 hover:shadow-[0_22px_42px_color-mix(in_oklab,var(--primary)_26%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,color-mix(in_oklab,var(--foreground)_7%,transparent)_0,transparent_42%),repeating-linear-gradient(-45deg,transparent_0px,transparent_11px,color-mix(in_oklab,var(--foreground)_8%,transparent)_11px,color-mix(in_oklab,var(--foreground)_8%,transparent)_12px)] opacity-55 transition-ui group-hover:opacity-90" />
                <span className="relative z-10 flex items-center gap-3">
                  <span className="inline-flex h-7 min-w-7 items-center justify-center px-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-foreground/85 transition-ui group-hover:bg-background/95 group-hover:text-primary">
                    0{index + 1}
                  </span>
                  <span className="font-sans text-sm font-black uppercase tracking-[0.06em] text-foreground/90 transition-ui group-hover:text-foreground">
                    {action.label}
                  </span>
                </span>
                <span className="relative z-10 inline-flex h-8 w-8 items-center justify-center text-base text-primary transition-ui group-hover:translate-x-0.5">
                  ↗
                </span>
              </Link>
            ))}
          </div>

          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-theme-subtle">
            if this is unexpected, refresh and retry navigation
          </p>
        </div>
      </div>
    </section>
  );
}

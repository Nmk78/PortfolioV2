import type { timelineItems } from "@/content/portfolio-identity";

interface TimelineRow {
  showYear: boolean;
  year: string;
  item: (typeof timelineItems)[number];
  rowKey: string;
}

interface TimelineSectionProps {
  timelineRows: TimelineRow[];
}

export function TimelineSection({ timelineRows }: TimelineSectionProps) {
  return (
    <section className="scroll-shrink-section relative overflow-hidden rounded-3xl border-0 border-foreground/10 p-5 md:p-7 lg:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-100"
        style={{
          backgroundImage:
            "radial-gradient(circle at 16% 18%, rgba(255,255,255,0.06), transparent 44%), radial-gradient(circle at 82% 14%, rgba(59,130,246,0.08), transparent 34%), radial-gradient(circle at 68% 80%, rgba(255,255,255,0.035), transparent 40%), linear-gradient(to bottom, rgba(255,255,255,0.02), transparent 24%)",
        }}
      />

      <div className="mb-6 md:mb-8">
        <h2 className="font-display text-[clamp(1.3rem,calc(1.35vw+0.85rem),2.1rem)] font-medium tracking-tight text-foreground">
          Timeline
        </h2>
      </div>

      <div className="relative">
        <div
          aria-hidden
          className="timeline-spine-line pointer-events-none absolute top-1 bottom-1 left-[calc(3.5rem+1.25rem+6px)] w-px -translate-x-1/2 md:left-[calc(4.5rem+2rem+6px)]"
        />

        <div className="flex flex-col gap-6 md:gap-7">
          {timelineRows.map((row, i) => (
            <div
              key={row.rowKey}
              className="group timeline-row-reveal grid grid-cols-[3.5rem_12px_minmax(0,1fr)] items-start gap-x-5 md:grid-cols-[4.5rem_12px_minmax(0,1fr)] md:gap-x-8"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="min-h-px text-right">
                {row.showYear ? (
                  <p className="font-mono pt-2 text-[1.65rem] leading-none tracking-[-0.02em] text-foreground/55 md:text-[1.85rem]">
                    {row.year}
                  </p>
                ) : null}
              </div>

              <div className="flex justify-center pt-2">
                <span
                  aria-hidden
                  className="timeline-dot h-2.5 w-2.5 shrink-0 rounded-full border border-foreground/25 bg-background shadow-[0_0_0_1px_rgba(15,23,42,0.06)] transition-[transform,box-shadow,background-color,border-color] duration-300 ease-out group-hover:scale-[1.12] group-hover:border-primary/55 group-hover:bg-primary/20 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.28)] md:h-3 md:w-3 dark:shadow-[0_0_0_1px_rgba(248,250,252,0.08)] dark:group-hover:shadow-[0_0_22px_rgba(96,165,250,0.35)]"
                />
              </div>

              <article className="scroll-shrink-item relative min-w-0 pt-2">
                <div className="flex items-start justify-between gap-3 transition-transform duration-300 ease-out motion-reduce:transition-none group-hover:translate-x-[3px] md:gap-4">
                  <h3 className="text-[1rem] font-semibold tracking-tight text-foreground md:text-[1.08rem]">
                    {row.item.title}
                  </h3>
                  <p className="shrink-0 font-mono text-[9px] tracking-[0.12em] text-primary/80 md:text-[10px]">
                    {row.item.timeFrame}
                  </p>
                </div>

                <p className="mt-0.5 font-mono text-[9px] tracking-widest text-theme-subtle underline decoration-foreground/25 underline-offset-[3px] md:text-[10px]">
                  {row.item.company}
                </p>
                <p className="text-theme-muted mt-2 max-w-[74ch] text-[0.9rem] leading-relaxed md:text-[0.95rem]">
                  {row.item.description}
                </p>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

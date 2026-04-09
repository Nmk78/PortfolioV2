"use client";

import { identityTagline, storyChapters } from "@/content/portfolio-identity";

export function StoryPathSection() {
  const total = storyChapters.length;

  return (
    <section
      id="my-path"
      className="scroll-shrink-section  relative overflow-x-clip py-16 md:py-24 lg:py-28"
      aria-labelledby="story-heading"
    >
      <div className="pointer-events-none absolute top-32 bottom-40 left-[max(0rem,calc(50%-22rem-1px))] hidden w-px bg-foreground/18 md:block lg:left-[max(0rem,calc(50%-24rem-1px))]" aria-hidden />

      <div className="pointer-events-none absolute top-24 right-[max(0.5rem,calc(50%-24rem))] hidden font-mono text-[10px] font-medium tracking-[0.42em] text-theme-subtle uppercase md:block [writing-mode:vertical-rl]">
        my path
      </div>

      <header
        className="story-chapter-reveal relative mx-auto max-w-4xl px-4 sm:px-6 md:px-8"
        style={{ animationDelay: "0ms" }}
      >
        <div className="flex flex-col gap-10 md:flex-row md:gap-14 lg:gap-20">
          <p
            className="hidden shrink-0 font-mono text-[10px] leading-loose tracking-[0.38em] text-theme-subtle uppercase md:block [writing-mode:vertical-rl] [text-orientation:mixed]"
            aria-hidden
          >
            {total} scenes · full version
          </p>

          <div className="min-w-0 flex-1">
            <p className="font-mono text-xs tracking-[0.42em] text-foreground">
              <span aria-hidden className="text-theme-subtle">
                §
              </span>{" "}
              SIDE QUEST
            </p>

            <h2
              id="story-heading"
              className="mt-5 max-w-[min(100%,20ch)] text-pretty text-[clamp(2.75rem,9vw,5.5rem)] font-black leading-[0.88] tracking-[-0.045em]"
            >
              The thread
              <span className="mt-3 block max-w-[18ch] font-mono text-[clamp(1.15rem,3.8vw,1.85rem)] font-medium tracking-[-0.02em] text-theme-muted rotate-[-0.8deg]">
                behind the work
              </span>
            </h2>

            <p className="mt-12 max-w-xl font-display text-[clamp(1.2rem,2.8vw,1.65rem)] leading-snug tracking-[-0.01em] text-foreground transition-ui">
              {identityTagline}
            </p>

            <p className="mt-5 max-w-sm font-mono text-[11px] leading-relaxed text-theme-subtle">
              Flip <span className="text-foreground/80">Recruiter</span> in the nav if you want the short menu—same person, less monologue.
            </p>
          </div>
        </div>

        <div className="mt-14 flex items-center gap-4 sm:mt-16" aria-hidden>
          <span className="h-px flex-1 max-w-[min(12rem,40vw)] bg-foreground/25" />
          <span className="font-mono text-[10px] tracking-[1.1em] text-theme-subtle">⁂</span>
          <span className="h-px flex-1 bg-foreground/25" />
        </div>
      </header>

      <ol className="relative m-0 mt-6 list-none border-foreground/20 p-0 sm:mt-10 md:mt-14">
        {storyChapters.map((chapter, index) => {
          const n = index + 1;
          const label = String(n).padStart(2, "0");
          const zig = index % 2 === 0 ? "md:translate-x-0" : "md:translate-x-5 lg:translate-x-8";

          return (
            <li
              key={chapter.title}
              className={`story-chapter-reveal border-t border-foreground/20 ${zig}`}
              style={{ animationDelay: `${60 + index * 85}ms` }}
            >
              <div className="relative mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:py-24">
                <span
                  className="pointer-events-none absolute -left-[min(12%,4.5rem)] top-6 select-none font-mono text-[clamp(4.5rem,20vw,11rem)] font-black leading-none tracking-[-0.06em] text-foreground/6 sm:-left-[min(14%,5rem)] sm:top-8 dark:text-foreground/9 md:-left-[min(18%,7rem)]"
                  aria-hidden
                >
                  {label}
                </span>

                <div className="relative pl-2 sm:pl-4 md:pl-8 ml-10">
                  <p className="font-mono text-[10px] font-bold tracking-[0.32em] text-theme-subtle uppercase">
                    {label} / {total}{" "}
                    <span className="text-foreground/35" aria-hidden>
                      —
                    </span>{" "}
                    scene
                  </p>
                  <h3 className="mt-4 max-w-[28ch] text-2xl font-bold tracking-[-0.025em] text-pretty md:text-3xl lg:text-[2rem]">
                    {chapter.title}
                  </h3>

                  <p className="mt-10 max-w-2xl font-display text-[clamp(1.25rem,3.2vw,1.85rem)] leading-[1.28] tracking-[-0.015em] text-foreground transition-ui">
                    {chapter.pull}
                  </p>

                  <p className="story-prose-columns mt-8 max-w-none text-base leading-[1.7] text-theme-muted md:text-lg">
                    {chapter.body}
                  </p>
                </div>

                {index < storyChapters.length - 1 ? (
                  <div className="mt-6 flex justify-center sm:mt-10" aria-hidden>
                    <span className="font-mono text-[10px] tracking-[0.85em] text-theme-subtle">···</span>
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

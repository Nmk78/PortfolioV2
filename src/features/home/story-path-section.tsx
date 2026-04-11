"use client";

import { identityTagline, storyChapters } from "@/content/portfolio-identity";

export function StoryPathSection() {
  const total = storyChapters.length;

  return (
    <section
      id="about"
      className="scroll-shrink-section relative overflow-x-clip py-10 md:py-14 lg:py-16"
      aria-labelledby="story-heading"
    >
      <div className="pointer-events-none absolute top-28 bottom-36 left-[max(0rem,calc(50%-20rem-1px))] hidden w-px bg-foreground/18 md:block lg:left-[max(0rem,calc(50%-22rem-1px))]" aria-hidden />

      <div className="pointer-events-none absolute top-20 right-[max(0.5rem,calc(50%-22rem))] hidden font-mono text-[10px] font-medium tracking-[0.42em] text-theme-subtle uppercase md:block [writing-mode:vertical-rl]">
        my path
      </div>

      <header
        className="story-chapter-reveal relative mx-auto max-w-4xl px-4 sm:px-6 md:px-8"
        style={{ animationDelay: "0ms" }}
      >
        <div className="flex flex-col gap-8 md:flex-row md:gap-10 lg:gap-14">
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
              className="mt-4 max-w-[min(100%,20ch)] text-pretty text-[clamp(1.9rem,calc(3.8vw_+_0.85rem),3.15rem)] font-black leading-[0.9] tracking-[-0.045em] md:mt-5"
            >
              The thread
              <span className="mt-2 block max-w-[18ch] font-mono text-[clamp(0.95rem,calc(1.2vw_+_0.75rem),1.35rem)] font-medium tracking-[-0.02em] text-theme-muted rotate-[-0.8deg] md:mt-3">
                behind the work
              </span>
            </h2>

            <p className="mt-8 max-w-xl font-display text-[clamp(1rem,1.1vw+0.82rem,1.35rem)] leading-[1.55] tracking-[-0.01em] text-foreground transition-ui md:mt-10">
              {identityTagline}
            </p>

            <p className="mt-4 max-w-sm font-mono text-[10px] leading-relaxed text-theme-subtle md:mt-5 md:text-[11px]">
              Flip <span className="text-foreground/80">Recruiter</span> in the nav if you want the short menu—same person, less monologue.
            </p>
          </div>
        </div>

        <div className="mt-10 flex items-center gap-4 sm:mt-12" aria-hidden>
          <span className="h-px flex-1 max-w-[min(12rem,40vw)] bg-foreground/25" />
          <span className="font-mono text-[10px] tracking-[1.1em] text-theme-subtle">⁂</span>
          <span className="h-px flex-1 bg-foreground/25" />
        </div>
      </header>

      <ol className="relative m-0 mt-5 list-none border-foreground/20 p-0 sm:mt-8 md:mt-10">
        {storyChapters.map((chapter, index) => {
          const n = index + 1;
          const label = String(n).padStart(2, "0");
          const zig = index % 2 === 0 ? "md:translate-x-0" : "md:translate-x-4 lg:translate-x-6";

          return (
            <li
              key={chapter.title}
              className={`story-chapter-reveal border-t border-foreground/20 ${zig}`}
              style={{ animationDelay: `${60 + index * 85}ms` }}
            >
              <div className="relative mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12 md:px-8 md:py-14 lg:py-16">
                <span
                  className="pointer-events-none absolute -left-[min(12%,4rem)] top-5 select-none font-mono text-[clamp(2.75rem,calc(11vw_+_1rem),6.25rem)] font-black leading-none tracking-[-0.06em] text-foreground/6 sm:-left-[min(14%,4.5rem)] sm:top-7 dark:text-foreground/9 md:-left-[min(18%,6rem)]"
                  aria-hidden
                >
                  {label}
                </span>

                <div className="relative ml-8 pl-2 sm:ml-10 sm:pl-4 md:pl-7">
                  <p className="font-mono text-[10px] font-bold tracking-[0.32em] text-theme-subtle uppercase">
                    {label} / {total}{" "}
                    <span className="text-foreground/35" aria-hidden>
                      —
                    </span>{" "}
                    scene
                  </p>
                  <h3 className="mt-3 max-w-[28ch] text-xl font-bold tracking-[-0.025em] text-pretty md:mt-4 md:text-2xl lg:text-[1.75rem]">
                    {chapter.title}
                  </h3>

                  <p className="mt-6 max-w-2xl font-display text-[clamp(1.02rem,calc(1.15vw_+_0.85rem),1.42rem)] leading-[1.55] tracking-[-0.015em] text-foreground transition-ui md:mt-8">
                    {chapter.pull}
                  </p>

                  <p className="story-prose-columns mt-6 max-w-none text-sm leading-[1.65] text-theme-muted md:mt-8 md:text-base lg:text-[1.05rem]">
                    {chapter.body}
                  </p>
                </div>

                {index < storyChapters.length - 1 ? (
                  <div className="mt-5 flex justify-center sm:mt-8" aria-hidden>
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

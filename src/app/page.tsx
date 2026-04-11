"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Quote, Volume2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { MagneticLink } from "@/components/ui/MagneticLink";
import { HashFrameLines, TechStackIcon } from "@/components/ui/Icons";
import { PixelRevealPortrait } from "@/components/ui/PixelRevealPortrait";
import { useEmployerMode } from "@/components/ui/employer-mode-provider";
import { ProjectShowcaseSection } from "@/features/home/project-showcase-section";
import type { HeroSegment } from "@/content/portfolio-identity";
import {
  heroEmployer,
  heroNormal,
  techStacks,
  timelineItems,
  valueProps,
} from "@/content/portfolio-identity";

const heroExternalLinkClass =
  "font-semibold text-primary underline decoration-primary/45 underline-offset-[3px] transition-ui hover:decoration-primary focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

function HeroInlineSegments({
  segments,
}: {
  segments: readonly HeroSegment[];
}) {
  return (
    <>
      {segments.map((part, i) =>
        typeof part === "string" ? (
          <span key={`hero-seg-${i}`}>{part}</span>
        ) : (
          <a
            key={`${part.href}-${i}`}
            href={part.href}
            {...(isExternalHref(part.href)
              ? { target: "_blank" as const, rel: "noopener noreferrer" }
              : {})}
            className={heroExternalLinkClass}
          >
            {part.label}
          </a>
        ),
      )}
    </>
  );
}

export default function Home() {
  const { isEmployerMode } = useEmployerMode();
  const nameAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/name.m4a");
    audio.preload = "auto";
    nameAudioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
      nameAudioRef.current = null;
    };
  }, []);

  function playNamePronunciation() {
    const audio = nameAudioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    void audio.play().catch(() => {
      // Ignore blocked autoplay errors; user can try again.
    });
  }

  useEffect(() => {
    const items = Array.from(
      document.querySelectorAll<HTMLElement>(".scroll-shrink-item"),
    );
    if (!items.length) return;

    if (isEmployerMode) {
      items.forEach((item) => {
        item.style.setProperty("--scroll-scale", "1");
        item.style.setProperty("--scroll-opacity", "1");
      });
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;

    const updateSections = () => {
      const viewportHeight = window.innerHeight;

      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const visibleHeight = Math.max(
          0,
          Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0),
        );
        const baseHeight = Math.max(1, Math.min(rect.height, viewportHeight));
        const visibilityRatio = Math.max(
          0,
          Math.min(1, visibleHeight / baseHeight),
        );
        const scale = 0.5 + visibilityRatio * 0.5;
        const opacity = 0.45 + visibilityRatio * 0.55;

        item.style.setProperty("--scroll-scale", scale.toFixed(3));
        item.style.setProperty("--scroll-opacity", opacity.toFixed(3));
      });

      frame = 0;
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateSections);
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    requestUpdate();

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [isEmployerMode]);

  const testimonials = [
    {
      quote:
        "Nay shipped the interface refresh quickly and made it feel much more premium without bloating the app.",
      author: "Product Lead",
      role: "SaaS Platform",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&h=160&q=80",
      profileUrl: "https://www.linkedin.com/",
      profileLabel: "LinkedIn",
    },
    {
      quote:
        "Strong balance between code quality and UI detail. Communication was clear and implementation was reliable.",
      author: "Engineering Manager",
      role: "Startup Team",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80",
      profileUrl: "https://www.linkedin.com/",
      profileLabel: "Portfolio",
    },
    {
      quote:
        "Great execution on responsive behavior and performance. The UX got cleaner and much easier to use.",
      author: "Client",
      role: "Portfolio Project",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&h=160&q=80",
      profileUrl: "https://www.linkedin.com/",
      profileLabel: "Profile",
    },
  ];

  const timelineByYear = useMemo(() => {
    const grouped = new Map<string, Array<(typeof timelineItems)[number]>>();
    for (const item of timelineItems) {
      const yearKey = item.timeFrame.split(" - ")[0];
      const prev = grouped.get(yearKey);
      if (prev) grouped.set(yearKey, [...prev, item]);
      else grouped.set(yearKey, [item]);
    }
    return Array.from(grouped.entries()).map(([year, items]) => ({
      year,
      items,
    }));
  }, []);

  const timelineRows = useMemo(
    () =>
      timelineByYear.flatMap(({ year, items }) =>
        items.map((item, idx) => ({
          showYear: idx === 0,
          year,
          item,
          rowKey: `${year}-${item.title}-${item.company}-${item.timeFrame}`,
        })),
      ),
    [timelineByYear],
  );

  return (
    <div
      className={`w-full texture-dots space-y-5 pb-24 md:space-y-7 md:pb-32 lg:space-y-8 lg:pb-36 ${isEmployerMode ? "employer-mode-surface" : ""}`}
    >
      <section className="scroll-shrink-section select-none relative rounded-3xl border-0 border-foreground/10 px-5 py-5 md:px-8 md:py-7">
        <div className="grid items-center justify-center gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:items-center">
          <div className="scroll-shrink-item space-y-4 md:space-y-5">
            <div className="inline-flex items-center gap-3">
              {/* <span className="inline-block min-h-9 rounded-full border border-primary/30 bg-primary/10 px-4 py-2.5 font-mono text-xs font-bold tracking-[0.24em] text-primary uppercase transition-ui">
                {isEmployerMode ? heroEmployer.badge : heroNormal.badge}
              </span> */}
            </div>
            {isEmployerMode ? (
              <>
                <h1 className="text-3xl leading-[0.92] font-black tracking-tighter sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl text-pretty">
                  {heroEmployer.lead}
                </h1>
                <div className="flex flex-wrap relative items-center gap-2 sm:gap-3">
                  <span className="group/roll relative block text-3xl leading-[0.92] font-black tracking-tighter sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl text-pretty">
                    <button
                      type="button"
                      onClick={playNamePronunciation}
                      aria-label="Play pronunciation of Nay Myo Khant"
                      className="inline-block h-[1em] overflow-hidden align-baseline cursor-pointer rounded-sm border-0 bg-transparent p-0 text-left font-inherit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background touch-manipulation"
                    >
                      <span className="flex flex-col bg-linear-to-r from-foreground to-primary bg-clip-text text-transparent transition-transform duration-(--duration-ui-slow) ease-(--ease-ui) group-hover/roll:-translate-y-1/2">
                        <span className="leading-none">Nay Myo Khant</span>
                        <span className="leading-none">Marcus</span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={playNamePronunciation}
                      className="group absolute -right-10 -top-4 inline-flex min-h-10 min-w-10 items-center justify-center rounded-full text-theme-muted transition-ui hover:border-primary/45 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background touch-manipulation"
                      aria-label="Play name pronunciation"
                    >
                      <Volume2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </span>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-3xl leading-[0.92] font-black tracking-tighter sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl text-pretty">
                  {heroNormal.lead}
                </h1>
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 relative">
                  <span className="group/roll relative block text-3xl leading-[0.92] font-black tracking-tighter sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl text-pretty">
                    <button
                      type="button"
                      onClick={playNamePronunciation}
                      aria-label="Play pronunciation of Nay Myo Khant"
                      className="inline-block h-[1em] overflow-hidden align-baseline cursor-pointer rounded-sm border-0 bg-transparent p-0 text-left font-inherit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background touch-manipulation"
                    >
                      <span className="flex flex-col bg-linear-to-r from-foreground to-primary bg-clip-text text-transparent transition-transform duration-(--duration-ui-slow) ease-(--ease-ui) group-hover/roll:-translate-y-1/2">
                        <span className="leading-none">Nay Myo Khant</span>
                        <span className="leading-none">Marcus</span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={playNamePronunciation}
                      className="group absolute -right-10 -top-4 inline-flex min-h-10 min-w-10 items-center justify-center rounded-full text-theme-muted transition-ui hover:border-primary/45 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background touch-manipulation"
                      aria-label="Play name pronunciation"
                    >
                      <Volume2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </span>
                </div>
              </>
            )}

            {isEmployerMode ? (
              <p className="max-w-xl font-mono text-[12px] leading-relaxed tracking-tight text-theme-muted md:text-[13px]">
                <HeroInlineSegments segments={heroEmployer.metaLine} />
              </p>
            ) : null}

            {!isEmployerMode ? (
              // <p
              //   className="max-w-xl text-pretty text-lg leading-snug text-foreground md:text-xl md:leading-snug"
              // >
              <p className="max-w-xl font-mono text-[12px] leading-relaxed tracking-tight text-theme-muted md:text-[13px]">
                <HeroInlineSegments segments={heroNormal.summaryLead} />
              </p>
            ) : null}
            <div className="hidden md:flex flex-col gap-3 sm:flex-row ">
              <MagneticLink>
                <Link
                  href="/cv"
                  className="min-h-9 rounded-full bg-foreground px-4 py-2 text-sm font-bold text-background transition-ui hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Download CV
                </Link>
              </MagneticLink>
              <MagneticLink>
                <Link
                  href="/about#contact"
                  className="min-h-9 rounded-full bg-transparent border border-foreground/20 px-4 py-2 text-sm font-bold text-foreground transition-ui hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Contact Me
                </Link>
              </MagneticLink>
            </div>
          </div>

          <div className="scroll-shrink-item flex w-full flex-col items-center justify-center lg:-mt-1">
            <div className="relative w-full max-w-[min(100%,22rem)] sm:max-w-104 md:max-w-md lg:max-w-[min(100%,28rem)] lg:translate-y-[-3%] xl:max-w-none">
              <PixelRevealPortrait
                src="/potrait.svg"
                alt="Stylized portrait artwork of Nay Myo Khant"
                width={720}
                height={900}
                priority
                className="w-full scale-[0.8] lg:scale-70 pr-2"
              />
            </div>
            <div className="flex flex-col md:hidden gap-4 sm:flex-row absolute bottom-15 md:bottom-10">
              <MagneticLink>
                <Link
                  href="/contact"
                  className="rounded-full bg-foreground px-3 py-1.5 text-md font-semibold text-background transition-ui hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Download CV
                </Link>
              </MagneticLink>
            </div>
          </div>
        </div>
      </section>

      <section className="scroll-shrink-section rounded-3xl border-0 border-foreground/10 p-5 md:p-7 lg:p-8">
        <h2 className="text-2xl font-black tracking-tight sm:text-3xl md:text-4xl">
          Tech Stacks
        </h2>
        <p className="text-theme-muted mt-2 max-w-xl text-sm">
          Tools I actually ship with.
        </p>
        {/* Mobile: square tiles + #-frame */}
        <ul className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:hidden">
          {techStacks.map((stack) => (
            <li key={stack} className="relative list-none">
              <div className="relative flex aspect-square w-full flex-col items-center justify-center gap-1.5 overflow-visible p-1">
                <HashFrameLines />
                <TechStackIcon
                  name={stack}
                  className="h-8 w-8 shrink-0 [&_img]:h-full [&_img]:w-full"
                />
                <span className="line-clamp-2 px-0.5 text-center text-[0.65rem] font-semibold leading-tight text-theme-muted">
                  {stack}
                </span>
              </div>
            </li>
          ))}
        </ul>
        {/* Laptop+: pill chips with icon + label */}
        <div className="mt-6 hidden flex-wrap gap-2.5 md:flex md:gap-3">
          {techStacks.map((stack) => (
            <span
              key={stack}
              className="text-theme-muted inline-flex min-h-9 items-center gap-2 rounded-full border border-foreground/15 bg-foreground/3 px-3 py-1.5 font-sans text-xs font-semibold transition-ui hover:border-foreground/30 hover:bg-foreground/6 md:min-h-10 md:px-3.5 md:text-sm"
            >
              <TechStackIcon
                name={stack}
                className="h-[18px] w-[18px] shrink-0 [&_img]:h-full [&_img]:w-full"
              />
              {stack}
            </span>
          ))}
        </div>
      </section>
      <ProjectShowcaseSection />

      {isEmployerMode && (
        <section className="scroll-shrink-section rounded-3xl border-0 border-foreground/10 p-5 md:p-7 lg:p-8">
          <div className="mb-7 flex flex-col gap-3 md:mb-8 md:flex-row md:items-end md:justify-between">
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl md:text-4xl">
              What I Bring
            </h2>
            {/* <p className="text-theme-muted max-w-xl">Beyond visuals: maintainable systems, performance-first UX, and shipping discipline from concept to production.</p> */}
          </div>
          <div className="grid gap-0 md:grid-cols-3">
            {valueProps.map((item) => (
              <article
                key={item.title}
                className="scroll-shrink-item space-y-3 p-5 transition-ui md:space-y-3.5 md:p-6 lg:p-7 hover:bg-foreground/2"
              >
                <h3 className="text-lg font-bold tracking-tight md:text-xl">
                  {item.title}
                </h3>
                <p className="text-theme-muted text-sm leading-relaxed md:text-base">
                  {item.desc}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

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
          <h2 className="font-display text-[clamp(1.3rem,calc(1.35vw_+_0.85rem),2.1rem)] font-medium tracking-tight text-foreground">
            Experience
          </h2>
        </div>

        <div className="relative">
          {/* Spine: centered in the 12px column; dots sit in that same column for perfect alignment */}
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

        <section className="scroll-shrink-section rounded-3xl border-0 border-foreground/10 p-5 md:p-7 lg:p-8">
          <div className="mb-6 flex items-center gap-2.5 md:mb-7">
            <Quote
              className="h-4 w-4 shrink-0 text-primary md:h-5 md:w-5"
              aria-hidden="true"
            />
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl md:text-4xl">
              Testimonials
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3 md:gap-5">
            {testimonials.map((item) => (
              <article
                key={item.author + item.role}
                className="scroll-shrink-item relative z-0 overflow-visible rounded-none border-0 bg-background/70 p-5 transition-ui md:z-auto md:overflow-hidden md:rounded-2xl md:border md:border-foreground/10 md:p-6 md:hover:border-foreground/18"
              >
                <div
                  className="pointer-events-none absolute inset-0 overflow-visible md:hidden"
                  aria-hidden
                >
                  <HashFrameLines />
                </div>
                <div className="relative z-1">
                  <p className="text-theme-muted text-sm leading-relaxed md:text-base">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <div className="mt-4 flex gap-3 flex-row sm:items-center sm:justify-between sm:gap-4 md:mt-5">
                    <div className="flex min-w-0 items-center gap-2.5 md:gap-3">
                      <Image
                        src={item.avatar}
                        alt={`${item.author} profile`}
                        width={40}
                        height={40}
                        className="h-9 w-9 rounded-full object-cover ring-1 ring-foreground/15 md:h-10 md:w-10"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-foreground md:text-sm">
                          {item.author}
                        </p>
                        <p className="text-theme-subtle truncate text-xs md:text-sm">
                          {item.role}
                        </p>
                      </div>
                    </div>
                    <a
                      href={item.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex w-fit min-h-10 shrink-0 items-center gap-1.5 rounded-sm py-1.5 font-sans text-xs font-semibold text-primary underline decoration-primary/40 underline-offset-[5px] transition-ui hover:decoration-primary hover:text-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background [-webkit-tap-highlight-color:transparent] sm:min-h-0 sm:py-0"
                    >
                      {item.profileLabel}
                      <ExternalLink
                        className="h-3 w-3 shrink-0 opacity-65 transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
    </div>
  );
}

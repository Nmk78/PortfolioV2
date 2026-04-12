"use client";

import { useEffect, useRef } from "react";
import { Volume2 } from "lucide-react";
import Link from "next/link";
import { MagneticLink } from "@/components/ui/MagneticLink";
import { PixelRevealPortrait } from "@/components/ui/PixelRevealPortrait";
import { useEmployerMode } from "@/components/ui/employer-mode-provider";
import type { HeroSegment } from "@/content/portfolio-identity";
import { heroEmployer, heroNormal } from "@/content/portfolio-identity";

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

function NameRoll({
  onPlayNamePronunciation,
}: {
  onPlayNamePronunciation: () => void;
}) {
  return (
    <span className="group/roll relative block text-3xl leading-[0.92] font-black tracking-tighter sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl text-pretty">
      <button
        type="button"
        onClick={onPlayNamePronunciation}
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
        onClick={onPlayNamePronunciation}
        className="group absolute -right-10 -top-4 inline-flex min-h-10 min-w-10 items-center justify-center rounded-full text-theme-muted transition-ui hover:border-primary/45 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background touch-manipulation"
        aria-label="Play name pronunciation"
      >
        <Volume2 className="h-4 w-4" aria-hidden="true" />
      </button>
    </span>
  );
}

export function HeroSection() {
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

  return (
    <section className="scroll-shrink-section select-none relative rounded-3xl border-0 border-foreground/10 px-5 py-5 md:px-8 md:py-7">
      <div className="grid items-center justify-center gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:items-center">
        <div className="scroll-shrink-item space-y-4 md:space-y-5">
          <div className="inline-flex items-center gap-3" />
          {isEmployerMode ? (
            <>
              <h1 className="text-3xl leading-[0.92] font-black tracking-tighter sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl text-pretty">
                {heroEmployer.lead}
              </h1>
              <div className="flex flex-wrap relative items-center gap-2 sm:gap-3">
                <NameRoll onPlayNamePronunciation={playNamePronunciation} />
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl leading-[0.92] font-black tracking-tighter sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl text-pretty">
                {heroNormal.lead}
              </h1>
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 relative">
                <NameRoll onPlayNamePronunciation={playNamePronunciation} />
              </div>
            </>
          )}

          {isEmployerMode ? (
            <p className="max-w-xl font-mono text-[12px] leading-relaxed tracking-tight text-theme-muted md:text-[13px]">
              <HeroInlineSegments segments={heroEmployer.metaLine} />
            </p>
          ) : null}

          {!isEmployerMode ? (
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
  );
}

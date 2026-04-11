"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Crown,
  Expand,
  ExternalLink,
  Gavel,
  LayoutDashboard,
  Layers,
  Sparkles,
  Upload,
  Users,
  X,
} from "lucide-react";
import { Github } from "@/components/ui/Icons";
import { MagneticLink } from "@/components/ui/MagneticLink";
import { cn } from "@/lib/utils";
import styles from "./pu-selection-case-study.module.css";

const STACK = [
  "TypeScript",
  "Next.js",
  "Zod",
  "Prisma",
  "MongoDB",
  "Clerk",
  "UploadThing",
  "TanStack Query",
  "shadcn/ui",
  "Vercel",
] as const;

const PILLARS = [
  {
    title: "Role-based voting",
    body: "Separate flows for public ballots and judge scoring so weighting stays explicit and auditable.",
    icon: Gavel,
  },
  {
    title: "Media pipeline",
    body: "UploadThing-backed storage for candidate imagery—fast uploads, predictable URLs, and admin-friendly handling.",
    icon: Upload,
  },
  {
    title: "Rounds & control",
    body: "Admin tooling to open and close rounds, align the event schedule, and keep the floor on-script.",
    icon: LayoutDashboard,
  },
  {
    title: "Rooms & archive",
    body: "Reusable room templates for recurring events plus archive reservation so history stays organized.",
    icon: Layers,
  },
] as const;

/** Row groupings for bento layout; indices map to GALLERY order */
const GALLERY_ROW_INDICES: readonly (readonly number[])[] = [
  [0],
  [1, 2],
  [3, 4, 5],
  [6],
] as const;

const GALLERY = [
  {
    src: "/projects/selectionV2/cover.webp",
    alt: "PU Selection cover and branding",
    caption: "Cover",
    canvas: "hero" as const,
  },
  {
    src: "/projects/selectionV2/home.webp",
    alt: "Home and landing experience",
    caption: "Landing",
    canvas: "tile" as const,
  },
  {
    src: "/projects/selectionV2/vote.webp",
    alt: "Voting interface",
    caption: "Voting",
    canvas: "tile" as const,
  },
  {
    src: "/projects/selectionV2/dashboard.webp",
    alt: "Admin dashboard",
    caption: "Admin",
    canvas: "tile" as const,
  },
  {
    src: "/projects/selectionV2/profile.webp",
    alt: "Candidate profile",
    caption: "Profiles",
    canvas: "tile" as const,
  },
  {
    src: "/projects/selectionV2/result.webp",
    alt: "Results presentation",
    caption: "Results",
    canvas: "tile" as const,
  },
  {
    src: "/projects/selectionV2/archive.webp",
    alt: "Archive and records",
    caption: "Archive",
    canvas: "wide" as const,
  },
] as const;

const LINKS = {
  github: "https://github.com/Nmk78/selection",
  live: "https://puselection.vercel.app",
} as const;

const SHOT_CANVAS: Record<
  (typeof GALLERY)[number]["canvas"],
  string
> = {
  hero: styles.shotCanvasHero,
  tile: styles.shotCanvasTile,
  wide: styles.shotCanvasWide,
};

const HERO_LIGHTBOX = {
  src: "/projects/selectionV2/hero.webp",
  alt: "PU Selection hero — event voting platform",
  caption: "Overview",
} as const;


const LIGHTBOX_ITEMS = [
  HERO_LIGHTBOX,
  ...GALLERY.map((item) => ({
    src: item.src,
    alt: item.alt,
    caption: item.caption,
  })),
] as const;

const CAPABILITIES = [
  "Built for peak traffic—2,500+ concurrent visitors during voting windows without turning the UI into a bottleneck.",
  "Clerk-authenticated surfaces with clear separation between voters, judges, and operators.",
  "Zod-validated inputs end to end; Prisma + MongoDB for resilient document-style workloads.",
  "TanStack Query for snappy client cache behavior where every round change must feel instant.",
  "UploadThing integration for candidate media—predictable delivery on Vercel’s edge footprint.",
] as const;


export function PuSelectionProjectPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const goPrevLightbox = useCallback(() => {
    setLightboxIndex((i) => {
      if (i === null) return null;
      return (i - 1 + LIGHTBOX_ITEMS.length) % LIGHTBOX_ITEMS.length;
    });
  }, []);

  const goNextLightbox = useCallback(() => {
    setLightboxIndex((i) => {
      if (i === null) return null;
      return (i + 1) % LIGHTBOX_ITEMS.length;
    });
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [lightboxIndex]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setLightboxIndex(null);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setLightboxIndex((i) =>
          i === null ? null : (i - 1 + LIGHTBOX_ITEMS.length) % LIGHTBOX_ITEMS.length,
        );
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setLightboxIndex((i) =>
          i === null ? null : (i + 1) % LIGHTBOX_ITEMS.length,
        );
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex]);

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".pu-selection-reveal", {
        y: 32,
        opacity: 0,
        duration: 0.95,
        stagger: 0.055,
        ease: "expo.out",
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className={cn(
        styles.root,
        "w-full space-y-20 pb-28 pt-4 md:space-y-24 md:pt-8",
      )}
    >
      <div className={styles.atmosphere} aria-hidden>
        <div className={styles.vignette} />
      </div>

      <header className={cn(styles.heroInner, "pu-selection-reveal space-y-8")}>
        <MagneticLink className="inline-block w-fit">
          <Link
            href="/projects"
            className="hover-target inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-theme-subtle transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 opacity-70" />
            All projects
          </Link>
        </MagneticLink>

        <div className="space-y-6">
          <div className={styles.ticketRule} aria-hidden />
          <div className="flex flex-wrap items-center gap-2">
            <span className={styles.pill}>
              <Users className="mr-1 inline h-3 w-3 opacity-90" strokeWidth={2} />
              PU Myeik
            </span>
            <span className={cn(styles.pill, styles.pillEvent)}>Campus event</span>
          </div>

          <div className="space-y-4">
            <h1
              className="max-w-[16ch] font-sans text-[clamp(2.5rem,7vw,4rem)] font-black leading-[0.92] tracking-tighter text-foreground"
              style={{ fontFeatureSettings: '"ss01"' }}
            >
              PU Selection
            </h1>
            <p className="max-w-2xl font-display text-[clamp(1.2rem,2.8vw,1.65rem)] font-normal italic leading-snug tracking-[-0.02em] text-foreground/90">
              King, Queen, Prince &amp; Princess—fair ballots, judge weighting, and
              a floor that stays on schedule.
            </p>
          </div>

          <p className="max-w-3xl font-sans text-base leading-[1.75] text-theme-muted md:text-lg">
            A web platform that streamlines standout student selection across majors:
            transparent voting, judge workflows, reusable event rooms, and archives
            that stay reserved for institutional memory—all tuned for high-traffic
            open nights.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <a className={styles.ctaPrimary} href={LINKS.github}>
              <Github className="h-3.5 w-3.5 opacity-90" />
              View code
            </a>
            <a className={styles.ctaGhost} href={LINKS.live}>
              <ExternalLink className="h-3.5 w-3.5 opacity-80" />
              Live demo
            </a>
          </div>
        </div>
      </header>

      <section className="pu-selection-reveal">
        <div className={styles.frame}>
          <button
            type="button"
            className={cn(styles.frameButton, "group")}
            onClick={() => openLightbox(0)}
            aria-label="Open overview screenshot full size"
          >
            <div className="relative aspect-21/9 w-full min-h-[180px] overflow-hidden bg-zinc-950/35 sm:min-h-[220px] dark:bg-zinc-950/35">
              <Image
                src="/projects/selectionV2/hero.webp"
                alt="PU Selection hero — event voting platform"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, min(1280px, 92vw)"
                priority
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-background/95 to-transparent sm:h-20" />
              <span
                className="pointer-events-none absolute right-3 top-3 rounded-sm bg-black/45 px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-amber-50/95 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 sm:opacity-100"
                aria-hidden
              >
                Click to expand
              </span>
            </div>
          </button>
        </div>
      </section>

      <section className="pu-selection-reveal grid gap-10 lg:grid-cols-12 lg:gap-12 lg:items-start">
        <div className="space-y-3 lg:col-span-4">
          <p className={styles.sectionLabel}>Scale</p>
          <p className={styles.pullStat}>2,500+</p>
          <p className={styles.statSub}>Peak visitors</p>
          <p className="font-sans text-sm leading-relaxed text-theme-muted">
            Engineered for burst traffic during live voting—static-friendly delivery,
            disciplined client cache, and operator tooling that does not fight the
            clock.
          </p>
        </div>
        <div className="space-y-6 lg:col-span-8">
          <p className={styles.sectionLabel}>Brief</p>
          <p className="font-sans text-lg leading-[1.75] text-foreground/95 md:text-xl">
            PU Selection digitizes a longstanding campus tradition: elevating students
            across majors into ceremonial roles. The product has to feel festive for
            attendees while remaining strict for auditors—every vote and judge score
            needs a paper trail without slowing the show.
          </p>
          <p className="font-sans text-base leading-[1.75] text-theme-muted md:text-[1.05rem]">
            Next.js anchors the experience; Clerk gates privileged routes; Prisma
            speaks MongoDB with type-safe models; Zod guards every mutation; TanStack
            Query keeps the UI responsive as rounds advance; UploadThing covers rich
            media; Vercel hosts the whole stack at the edge.
          </p>
        </div>
      </section>

      <section className="pu-selection-reveal space-y-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className={styles.sectionLabel}>Product pillars</p>
            <h2 className="mt-2 flex items-center gap-2 font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              <Crown className="h-7 w-7 text-[#c4a35a]" strokeWidth={1.5} aria-hidden />
              Fair, fast, repeatable
            </h2>
          </div>
        </div>
        <ul className="grid gap-4 md:grid-cols-2">
          {PILLARS.map((p) => (
            <li key={p.title} className={styles.pillar}>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#c4a35a]/30 bg-[#c4a35a]/8 text-[#fde68a]">
                  <p.icon className="h-4 w-4" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-sans text-[1.05rem] font-bold leading-tight text-foreground">
                    {p.title}
                  </h3>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-theme-muted">
                    {p.body}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="pu-selection-reveal space-y-8">
        <div>
          <p className={styles.sectionLabel}>Interface</p>
          <h2 className="mt-2 font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Screens &amp; flows
          </h2>
        </div>
        <div className={styles.gallerySection}>
          {GALLERY_ROW_INDICES.map((indices, rowIdx) => (
            <div
              key={`row-${rowIdx}`}
              className={cn(
                styles.galleryRow,
                indices.length === 2 && styles.galleryRowTwo,
                indices.length === 3 && styles.galleryRowThree,
              )}
            >
              {indices.map((galleryIndex) => {
                const item = GALLERY[galleryIndex];
                return (
                  <button
                    key={item.src}
                    type="button"
                    className={cn(styles.shot, styles.shotClickable, "h-full min-h-0")}
                    onClick={() => openLightbox(galleryIndex + 1)}
                    aria-label={`Open ${item.caption} screenshot full size`}
                  >
                    <span className={styles.shotOpenHint} aria-hidden>
                      <Expand className="h-3 w-3 shrink-0 opacity-90" strokeWidth={2} />
                      Enlarge
                    </span>
                    <div
                      className={cn(
                        styles.shotCanvas,
                        SHOT_CANVAS[item.canvas],
                      )}
                    >
                      <Image
                        src={item.src}
                        alt=""
                        fill
                        className="object-cover object-top"
                        sizes={
                          indices.length === 1
                            ? "(max-width: 768px) 100vw, min(1200px, 92vw)"
                            : indices.length === 2
                              ? "(max-width: 640px) 100vw, 45vw"
                              : "(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 30vw"
                        }
                      />
                    </div>
                    <div className={styles.shotCap}>
                      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900 drop-shadow-sm dark:text-amber-50">
                        {item.caption}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      <section className="pu-selection-reveal space-y-6">
        <div>
          <p className={styles.sectionLabel}>Stack</p>
          <h2 className="mt-2 font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Tools &amp; services
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {STACK.map((label) => (
            <span key={label} className={styles.pill}>
              {label}
            </span>
          ))}
        </div>
      </section>

      <section className="pu-selection-reveal border border-[#c4a35a]/20 bg-[#c4a35a]/6 px-6 py-8 md:px-10 md:py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-12">
          <div className="shrink-0">
            <p className={styles.sectionLabel}>Delivery</p>
            <h2 className="mt-2 max-w-xs font-sans text-xl font-bold tracking-tight text-foreground md:text-2xl">
              What had to land for opening night
            </h2>
          </div>
          <ul className="max-w-2xl space-y-4 border-l-2 border-[#c4a35a]/35 pl-6">
            {CAPABILITIES.map((line) => (
              <li
                key={line}
                className="flex gap-3 font-sans text-sm leading-relaxed text-theme-muted md:text-base"
              >
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#c4a35a]" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="pu-selection-reveal flex flex-col gap-5 border-t border-foreground/10 pt-12 md:flex-row md:items-center md:justify-between">
        <div>
          <p className={styles.sectionLabel}>Repository &amp; demo</p>
          <p className="mt-2 max-w-md font-sans text-sm text-theme-muted">
            Check it out!
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a className={styles.ctaPrimary} href={LINKS.github}>
            <Github className="h-3.5 w-3.5 opacity-90" />
            View code
          </a>
          <a className={styles.ctaGhost} href={LINKS.live}>
            <ExternalLink className="h-3.5 w-3.5 opacity-80" />
            Live demo
          </a>
        </div>
      </section>

      {lightboxIndex !== null
        ? createPortal(
            <div
              className={cn(
                styles.lightboxOverlay,
                "fixed inset-0 z-[998] flex cursor-default items-center justify-center p-3 sm:p-6",
              )}
              role="dialog"
              aria-modal="true"
              aria-label={`Full size: ${LIGHTBOX_ITEMS[lightboxIndex].caption}`}
              onClick={(e) => {
                if (e.target === e.currentTarget) closeLightbox();
              }}
            >
              <div
                className="flex max-h-[min(94dvh,920px)] w-full max-w-5xl cursor-default flex-col gap-3"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex shrink-0 items-center justify-between gap-3">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#c4a35a]">
                    {LIGHTBOX_ITEMS[lightboxIndex].caption}
                  </p>
                  <button
                    type="button"
                    className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-foreground/15 bg-background/90 text-foreground transition-colors hover:bg-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c4a35a]"
                    onClick={closeLightbox}
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" strokeWidth={1.75} />
                  </button>
                </div>
                <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-auto rounded-xl border border-[#c4a35a]/20 bg-zinc-950/60 p-2 shadow-[0_0_0_1px_rgba(0,0,0,0.2),0_24px_80px_-20px_rgba(0,0,0,0.65)] sm:p-4 dark:bg-zinc-950/50">
                  <Image
                    src={LIGHTBOX_ITEMS[lightboxIndex].src}
                    alt={LIGHTBOX_ITEMS[lightboxIndex].alt}
                    width={1920}
                    height={1080}
                    className="h-auto max-h-[min(80dvh,800px)] w-full object-contain object-top"
                    sizes="(max-width: 1024px) 100vw, 960px"
                    priority={lightboxIndex === 0}
                  />
                </div>
                <div className="flex shrink-0 items-center justify-between gap-3">
                  <button
                    type="button"
                    className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-sm border border-foreground/15 bg-background/90 px-3 font-mono text-[10px] font-bold uppercase tracking-wider text-foreground transition-colors hover:bg-foreground/10"
                    onClick={goPrevLightbox}
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <p className="font-mono text-[10px] text-theme-muted">
                    {lightboxIndex + 1} / {LIGHTBOX_ITEMS.length}
                  </p>
                  <button
                    type="button"
                    className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-sm border border-foreground/15 bg-background/90 px-3 font-mono text-[10px] font-bold uppercase tracking-wider text-foreground transition-colors hover:bg-foreground/10"
                    onClick={goNextLightbox}
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

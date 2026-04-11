"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Expand,
  ExternalLink,
  Search,
  Sparkles,
  Star,
  Timer,
  X,
} from "lucide-react";
import { Github } from "@/components/ui/Icons";
import { MagneticLink } from "@/components/ui/MagneticLink";
import { cn } from "@/lib/utils";

const STACK = [
  "Java",
  "JavaScript",
  "MySQL",
  "Tailwind CSS",
  "Chart.js",
  "REST API",
] as const;

const FEATURES = [
  {
    title: "Overdue signal automation",
    body: "Date-based routines flag overdue records and push status changes to staff views with no manual reconciliation.",
    icon: Timer,
  },
  {
    title: "Borrowing desk workflow",
    body: "Check-in, check-out, and hold transitions are grouped into one operator flow to avoid fragmented task switching.",
    icon: ClipboardList,
  },
  {
    title: "Catalog and search",
    body: "Book metadata and copy availability are searchable from a single index to accelerate inventory checks.",
    icon: Search,
  },
  {
    title: "Patron feedback loop",
    body: "Ratings and review history sit next to title records so quality signals are visible during curation.",
    icon: Star,
  },
] as const;

const GALLERY = [
  {
    src: "/projects/lbms/hero.webp",
    alt: "LBMS dashboard with catalog and borrowing summaries",
    caption: "Dashboard",
  },
  {
    src: "/projects/lbms/search.webp",
    alt: "Book lookup flow with search results",
    caption: "Book Search",
  },
  {
    src: "/projects/lbms/borrow.webp",
    alt: "Borrowing workflow interface for library operators",
    caption: "Borrowing Flow",
  },
  {
    src: "/projects/lbms/Announcement.webp",
    alt: "Announcement and notification area",
    caption: "Announcements",
  },
] as const;

const OPERATIONS = [
  "Reduced manual overdue tracking by centralizing date-based status checks in a single monitoring panel.",
  "Mapped circulation flow to match desk reality: quick scan, validate patron, complete transaction, update stock.",
  "Implemented reporting blocks for active loans, due-soon items, and long-overdue records to support daily standups.",
] as const;

const LINKS = {
  github: "#",
  live: "#",
} as const;

export function LbmsProjectPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goPrevLightbox = useCallback(() => {
    setLightboxIndex((i) => {
      if (i === null) return null;
      return (i - 1 + GALLERY.length) % GALLERY.length;
    });
  }, []);

  const goNextLightbox = useCallback(() => {
    setLightboxIndex((i) => {
      if (i === null) return null;
      return (i + 1) % GALLERY.length;
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
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeLightbox();
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrevLightbox();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNextLightbox();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeLightbox, goNextLightbox, goPrevLightbox, lightboxIndex]);

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".lbms-reveal", {
        y: 34,
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
      className="relative isolate w-full space-y-18 pb-24 pt-4 md:space-y-22 md:pt-8"
    >
      <div
        className="pointer-events-none absolute -top-32 left-[-6vw] right-[-6vw] -z-10 h-136 bg-[radial-gradient(circle_at_14%_20%,rgb(16_185_129/0.2),transparent_58%),radial-gradient(circle_at_86%_24%,rgb(13_148_136/0.2),transparent_50%),radial-gradient(circle_at_50%_100%,rgb(234_179_8/0.1),transparent_60%)]"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(8_14_16/0.05),transparent_32%),radial-gradient(circle_at_50%_0%,transparent_60%,rgb(2_6_23/0.22)_100%)]" />
      </div>

      <header className="lbms-reveal relative space-y-8 border border-emerald-500/35 bg-[linear-gradient(150deg,rgb(5_12_14/0.95),rgb(10_18_20/0.88))] p-[clamp(1.2rem,2.4vw,2rem)] shadow-[0_24px_84px_-52px_rgba(20,184,166,0.58),inset_0_1px_0_rgba(255,255,255,0.04)]">
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
          <div
            className="h-[0.22rem] w-30 bg-linear-to-r from-emerald-500/90 via-teal-500/45 to-transparent"
            aria-hidden
          />
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center border border-emerald-500/40 bg-emerald-500/18 px-2.5 py-1.5 font-mono text-[9px] font-bold leading-none tracking-[0.14em] text-emerald-200 uppercase">
              <BookOpen className="mr-1 inline h-3 w-3 opacity-90" strokeWidth={2} />
              USC Myeik
            </span>
            <span className="inline-flex items-center border border-amber-500/45 bg-amber-500/20 px-2.5 py-1.5 font-mono text-[9px] font-bold leading-none tracking-[0.14em] text-amber-200 uppercase">
              Operations archive
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="max-w-[17ch] font-sans text-[clamp(2.4rem,6.8vw,4.2rem)] font-black leading-[0.92] tracking-tight text-emerald-50">
              Library Management System
            </h1>
            <p className="max-w-3xl font-display text-[clamp(1.1rem,2.7vw,1.55rem)] italic leading-snug tracking-[-0.02em] text-emerald-50/90">
              A desk-first library operating layer for circulation, overdue control,
              catalog search, and staff reporting.
            </p>
          </div>

          <p className="max-w-3xl font-sans text-base leading-[1.75] text-slate-300 md:text-lg">
            Built as a school team project where I carried implementation across
            stack boundaries, this system focuses on practical librarian workflows:
            less spreadsheet juggling, clearer borrower visibility, and faster
            decisions under daily service pressure.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              className="inline-flex min-h-11 items-center gap-2 border border-emerald-500/55 bg-emerald-500/15 px-4 py-2.5 font-mono text-[10px] font-bold tracking-[0.16em] text-emerald-100 no-underline uppercase transition-colors hover:border-emerald-400/80 hover:bg-emerald-500/30"
              href={LINKS.github}
            >
              <Github className="h-3.5 w-3.5 opacity-90" />
              View code
            </a>
            <a
              className="inline-flex min-h-11 items-center gap-2 border border-slate-400/50 bg-slate-900/60 px-4 py-2.5 font-mono text-[10px] font-bold tracking-[0.16em] text-slate-100 no-underline uppercase transition-colors hover:border-slate-300/70 hover:bg-slate-800/70"
              href={LINKS.live}
            >
              <ExternalLink className="h-3.5 w-3.5 opacity-80" />
              Live demo
            </a>
          </div>
        </div>
      </header>

      <section className="lbms-reveal">
        <div className="border border-emerald-500/25 bg-linear-to-br from-[#060c0e]/95 to-[#021216]/80 shadow-[0_20px_80px_-50px_rgba(20,184,166,0.6)]">
          <button
            type="button"
            className="group block w-full cursor-pointer border-0 bg-transparent text-inherit"
            onClick={() => setLightboxIndex(0)}
            aria-label="Open LBMS dashboard screenshot full size"
          >
            <div className="relative aspect-21/9 w-full min-h-[180px] overflow-hidden bg-zinc-950/35 sm:min-h-[220px]">
              <Image
                src={GALLERY[0].src}
                alt={GALLERY[0].alt}
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, min(1280px, 92vw)"
                priority
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-slate-950/95 to-transparent sm:h-20" />
              <span className="pointer-events-none absolute right-3 top-3 rounded-sm bg-black/45 px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-emerald-50/95 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 sm:opacity-100">
                Click to expand
              </span>
            </div>
          </button>
        </div>
      </section>

      <section className="lbms-reveal grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
        <div className="space-y-3 lg:col-span-4">
          <p className="font-mono text-[10px] font-bold tracking-[0.24em] uppercase">
            Rollout
          </p>
          <p className="font-sans text-[clamp(2.5rem,6.2vw,4rem)] font-black leading-[0.9] tracking-[-0.04em]">
            4 Core
          </p>
          <p className="font-mono text-[11px] font-bold tracking-[0.16em] text-teal-600 uppercase dark:text-teal-300">
            Modules shipped
          </p>
          <p className="font-sans text-sm leading-relaxed text-theme-muted">
            Borrowing, catalog search, overdue handling, and staff announcements
            were delivered as one cohesive release so the desk team could adopt
            immediately.
          </p>
        </div>
        <div className="space-y-6 lg:col-span-8">
          <p className="font-mono text-[10px] font-bold tracking-[0.24em] uppercase">
            Context
          </p>
          <p className="font-sans text-lg leading-[1.75] text-foreground/95 md:text-xl">
            The challenge was operational, not just visual: librarian routines
            happen fast and errors compound quickly. LBMS was designed as a
            ledger-style control surface where inventory, patron movement, and
            due-date risk stay visible in one narrative.
          </p>
          <div className="border border-emerald-500/30 bg-linear-to-br from-emerald-50/95 to-emerald-100/85 p-[clamp(1rem,2vw,1.35rem)] dark:border-emerald-500/35 dark:from-[#060c0f]/95 dark:to-[#091114]/90">
            <p className="font-sans text-sm leading-[1.8] text-slate-800 dark:text-slate-300 md:text-[1.02rem]">
              Java and JavaScript covered application logic and interface behavior,
              MySQL kept circulation data traceable, and Tailwind accelerated UI
              delivery for role-specific screens under tight timelines.
            </p>
          </div>
        </div>
      </section>

      <section className="lbms-reveal space-y-8">
        <div>
          <p className="font-mono text-[10px] font-bold tracking-[0.24em] uppercase">
            Capability blocks
          </p>
          <h2 className="mt-2 font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Shift-ready feature set
          </h2>
        </div>
        <ul className="grid gap-4 md:grid-cols-2">
          {FEATURES.map((feature) => (
            <li
              key={feature.title}
              className="border border-emerald-500/25 bg-linear-to-br from-emerald-50/95 to-emerald-100/90 p-[clamp(1rem,2vw,1.25rem)] dark:border-emerald-500/30 dark:from-[#050c0e]/95 dark:to-[#0b1618]/90"
            >
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-emerald-400/35 bg-emerald-500/12 text-emerald-700 dark:border-emerald-300/30 dark:bg-emerald-500/10 dark:text-emerald-200">
                  <feature.icon className="h-4 w-4" strokeWidth={1.8} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-sans text-[1.05rem] font-bold leading-tight text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {feature.body}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="lbms-reveal space-y-8">
        <div>
          <p className="font-mono text-[10px] font-bold tracking-[0.24em] uppercase">
            Screens
          </p>
          <h2 className="mt-2 font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Workflow surfaces
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {GALLERY.map((item, index) => (
            <button
              key={item.src}
              type="button"
              className="group relative overflow-hidden border border-emerald-500/35 bg-[#02060a]/75 text-left"
              onClick={() => setLightboxIndex(index)}
              aria-label={`Open ${item.caption} screenshot full size`}
            >
              <div className="relative aspect-16/10">
                <Image
                  src={item.src}
                  alt=""
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 700px) 100vw, 50vw"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-linear-to-t from-slate-950/95 via-slate-950/60 to-transparent px-3 py-2.5">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-100">
                  {item.caption}
                </p>
                <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.18em] text-emerald-200/90">
                  <Expand className="h-3 w-3" />
                  Expand
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="lbms-reveal space-y-6">
        <div>
          <p className="font-mono text-[10px] font-bold tracking-[0.24em] uppercase">
            Stack
          </p>
          <h2 className="mt-2 font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Runtime and tooling
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {STACK.map((item) => (
            <span
              key={item}
              className="inline-flex items-center border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-2 font-mono text-[9px] font-bold leading-none tracking-[0.13em] "
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="lbms-reveal border border-emerald-300/26 bg-emerald-500/8 dark:bg-emerald-500/10 px-6 py-8 md:px-10 md:py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-12">
          <div className="shrink-0">
            <p className="font-mono text-[10px] font-bold tracking-[0.24em] ">
              Delivery notes
            </p>
            <h2 className="mt-2 max-w-xs font-sans text-xl font-bold tracking-tight text-foreground md:text-2xl">
              What improved desk operations
            </h2>
          </div>
          <ul className="max-w-2xl space-y-4 border-l-2 border-emerald-500/50 pl-4">
            {OPERATIONS.map((line) => (
              <li
                key={line}
                className="flex gap-2.5 text-[0.92rem] leading-[1.6]"
              >
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 " />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="lbms-reveal flex flex-col gap-5 border-t border-foreground/10 pt-12 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-mono text-[10px] font-bold tracking-[0.24em]">
            Repository and demo
          </p>
          <p className="mt-2 max-w-md font-sans text-sm text-theme-muted">
            Plug in your production links when available.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            className="inline-flex min-h-11 items-center gap-2 border border-emerald-500/55 bg-emerald-500/15 px-4 py-2.5 font-mono text-[10px] font-bold tracking-[0.16em]  no-underline uppercase transition-colors hover:border-emerald-400/80 hover:bg-emerald-500/30"
            href={LINKS.github}
          >
            <Github className="h-3.5 w-3.5 opacity-90" />
            View code
          </a>
          <a
            className="inline-flex min-h-11 items-center gap-2 border border-slate-400/50 bg-slate-900/60 px-4 py-2.5 font-mono text-[10px] font-bold tracking-[0.16em] text-slate-100 no-underline uppercase transition-colors hover:border-slate-300/70 hover:bg-slate-800/70"
            href={LINKS.live}
          >
            <ExternalLink className="h-3.5 w-3.5 opacity-80" />
            Live demo
          </a>
        </div>
      </section>

      {lightboxIndex !== null
        ? createPortal(
            <div
              className="fixed inset-0 z-998 flex items-center justify-center bg-[#02060a]/82 p-3 backdrop-blur-xs sm:p-6"
              role="dialog"
              aria-modal="true"
              aria-label={`Full size: ${GALLERY[lightboxIndex].caption}`}
              onClick={(event) => {
                if (event.target === event.currentTarget) closeLightbox();
              }}
            >
              <div
                className="flex max-h-[min(94dvh,920px)] w-full max-w-5xl flex-col gap-3"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex shrink-0 items-center justify-between gap-3">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-300">
                    {GALLERY[lightboxIndex].caption}
                  </p>
                  <button
                    type="button"
                    className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center border border-emerald-200/35 bg-slate-900/90 text-slate-100 transition-colors hover:bg-slate-800/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
                    onClick={closeLightbox}
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" strokeWidth={1.75} />
                  </button>
                </div>
                <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-auto border border-emerald-300/32 bg-zinc-950/75 p-2 shadow-[0_0_0_1px_rgba(0,0,0,0.2),0_24px_80px_-20px_rgba(0,0,0,0.65)] sm:p-4">
                  <Image
                    src={GALLERY[lightboxIndex].src}
                    alt={GALLERY[lightboxIndex].alt}
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
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm border border-emerald-200/35 bg-slate-900/90 px-3 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-100 transition-colors hover:bg-slate-800/90"
                    onClick={goPrevLightbox}
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <p className="font-mono text-[10px] text-slate-300">
                    {lightboxIndex + 1} / {GALLERY.length}
                  </p>
                  <button
                    type="button"
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm border border-emerald-200/35 bg-slate-900/90 px-3 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-100 transition-colors hover:bg-slate-800/90"
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

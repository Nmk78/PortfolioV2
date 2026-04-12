"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  Bot,
  ChevronLeft,
  ChevronRight,
  Database,
  ExternalLink,
  Globe,
  Network,
  Server,
  Shield,
  Sparkles,
  X,
} from "lucide-react";
import { Github } from "@/components/ui/Icons";
import { MagneticLink } from "@/components/ui/MagneticLink";
import { cn } from "@/lib/utils";
import { externalLinkProps } from "@/lib/url";

const STACK: readonly string[] = [
  "Python",
  "FastAPI",
  "LangChain",
  "Gemini",
  "Docker",
  "Milvus",
  "MongoDB",
  "Next.js",
  "Expo",
  "Telegram",
];

const PILLARS = [
  {
    title: "Threat-aware answer engine",
    body: "FastAPI + LangChain + Gemini with Milvus retrieval keeps responses grounded in approved cybersecurity references.",
    icon: Server,
  },
  {
    title: "Shared memory layer",
    body: "MongoDB threads and vector-backed context make every client continue the same conversation without drift.",
    icon: Database,
  },
  {
    title: "Operator command surface",
    body: "Dashboard controls for source curation, upload governance, and session visibility during live usage peaks.",
    icon: Shield,
  },
  {
    title: "Multi-channel parity",
    body: "Web, Telegram, and Android all call the same orchestration path so guidance quality stays consistent.",
    icon: Network,
  },
] as const;

const CAPABILITIES = [
  "One retrieval brain powers every channel, reducing inconsistent guidance.",
  "Ops dashboard supports source management and run-time observability.",
  "Multimodal pipeline supports text, file, and voice-driven prompts.",
  "Dockerized services simplify deployment and handover for team environments.",
  "Session continuity preserves context across web, Telegram, and mobile clients.",
  "Grounded answers prioritize actionable steps over generic AI responses.",
] as const;

const BENTO = [
  {
    src: "/projects/pivot/web-chat.webp",
    alt: "Pivot web chat",
    caption: "Public web chat",
    className:
      "col-span-12 min-h-[220px] sm:min-h-[260px] lg:col-span-8 lg:row-span-2 lg:min-h-[320px]",
  },
  {
    src: "/projects/pivot/dashboard.webp",
    alt: "Admin dashboard",
    caption: "Admin & monitoring",
    className: "col-span-12 sm:col-span-6 lg:col-span-4",
  },
  {
    src: "/projects/pivot/telegram.webp",
    alt: "Telegram bot",
    caption: "Telegram",
    className: "col-span-12 sm:col-span-6 lg:col-span-4",
  },
  {
    src: "/projects/pivot/app.webp",
    alt: "Android app",
    caption: "Android · Expo",
    className: "col-span-12 sm:col-span-6 lg:col-span-4",
  },
  {
    src: "/projects/pivot/sessions.webp",
    alt: "Sessions",
    caption: "Sessions",
    className: "col-span-12 sm:col-span-6 lg:col-span-4",
  },
  {
    src: "/projects/pivot/system.webp",
    alt: "System architecture",
    caption: "Architecture",
    className: "col-span-12 lg:col-span-4",
  },
] as const;

const TEAM = [
  "Aung Thura Kyaw",
  "Min Han Satt Naing",
  "Zarni Maung",
  "Kyaw Maung Maung Thu",
] as const;

const STORY_BEATS = [
  {
    title: "Scenario mapping",
    body: "Mapped the highest-frequency SME attack patterns to define response depth and escalation paths.",
  },
  {
    title: "Operational console",
    body: "Shipped admin tooling to approve sources, monitor active sessions, and control answer context.",
  },
  {
    title: "Cross-channel rollout",
    body: "Deployed the same model behavior to web, Telegram, and Android with one orchestration contract.",
  },
] as const;

const PIPELINE = [
  {
    label: "Ingest",
    body: "Collect prompts from web, Telegram, and Android clients with unified request shaping.",
  },
  {
    label: "Retrieve",
    body: "Match vectors and policy docs from Milvus + MongoDB memory to ground each response.",
  },
  {
    label: "Reason",
    body: "Run Gemini through LangChain orchestration with guardrails tuned for cyber incident guidance.",
  },
  {
    label: "Respond",
    body: "Return actionable steps to every channel while preserving thread context and operator visibility.",
  },
] as const;

const METRICS = [
  { label: "Recognition", value: "Top 10", note: "APT YPS 2025 shortlist", icon: Award },
  { label: "Client surfaces", value: "3", note: "Web, Telegram, Android", icon: Globe },
  { label: "Core mode", value: "RAG", note: "FastAPI + LangChain + Gemini", icon: Bot },
] as const;

const GALLERY_IMAGES = [
  {
    src: "/projects/pivot/app-mockup.webp",
    alt: "Pivot across web, mobile, and messaging",
    caption: "Pivot across clients",
  },
  ...BENTO,
] as const;

const TEAM_IMAGE = {
  src: "/projects/pivot/team.webp",
  alt: "Pivot team",
  caption: "Pivot team",
} as const;

const LINK_PLACEHOLDER = "#";

export function PivotProjectPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const galleryIndexBySrc = useMemo(
    () => new Map(GALLERY_IMAGES.map((item, index) => [item.src, index])),
    []
  );
  const activeImage =
    activeImageIndex === null ? null : GALLERY_IMAGES[activeImageIndex];

  function openImage(src: (typeof GALLERY_IMAGES)[number]["src"]) {
    const index = galleryIndexBySrc.get(src);
    if (index !== undefined) setActiveImageIndex(index);
  }

  function closeImage() {
    setActiveImageIndex(null);
  }

  const shiftImage = useCallback((step: number) => {
    setActiveImageIndex((previousIndex) => {
      if (previousIndex === null) return previousIndex;
      return (
        (previousIndex + step + GALLERY_IMAGES.length) % GALLERY_IMAGES.length
      );
    });
  }, []);

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".pivot-reveal", {
        y: 36,
        opacity: 0,
        duration: 1,
        stagger: 0.06,
        ease: "expo.out",
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (activeImageIndex === null) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeImage();
      if (event.key === "ArrowLeft") shiftImage(-1);
      if (event.key === "ArrowRight") shiftImage(1);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeImageIndex, shiftImage]);

  useEffect(() => {
    if (activeImageIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeImageIndex]);

  return (
    <div
      ref={rootRef}
      className="relative w-full space-y-20 pb-28 pt-4 md:space-y-24 md:pt-8"
    >
      <div aria-hidden className="pointer-events-none absolute -inset-x-6 -top-12 h-[min(38rem,112vh)] overflow-hidden rounded-b-sm lg:-inset-x-12 lg:-top-16">
        <div className="absolute inset-0 bg-[linear-gradient(170deg,rgba(8,47,73,0.12),transparent_40%),linear-gradient(8deg,rgba(2,132,199,0.1),transparent_52%)] dark:bg-[linear-gradient(170deg,rgba(8,47,73,0.12),transparent_40%),linear-gradient(8deg,rgba(2,132,199,0.1),transparent_52%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(125,211,252,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,0.08)_1px,transparent_1px)] bg-size-[34px_34px] opacity-55 mask-[radial-gradient(ellipse_80%_70%_at_50%_28%,black_24%,transparent_75%)] dark:opacity-45" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background" />
      </div>

      <header className="pivot-reveal relative z-10 space-y-10">
        <MagneticLink className="inline-block w-fit">
          <Link
            href="/projects"
            className="hover-target inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-theme-subtle transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 opacity-70" />
            All projects
          </Link>
        </MagneticLink>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,360px)] lg:items-start">
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center rounded-sm border border-cyan-500/25 bg-cyan-500/8 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] ">APT YPS 2025</span>
              <span className="inline-flex items-center rounded-sm border border-cyan-500/25 bg-cyan-500/8 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] ">Ops dossier</span>
              <span className="inline-flex items-center rounded-sm border border-cyan-500/35 bg-cyan-500/12 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] ">
                <Award className="mr-1 inline h-3 w-3 opacity-90" strokeWidth={2} />
                Top 10 national
              </span>
            </div>

            <div className="space-y-5 border border-cyan-400/16 bg-cyan-500/3 p-6">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] ">
                Case file: pivot / cyber defense assistant
              </p>
              <h1
                className="max-w-[14ch] font-sans text-[clamp(2.75rem,8vw,4.5rem)] font-black leading-[0.92] tracking-tighter text-foreground"
                style={{ fontFeatureSettings: '"ss01"' }}
              >
                Pivot
              </h1>
              <p className="max-w-2xl font-display text-[clamp(1.35rem,3.2vw,1.85rem)] italic leading-snug tracking-[-0.02em] text-foreground/88">
                Multiplatform cybersecurity co-pilot for SMEs and startup teams
              </p>
              <p className="max-w-3xl font-sans text-base leading-[1.75] text-theme-muted md:text-lg">
                Pivot reframes security guidance as an operational conversation. Teams can
                ask from whichever channel they already use and still receive grounded,
                context-aware answers from one retrieval core.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <a
                className="inline-flex items-center gap-2 rounded-sm border border-cyan-400/45 bg-cyan-500/14 px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-cyan-400/65 hover:bg-cyan-500/20"
                href={LINK_PLACEHOLDER}
                {...externalLinkProps(LINK_PLACEHOLDER)}
              >
                <Github className="h-3.5 w-3.5 opacity-90" />
                View code
              </a>
              <a
                className="inline-flex items-center gap-2 rounded-sm border border-foreground/20 bg-background/65 px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-cyan-500/35 hover:bg-cyan-500/8"
                href={LINK_PLACEHOLDER}
                {...externalLinkProps(LINK_PLACEHOLDER)}
              >
                <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                Live demo
              </a>
            </div>
          </div>

          <aside className="border border-cyan-400/20 bg-cyan-500/4 p-5">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] ">Mission profile</p>
            <h2 className="mt-3 font-sans text-lg font-semibold tracking-tight text-foreground md:text-xl">
              Security guidance where operators already work
            </h2>
            <ul className="mt-5 space-y-3">
              {STORY_BEATS.map((beat, index) => (
                <li
                  key={beat.title}
                  className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3"
                >
                  <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center border border-cyan-400/35 bg-cyan-500/14 font-mono text-[10px] font-bold tracking-[0.12em] text-cyan-800 dark:text-cyan-100">
                    0{index + 1}
                  </span>
                  <div>
                    <p className="font-sans text-sm font-semibold text-foreground">
                      {beat.title}
                    </p>
                    <p className="mt-1 font-sans text-sm leading-relaxed text-theme-muted">
                      {beat.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </header>

      <section className="pivot-reveal">
        <div className="relative overflow-hidden border border-cyan-400/20 shadow-[0_22px_56px_-34px_rgba(2,132,199,0.5)]">
          <button
            type="button"
            className="relative block aspect-2/1 min-h-[200px] w-full overflow-hidden md:aspect-21/9"
            onClick={() => openImage("/projects/pivot/system.webp")}
            aria-label="Open Pivot system architecture image"
          >
            <Image
              src="/projects/pivot/system.webp"
              alt="Pivot system architecture"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, min(1280px, 92vw)"
              priority
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-background/90 to-transparent" />
            <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 border border-cyan-200/30 bg-slate-950/70 px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-100">
              <Shield className="h-3 w-3" />
              Live command interface
            </div>
          </button>
        </div>
      </section>

      <section className="pivot-reveal grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-10">
        <div className="space-y-5 lg:col-span-5">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] ">Outcome snapshot</p>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {METRICS.map((metric) => (
              <div
                key={metric.label}
                className="border border-cyan-400/20 bg-cyan-500/4 px-4 py-3"
              >
                <p className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] ">
                  <metric.icon className="h-3.5 w-3.5" />
                  {metric.label}
                </p>
                <p className="mt-2 font-sans text-2xl font-bold tracking-tight text-foreground">
                  {metric.value}
                </p>
                <p className="mt-1 text-xs text-theme-muted">{metric.note}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6 lg:col-span-7">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] ">Brief</p>
          <p className="font-sans text-lg leading-[1.75] text-foreground/95 md:text-xl">
            Built to raise cybersecurity awareness, improve data-protection posture,
            and reduce phishing risk for SMEs and startups. Everything routes
            through a single Python RAG core so policies, docs, and conversation
            history stay aligned—whether someone chats on the web, Telegram, or the
            Android app.
          </p>
          <p className="font-sans text-base leading-[1.75] text-theme-muted md:text-[1.05rem]">
            FastAPI and LangChain orchestrate retrieval; Gemini generates answers;
            Milvus (Zilliz) holds vectors; MongoDB stores profiles, threads, and
            metadata. Next.js covers the public UI and operator dashboard; Expo
            delivers mobile; the Telegram bot meets users where they already work.
          </p>
        </div>
      </section>

      <section className="pivot-reveal space-y-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] ">Response pipeline</p>
            <h2 className="mt-2 font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              How Pivot turns questions into actionable guidance
            </h2>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {PIPELINE.map((stage, index) => (
            <article
              key={stage.label}
              className="border border-cyan-400/20 bg-cyan-500/3 p-4"
            >
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] ">
                0{index + 1}
              </p>
              <h3 className="mt-2 font-sans text-lg font-semibold text-foreground">
                {stage.label}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-theme-muted">{stage.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pivot-reveal space-y-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] ">System architecture</p>
            <h2 className="mt-2 font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              One operational core, multiple client fronts
            </h2>
          </div>
          <p className="max-w-md font-mono text-[11px] leading-relaxed text-theme-muted">
            Retrieval, safety, and session memory stay consistent while each surface fits its context.
          </p>
        </div>
        <ul className="grid gap-5 md:grid-cols-2">
          {PILLARS.map((p) => (
            <li
              key={p.title}
              className="relative border border-cyan-400/20 bg-cyan-500/4 p-6 before:absolute before:left-0 before:right-0 before:top-0 before:h-[2px] before:bg-cyan-500/70"
            >
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-cyan-400/35 bg-cyan-500/12 text-cyan-800 dark:text-cyan-200/95">
                  <p.icon className="h-4 w-4 text-cyan-800" strokeWidth={1.75} />
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

      <section className="pivot-reveal space-y-8">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] ">Image archive</p>
          <h2 className="mt-2 font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            All project images
          </h2>
        </div>
        <div className="grid grid-cols-12 gap-3 sm:gap-4">
          {GALLERY_IMAGES.map((item, index) => (
            <button
              key={`${item.src}-archive`}
              type="button"
              className={cn(
                "group/archive col-span-12 overflow-hidden border border-cyan-400/20 bg-cyan-500/2 text-left",
                index === 0 && "lg:col-span-8",
                index > 0 && index < 5 && "sm:col-span-6 lg:col-span-4",
                index >= 5 && "sm:col-span-6"
              )}
              onClick={() => openImage(item.src)}
              aria-label={`Open ${item.caption} image full size`}
            >
              <div className="relative aspect-video">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover object-top transition-transform duration-500 ease-out group-hover/archive:scale-[1.02]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="border-t border-cyan-400/20 bg-slate-950/72 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-100 dark:bg-slate-950/72">
                {item.caption}
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="pivot-reveal space-y-6">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] ">Stack</p>
          <h2 className="mt-2 font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Tools &amp; services
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {STACK.map((label) => (
            <span
              key={label}
              className="inline-flex items-center rounded-sm border border-cyan-500/25 bg-cyan-500/8 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] "
            >
              {label}
            </span>
          ))}
        </div>
      </section>

      <section className="pivot-reveal border border-cyan-300/16 bg-cyan-500/3 px-6 py-8 md:px-10 md:py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-12">
          <div className="shrink-0">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] ">Operational value</p>
            <h2 className="mt-2 max-w-xs font-sans text-xl font-bold tracking-tight text-foreground md:text-2xl">
              Capabilities that moved the needle for teams
            </h2>
          </div>
          <div className="grid max-w-3xl gap-3 sm:grid-cols-2">
            {CAPABILITIES.map((line) => (
              <div
                key={line}
                className="flex gap-3 border border-cyan-500/22 bg-cyan-500/5 px-4 py-3 text-sm leading-relaxed text-theme-muted"
              >
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500/80 dark:text-cyan-400/75" />
                <span>{line}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pivot-reveal space-y-8">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] ">Team</p>
          <h2 className="mt-2 font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Credits
          </h2>
        </div>
        <div className="relative min-h-[200px] overflow-hidden border border-cyan-400/20 bg-cyan-500/3 md:min-h-[280px]">
          <Image
            src={TEAM_IMAGE.src}
            alt={TEAM_IMAGE.alt}
            fill
            className="object-contain object-center"
            sizes="(max-width: 768px) 100vw, min(1200px, 92vw)"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-background/95 via-background/45 to-transparent p-6 md:p-8">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-theme-subtle">
              With thanks to
            </p>
            <p className="mt-3 max-w-2xl font-sans text-base font-medium leading-snug text-foreground md:text-lg">
              {TEAM.join(" · ")}
            </p>
          </div>
        </div>
      </section>

      <section className="pivot-reveal flex flex-col gap-5 border-t border-foreground/10 pt-12 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] ">Repository &amp; demo</p>
          <p className="mt-2 max-w-md font-sans text-sm text-theme-muted">
            Wire up real URLs when the repo and deployment are public—placeholders
            for now.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            className="inline-flex items-center gap-2 rounded-sm border border-cyan-400/45 bg-cyan-500/14 px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-cyan-400/65 hover:bg-cyan-500/20"
            href={LINK_PLACEHOLDER}
            {...externalLinkProps(LINK_PLACEHOLDER)}
          >
            <Github className="h-3.5 w-3.5 opacity-90" />
            View code
          </a>
          <a
            className="inline-flex items-center gap-2 rounded-sm border border-foreground/20 bg-background/65 px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-cyan-500/35 hover:bg-cyan-500/8"
            href={LINK_PLACEHOLDER}
            {...externalLinkProps(LINK_PLACEHOLDER)}
          >
            <ExternalLink className="h-3.5 w-3.5 opacity-80" />
            Live demo
          </a>
        </div>
      </section>

      {activeImage ? (
        <div
          className="fixed inset-0 z-80 grid place-items-center bg-slate-950/88 p-5 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={activeImage.alt}
          onClick={closeImage}
        >
          <button
            type="button"
            className="fixed right-4 top-4 inline-flex h-9 w-9 items-center justify-center border border-cyan-400/35 bg-slate-950/80 text-cyan-100 transition-colors hover:bg-slate-900"
            onClick={closeImage}
            aria-label="Close image popup"
          >
            <X className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="fixed left-4 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-cyan-400/35 bg-slate-950/80 text-cyan-100 transition-colors hover:bg-slate-900 md:bottom-4 md:top-auto md:translate-y-0"
            onClick={(event) => {
              event.stopPropagation();
              shiftImage(-1);
            }}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="fixed right-4 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center border border-cyan-400/35 bg-slate-950/80 text-cyan-100 transition-colors hover:bg-slate-900 md:bottom-4 md:top-auto md:translate-y-0"
            onClick={(event) => {
              event.stopPropagation();
              shiftImage(1);
            }}
            aria-label="Next image"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div
            className="w-full max-w-6xl border border-cyan-400/30 bg-slate-950/78 p-3"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative aspect-video w-full overflow-hidden">
              <Image
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                className="object-contain bg-[#05070d]"
                sizes="100vw"
              />
            </div>
            <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-100/88">
              {activeImage.caption}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

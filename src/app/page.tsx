"use client";

import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Quote, Send, Volume2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { MagneticLink } from "@/components/ui/MagneticLink";
import { PixelRevealPortrait } from "@/components/ui/PixelRevealPortrait";
import { useEmployerMode } from "@/components/ui/employer-mode-provider";
import { StoryPathSection } from "@/components/sections/story-path-section";
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

function HeroInlineSegments({ segments }: { segments: readonly HeroSegment[] }) {
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
        )
      )}
    </>
  );
}

export default function Home() {
  const { isEmployerMode, setEmployerMode } = useEmployerMode();
  const [chatInput, setChatInput] = useState("");
  const [jdInput, setJdInput] = useState("");
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [isDockExpanded, setIsDockExpanded] = useState(false);
  const chatDockRootRef = useRef<HTMLDivElement>(null);
  const chatComposerRef = useRef<HTMLTextAreaElement>(null);
  const [selectedHighlightSkills, setSelectedHighlightSkills] = useState<string[]>([]);
  const [selectedAnalysisTypes, setSelectedAnalysisTypes] = useState<string[]>([]);
  const nameAudioRef = useRef<HTMLAudioElement | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    {
      role: "assistant",
      content: "Hi! Quick questions in Normal mode, or switch to Recruiter to paste a JD and run a match preview.",
    },
  ]);

  const highlightSkillOptions = useMemo(
    () => ["React", "Next.js", "TypeScript", "Fullstack", "Performance", "Accessibility"],
    []
  );
  const analysisTypeOptions = useMemo(
    () => ["Match Analysis", "Key Strengths", "Impact Metrics", "Relevant Work"],
    []
  );

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

  function toggleHighlightSkill(skill: string) {
    setSelectedHighlightSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  }

  function toggleAnalysisType(label: string) {
    setSelectedAnalysisTypes((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  }
  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>(".scroll-shrink-item"));
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
        const visibleHeight = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
        const baseHeight = Math.max(1, Math.min(rect.height, viewportHeight));
        const visibilityRatio = Math.max(0, Math.min(1, visibleHeight / baseHeight));
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
      quote: "Nay shipped the interface refresh quickly and made it feel much more premium without bloating the app.",
      author: "Product Lead",
      role: "SaaS Platform",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&h=160&q=80",
      profileUrl: "https://www.linkedin.com/",
      profileLabel: "LinkedIn",
    },
    {
      quote: "Strong balance between code quality and UI detail. Communication was clear and implementation was reliable.",
      author: "Engineering Manager",
      role: "Startup Team",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80",
      profileUrl: "https://www.linkedin.com/",
      profileLabel: "Portfolio",
    },
    {
      quote: "Great execution on responsive behavior and performance. The UX got cleaner and much easier to use.",
      author: "Client",
      role: "Portfolio Project",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&h=160&q=80",
      profileUrl: "https://www.linkedin.com/",
      profileLabel: "Profile",
    }
  ];

  const recruiterSkillKeywords = useMemo(
    () => [
      "react",
      "next.js",
      "nextjs",
      "typescript",
      "javascript",
      "node.js",
      "node",
      "tailwind",
      "css",
      "api",
      "postgresql",
      "mongodb",
      "supabase",
      "convex",
      "accessibility",
      "performance",
      "testing",
      "jest",
      "playwright",
      "docker",
      "aws",
      "firebase",
      "expo",
      "react native",
      "mobile",
    ],
    []
  );

  const jdMatch = useMemo(() => {
    const normalized = jdInput.toLowerCase();
    if (!normalized.trim()) return null;
    const matched = recruiterSkillKeywords.filter((skill) => normalized.includes(skill));
    const missing = recruiterSkillKeywords.filter((skill) => !normalized.includes(skill));
    const score = Math.round((matched.length / recruiterSkillKeywords.length) * 100);
    return { matched, missing, score };
  }, [jdInput, recruiterSkillKeywords]);

  const timelineByYear = useMemo(() => {
    const grouped = new Map<string, Array<(typeof timelineItems)[number]>>();
    for (const item of timelineItems) {
      const yearKey = item.timeFrame.split(" - ")[0];
      const prev = grouped.get(yearKey);
      if (prev) grouped.set(yearKey, [...prev, item]);
      else grouped.set(yearKey, [item]);
    }
    return Array.from(grouped.entries()).map(([year, items]) => ({ year, items }));
  }, []);

  async function submitChatMessage() {
    const prompt = chatInput.trim();
    if (!prompt || isSendingChat) return;

    setChatMessages((prev) => [...prev, { role: "user", content: prompt }]);
    setChatInput("");
    setIsSendingChat(true);

    try {
      const response = await fetch("/api/rag/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });
      if (!response.ok) throw new Error("RAG API unavailable");
      const data = (await response.json()) as { reply?: string };
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply?.trim() || "RAG endpoint connected but no reply returned.",
        },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: "RAG API is not connected yet. Endpoint contract: /api/rag/chat." },
      ]);
    } finally {
      setIsSendingChat(false);
    }
  }

  function handleBottomFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isEmployerMode) return;
    void submitChatMessage();
  }

  function handleBottomInputKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (isEmployerMode) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void submitChatMessage();
    }
  }

  function handleJdAnalyze() {
    const jd = jdInput.trim();
    if (!jd) return;
    if (!jdMatch) return;
    const skillsNote =
      selectedHighlightSkills.length > 0 ? `Highlighted skills: ${selectedHighlightSkills.join(", ")}. ` : "";
    const analysisNote =
      selectedAnalysisTypes.length > 0 ? `Analysis focus: ${selectedAnalysisTypes.join(", ")}. ` : "";
    setChatMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: `${skillsNote}${analysisNote}Analyze this JD:\n${jd.slice(0, 220)}${jd.length > 220 ? "..." : ""}`,
      },
      {
        role: "assistant",
        content: `Match score ${jdMatch.score}%. Matched: ${jdMatch.matched.slice(0, 8).join(", ") || "none"}. Potential gaps: ${jdMatch.missing.slice(0, 6).join(", ") || "none"}.`,
      },
    ]);
  }

  return (
    <div
      className={`w-full texture-dots space-y-8 pb-36 md:space-y-10 md:pb-44 ${isEmployerMode ? "employer-mode-surface" : ""}`}
    >
      <section className="scroll-shrink-section relative  rounded-3xl border-0 border-foreground/10 px-6 py-6 md:px-10 md:py-9">
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:items-center">
          <div className="scroll-shrink-item space-y-5 md:space-y-6">
            <div className="inline-flex items-center gap-3 cursor-drag">
              {/* <span className="inline-block min-h-9 rounded-full border border-primary/30 bg-primary/10 px-4 py-2.5 font-mono text-xs font-bold tracking-[0.24em] text-primary uppercase transition-ui">
                {isEmployerMode ? heroEmployer.badge : heroNormal.badge}
              </span> */}
            </div>
            {isEmployerMode ? (
              <>
                <h1 className="text-5xl leading-[0.92] font-black tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl text-pretty">
              {heroEmployer.lead}
            </h1>
              <div className="flex flex-wrap relative items-center gap-2 sm:gap-3">
                <h1 className="group/roll text-4xl leading-[0.92] font-black tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-pretty">
                  <span className="inline-block h-[1em] overflow-hidden align-baseline">
                    <span className="flex flex-col bg-linear-to-r from-foreground to-primary bg-clip-text text-transparent transition-transform duration-(--duration-ui-slow) ease-(--ease-ui) group-hover/roll:-translate-y-1/2">
                      <span className="leading-none">Nay Myo Khant</span>
                      <span className="leading-none">Marcus</span>
                    </span>
                  </span>
                </h1>
                <button
                  type="button"
                  onClick={playNamePronunciation}
                  className="group absolute -right-5 top-0 inline-flex min-h-10 min-w-10 items-center justify-center rounded-full text-theme-muted transition-ui hover:border-primary/45 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label="Play name pronunciation"
                >
                  <Volume2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              </>
            ) : (
              <>
                <h1 className="text-5xl leading-[0.92] font-black tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl text-pretty">
                  {heroNormal.lead}
                </h1>
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 relative">
                  <span className="group/roll block text-4xl leading-[0.92] font-black tracking-tighter sm:text-6xl md:text-6xl lg:text-7xl text-pretty">
                    <span className="inline-block h-[1em] overflow-hidden align-baseline">
                      <span className="flex flex-col bg-linear-to-r from-foreground to-primary bg-clip-text text-transparent transition-transform duration-(--duration-ui-slow) ease-(--ease-ui) group-hover/roll:-translate-y-1/2">
                        <span className="leading-none">Nay Myo Khant</span>
                        <span className="leading-none">Marcus</span>
                      </span>
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={playNamePronunciation}
                    className="group absolute -right-5 top-0 inline-flex min-h-10 min-w-10 items-center justify-center rounded-full text-theme-muted transition-ui hover:border-primary/45 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label="Play name pronunciation"
                  >
                    <Volume2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </>
            )}

            {isEmployerMode ? (
              <p className="max-w-xl font-mono text-[13px] leading-relaxed tracking-tight text-theme-muted md:text-sm">
                <HeroInlineSegments segments={heroEmployer.metaLine} />
              </p>
            ) : null}

            {!isEmployerMode ? (
              // <p
              //   className="max-w-xl text-pretty text-lg leading-snug text-foreground md:text-xl md:leading-snug"
              // >
              <p className="max-w-xl font-mono text-[13px] leading-relaxed tracking-tight text-theme-muted md:text-sm">

                <HeroInlineSegments segments={heroNormal.summaryLead} />
              </p>
            ) : null}
            <div className="hidden md:flex flex-col gap-4 sm:flex-row ">
              <MagneticLink>
                <Link
                  href="/contact"
                  className="min-h-10 rounded-full bg-foreground px-5 py-2.5 font-bold text-background transition-ui hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Download CV
                </Link>
              </MagneticLink>
              {/* <MagneticLink>
                <Link
                  href="/projects"
                  className="min-h-12 rounded-full border border-foreground/20 px-8 py-4 font-bold text-foreground transition-ui hover:border-foreground/40 hover:bg-foreground/5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  View Projects
                </Link>
              </MagneticLink> */}
            </div>
          </div>

          <div className="scroll-shrink-item flex w-full flex-col items-center justify-center lg:-mt-2">
            <div className="relative w-full max-w-[min(100%,26rem)] sm:max-w-md md:max-w-lg lg:max-w-none lg:translate-y-[-4%]">
              <PixelRevealPortrait
                src="/potrait.svg"
                alt="Stylized portrait artwork of Nay Myo Khant"
                width={720}
                height={900}
                priority
                className="w-full scale-90"
              />

            </div>
            <div className="flex flex-col md:hidden gap-4 sm:flex-row absolute bottom-15 md:bottom-10">
              <MagneticLink>
                <Link
                  href="/contact"
                  className="min-h-8 rounded-full bg-foreground px-4 py-2 font-bold text-background transition-ui hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Download CV
                </Link>
              </MagneticLink>
              {/* <MagneticLink>
                <Link
                  href="/projects"
                  className="min-h-12 rounded-full border border-foreground/20 px-8 py-4 font-bold text-foreground transition-ui hover:border-foreground/40 hover:bg-foreground/5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  View Projects
                </Link>
              </MagneticLink> */}
            </div>
          </div>
        </div>
      </section>

      {!isEmployerMode ? <StoryPathSection /> : null}

      <section className="scroll-shrink-section rounded-3xl border-0 border-foreground/10 p-6 md:p-10">
        <h2 className="text-3xl font-black tracking-tight md:text-5xl">Tech Stacks</h2>
        <p className="text-theme-muted mt-3 max-w-xl text-sm md:text-base">Tools I actually ship with.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {techStacks.map((stack) => (
            <span
              key={stack}
              className="text-theme-muted inline-flex min-h-11 items-center rounded-full border border-foreground/15 bg-foreground/3 px-4 py-2 font-sans text-sm font-semibold transition-ui hover:border-foreground/30 hover:bg-foreground/6"
            >
              {stack}
            </span>
          ))}
        </div>
      </section>

      <section className="scroll-shrink-section  rounded-3xl border-0 border-foreground/10 p-6 md:p-10">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="text-3xl font-black tracking-tight md:text-5xl">What I Bring</h2>
          {/* <p className="text-theme-muted max-w-xl">Beyond visuals: maintainable systems, performance-first UX, and shipping discipline from concept to production.</p> */}
        </div>
        <div className="grid gap-0 md:grid-cols-3">
          {valueProps.map((item) => (
            <article
              key={item.title}
              className="scroll-shrink-item space-y-4 p-6 transition-ui md:p-8 hover:bg-foreground/2"
            >
              <h3 className="text-xl font-bold tracking-tight">{item.title}</h3>
              <p className="text-theme-muted leading-relaxed">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* <section className="scroll-shrink-section grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="scroll-shrink-item rounded-3xl border border-foreground/10 p-6 md:p-10">
          <h2 className="text-3xl font-black tracking-tight md:text-5xl">Selected Capabilities</h2>
          <ul className="mt-8 space-y-6">
            {[
              "Next.js and React architecture for production-grade apps",
              "Design systems with consistent tokens and reusable patterns",
              "Interactive UI design with accessibility-first implementation",
              "Performance audits and practical Core Web Vitals improvements",
              "Clean handoff and documentation for long-term maintainability",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                <span className="text-theme-muted">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="scroll-shrink-item  rounded-3xl border border-foreground/10 p-6 md:p-10">
          <p className="text-xs font-bold tracking-[0.22em] text-primary uppercase">Currently</p>
          <h3 className="mt-3 text-2xl font-black tracking-tight md:text-3xl text-pretty">Exploring advanced interface motion with strong accessibility defaults.</h3>
          <p className="text-theme-muted mt-5 leading-relaxed">
            I am refining transitions, feedback loops, and interaction patterns that feel premium while remaining lightweight and inclusive.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 font-bold text-primary transition-colors duration-200 hover:text-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Let&apos;s build together <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </aside>
      </section> */}


      <section className="scroll-shrink-section relative overflow-hidden rounded-3xl border-0 border-foreground/10 p-6 md:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-100"
          style={{
            backgroundImage:
              "radial-gradient(circle at 16% 18%, rgba(255,255,255,0.06), transparent 44%), radial-gradient(circle at 82% 14%, rgba(59,130,246,0.08), transparent 34%), radial-gradient(circle at 68% 80%, rgba(255,255,255,0.035), transparent 40%), linear-gradient(to bottom, rgba(255,255,255,0.02), transparent 24%)",
          }}
        />

        <div className="mb-8 md:mb-10">
          <h2 className="font-display text-[clamp(1.8rem,4.2vw,3rem)] font-medium tracking-tight text-foreground">Experience</h2>
        </div>

        <div className="relative">
          <div id="timeline-line" className="pointer-events-none absolute left-[4.4rem] top-1 h-[calc(100%-0.5rem)] w-px bg-foreground/16 md:left-[5.8rem]" />

          <div className="space-y-8 md:space-y-9">
            {timelineByYear.map(({ year, items }) => (
              <div key={year} className="grid grid-cols-[3.9rem_1fr] gap-x-5 md:grid-cols-[5.2rem_1fr] md:gap-x-8">
                <div className="text-right">
                  <p className="font-mono text-[1.9rem] leading-none tracking-[-0.02em] text-foreground/55 md:text-[2.2rem]">{year}</p>
                </div>

                <div className="space-y-4 md:space-y-5">
                  {items.map((item) => (
                    <article
                      key={`${item.title}-${item.company}-${item.timeFrame}`}
                      className="scroll-shrink-item group relative pl-4 md:pl-5"
                    >
                      <span id="timeline-dot" className="absolute -left-[1.1rem] top-2 h-3 w-3 rounded-full bg-foreground/35 transition-ui group-hover:bg-foreground/65 md:-left-[1.78rem]" />

                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-[1.06rem] font-semibold tracking-tight text-foreground md:text-[1.16rem]">{item.title}</h3>
                        <p className="shrink-0 font-mono text-[10px] tracking-[0.12em] text-primary/80 md:text-[11px]">
                          {item.timeFrame}
                        </p>
                      </div>

                      <p className="mt-0.5 font-mono text-[10px] tracking-widest text-theme-subtle underline decoration-foreground/25 underline-offset-[3px] md:text-[11px]">
                        {item.company}
                      </p>
                      <p className="text-theme-muted mt-2.5 max-w-[74ch] text-[0.97rem] leading-relaxed md:text-base">{item.description}</p>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {!isEmployerMode ? (
        <section className="scroll-shrink-section  rounded-3xl border-0 border-foreground/10 p-6">
          <div className="mb-8 flex items-center gap-3">
            <Quote className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="text-3xl font-black tracking-tight md:text-5xl">Testimonials</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((item) => (
              <article
                key={item.author + item.role}
                className="scroll-shrink-item rounded-2xl border border-foreground/10 bg-background/70 p-6 transition-ui hover:border-foreground/18"
              >
                <p className="text-theme-muted leading-relaxed">&ldquo;{item.quote}&rdquo;</p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Image
                      src={item.avatar}
                      alt={`${item.author} profile`}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover ring-1 ring-foreground/15"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-foreground">{item.author}</p>
                      <p className="text-theme-subtle truncate text-sm">{item.role}</p>
                    </div>
                  </div>
                  <a
                    href={item.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border border-foreground/14 px-3 font-mono text-[10px] font-semibold tracking-[0.14em] text-theme-subtle uppercase transition-ui hover:border-foreground/25 hover:text-foreground"
                  >
                    {item.profileLabel}
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <div
        ref={chatDockRootRef}
        className="fixed bottom-4 left-1/2 z-40 flex w-[min(700px,calc(100%-1.5rem))] -translate-x-1/2 flex-col gap-2"
      >
        {isDockExpanded && (
          <div
            className={`chat-dock-panel-enter w-[min(980px,calc(100%-3.3rem))] rounded-2xl border border-foreground/15 bg-background/92 shadow-2xl backdrop-blur-xl transition-[box-shadow,transform] duration-300 ease-out ${
              isEmployerMode ? "chat-dock-recruiter-glow" : ""
            }`}
          >
            <div className="p-4 md:p-5">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-semibold tracking-tight text-foreground md:text-xl">
                    {isEmployerMode ? "AI Job Match Analysis" : "Portfolio assistant"}
                  </h3>
                  <p className="font-mono text-theme-muted mt-1 max-w-md text-[11px] leading-relaxed md:text-xs">
                    {isEmployerMode
                      ? "Paste a job description below, then run match from the bottom bar."
                      : "Messages appear here. Type in the bar at the bottom."}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={`text-xs font-semibold ${isEmployerMode ? "text-emerald-600 dark:text-emerald-400" : "text-theme-muted"}`}
                  >
                    Recruiter
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isEmployerMode}
                    onClick={() => setEmployerMode(!isEmployerMode)}
                    className={`recruiter-switch ${isEmployerMode ? "is-on" : ""}`}
                    aria-label={isEmployerMode ? "Switch to normal mode" : "Switch to recruiter mode"}
                  />
                </div>
              </div>

              {isEmployerMode && (
                <div className="mb-4 space-y-3">
                  <p className="font-mono text-theme-subtle text-[10px] font-bold tracking-wider uppercase">
                    Highlight specific skills (optional)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {highlightSkillOptions.map((skill) => {
                      const on = selectedHighlightSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleHighlightSkill(skill)}
                          className={`min-h-9 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary ${
                            on
                              ? "border-primary/40 bg-primary/15 text-primary"
                              : "border-foreground/15 bg-background text-theme-muted hover:border-foreground/25 hover:text-foreground"
                          }`}
                          aria-pressed={on}
                        >
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                  <p className="font-mono text-theme-subtle text-[10px] font-bold tracking-wider uppercase">
                    Analysis emphasis (optional)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {analysisTypeOptions.map((label) => {
                      const on = selectedAnalysisTypes.includes(label);
                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() => toggleAnalysisType(label)}
                          className={`min-h-9 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary ${
                            on
                              ? "border-accent/40 bg-accent/12 text-foreground"
                              : "border-foreground/15 bg-background text-theme-muted hover:border-foreground/25 hover:text-foreground"
                          }`}
                          aria-pressed={on}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div
                className="rounded-xl border border-foreground/12 bg-background/75 p-3 md:p-4"
                aria-live="polite"
                aria-relevant="additions"
              >
                <div className="max-h-52 space-y-3 overflow-y-auto pr-1 md:max-h-72">
                  {chatMessages.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={
                        message.role === "user"
                          ? "ml-auto max-w-[90%] rounded-2xl bg-foreground px-4 py-3 text-sm leading-relaxed text-background"
                          : "text-theme-muted max-w-[90%] rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm leading-relaxed"
                      }
                    >
                      {message.content}
                    </div>
                  ))}
                  {isSendingChat && (
                    <div className="text-theme-muted max-w-[90%] rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm leading-relaxed">
                      Thinking…
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div
          className={`flex flex-col gap-2 `}
        >
          <div className="flex min-w-0 flex-1 items-end gap-2">
            <form onSubmit={handleBottomFormSubmit} className="flex min-w-0 flex-1 items-end gap-2">
              <label htmlFor="chat-dock-composer" className="sr-only">
                {isEmployerMode ? "Job description" : "Message — Enter to send, Shift+Enter for new line"}
              </label>
              <textarea
                ref={chatComposerRef}
                id="chat-dock-composer"
                name="dockComposer"
                rows={isEmployerMode ? 5 : 2}
                value={isEmployerMode ? jdInput : chatInput}
                onChange={(e) => {
                  if (isEmployerMode) setJdInput(e.target.value);
                  else setChatInput(e.target.value);
                }}
                onKeyDown={handleBottomInputKeyDown}
                onFocus={() => setIsDockExpanded(true)}
                onBlur={(e) => {
                  const next = e.relatedTarget as Node | null;
                  if (chatDockRootRef.current?.contains(next)) return;
                  setIsDockExpanded(false);
                }}
                placeholder={
                  isEmployerMode
                    ? "Paste the full job description here…"
                    : "Ask about projects or stack — Enter sends, Shift+Enter for a new line"
                }
                className="field-sizing-content max-h-40 min-h-10 w-full min-w-0 resize-y rounded-xl border border-foreground/15 bg-background/90 px-3 py-2 text-sm text-foreground outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-theme-subtle focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/30"
              />
              {isEmployerMode ? (
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleJdAnalyze}
                  disabled={!jdInput.trim()}
                  className="mb-0.5 flex min-h-8 min-w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-white shadow-md transition-[opacity,transform] duration-200 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Analyze job description"
                >
                  <Send className="h-5 w-5" aria-hidden="true" />
                  </button>
              ) : (
                <button
                  type="submit"
                  onMouseDown={(e) => e.preventDefault()}
                  disabled={isSendingChat || !chatInput.trim()}
                  className="mb-0.5 min-h-8 shrink-0 rounded-xl bg-foreground px-4 text-sm font-semibold text-background transition-opacity duration-200 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Send className="h-5 w-5" aria-hidden="true" />
                </button>
              )}
            </form>
          </div>
          {/* <div className="flex shrink-0 items-center justify-end gap-2 md:flex-col md:items-stretch md:pb-0.5">
            <button
              type="button"
              onClick={() => setEmployerMode(!isEmployerMode)}
              className={`rounded-full border px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary ${
                isEmployerMode
                  ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-800 dark:text-emerald-200"
                  : "border-foreground/15 bg-background/80 text-theme-muted hover:text-foreground"
              }`}
              aria-pressed={isEmployerMode}
            >
              Recruiter
            </button>
            <button
              type="button"
              onClick={() => setIsDockExpanded((open) => !open)}
              className="text-theme-muted flex min-h-9 min-w-9 items-center justify-center rounded-lg border border-foreground/12 bg-background/70 text-xs font-semibold transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary md:min-h-8"
              aria-expanded={isDockExpanded}
              aria-label={isDockExpanded ? "Hide messages" : "Show messages"}
            >
              {isDockExpanded ? <ChevronDown className="h-4 w-4" aria-hidden /> : <MessageSquareText className="h-4 w-4" aria-hidden />}
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}

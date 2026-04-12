"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Flame,
  LayoutDashboard,
  Package,
  Shield,
  Sparkles,
  Users,
  Warehouse,
  X,
} from "lucide-react";
import { Github } from "@/components/ui/Icons";
import { MagneticLink } from "@/components/ui/MagneticLink";
import { cn } from "@/lib/utils";
import { externalLinkProps } from "@/lib/url";

const STACK = [
  "Tailwind CSS",
  "TanStack Query",
  "MongoDB",
  "React Hook Form",
  "Node.js",
  "Auth0",
  "Next.js",
] as const;

const LINKS = {
  github: "#",
  live: "#",
} as const;

const PILLARS = [
  {
    title: "Branch management",
    body: "Coordinate locations, roles, and distributed operations from one consistent control surface.",
    icon: Building2,
  },
  {
    title: "Employee management",
    body: "Centralize staff records, roles, and payroll-related workflows with fewer handoffs.",
    icon: Users,
  },
  {
    title: "Insightful dashboard",
    body: "Surface inventory, people, and branch signals in one place for faster decisions.",
    icon: LayoutDashboard,
  },
  {
    title: "Product management",
    body: "Maintain catalogs and product lifecycles with structures that scale as SKUs grow.",
    icon: Package,
  },
  {
    title: "Inventory management",
    body: "Track stock movement and balances with operational clarity across branches.",
    icon: Warehouse,
  },
  {
    title: "Advance Auth (Auth0)",
    body: "Enterprise-grade identity—secure login, sessions, and access policies without reinventing auth.",
    icon: Shield,
  },
] as const;

const GALLERY = [
  {
    src: "/projects/ignite/hero.webp",
    alt: "IGNITE ERP platform overview",
    caption: "Overview",
  },
  {
    src: "/projects/ignite/admin.webp",
    alt: "Admin and dashboard",
    caption: "Admin & dashboard",
  },
  {
    src: "/projects/ignite/branch.webp",
    alt: "Branch management",
    caption: "Branches",
  },
  {
    src: "/projects/ignite/product.webp",
    alt: "Product management",
    caption: "Products",
  },
  {
    src: "/projects/ignite/staffs.webp",
    alt: "Staff and employee management",
    caption: "Staff",
  },
] as const;

const LIGHTBOX_ITEMS = GALLERY.map((item) => ({
  src: item.src,
  alt: item.alt,
  caption: item.caption,
}));

const CAPABILITIES = [
  "Streamlines inventory, payroll, employee lifecycle, and branch operations in one Next.js application.",
  "MongoDB-backed persistence with TanStack Query for responsive, cache-aware client workflows.",
  "React Hook Form for disciplined forms across complex operational screens.",
  "Auth0 integration for secure, policy-aligned access—without custom auth maintenance debt.",
  "Tailwind CSS for a fast, consistent UI system across dashboards and management views.",
] as const;

export function IgniteProjectPage() {
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
      gsap.from(".ignite-reveal", {
        y: 28,
        opacity: 0,
        duration: 0.9,
        stagger: 0.05,
        ease: "expo.out",
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative w-full space-y-20 pb-28 pt-4 md:space-y-24 md:pt-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-6 -top-14 h-[min(36rem,105vh)] overflow-hidden rounded-b-2xl lg:-inset-x-10"
      >
        <div className="absolute inset-0 bg-[linear-gradient(165deg,rgba(154,52,18,0.08),transparent_42%),linear-gradient(12deg,rgba(251,146,60,0.06),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(251,191,36,0.06)_1px,transparent_0)] bg-size-[22px_22px] opacity-70 mask-[radial-gradient(ellipse_75%_60%_at_50%_0%,black_20%,transparent_72%)]" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background" />
      </div>

      <header className="ignite-reveal relative z-10 space-y-10">
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
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-sm border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-amber-700/95">
              <Flame className="h-3 w-3 opacity-90" strokeWidth={2} />
              IGNITE ERP
            </span>
            <span className="rounded-sm border border-zinc-600/40 bg-zinc-950/50 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-gray-200 ">
              Operations suite
            </span>
          </div>

          <div className="space-y-4">
            <h1
              className="max-w-[16ch] font-sans text-[clamp(2.5rem,7vw,4rem)] font-black leading-[0.92] tracking-tighter text-foreground"
              style={{ fontFeatureSettings: '"ss01"' }}
            >
              IGNITE
            </h1>
            <p className="max-w-2xl font-display text-[clamp(1.15rem,2.8vw,1.6rem)] font-normal italic leading-snug tracking-[-0.02em] text-foreground/90">
              IGNITE your business!
            </p>
          </div>

          <p className="max-w-3xl font-sans text-base leading-[1.75] text-theme-muted md:text-lg">
            IGNITE ERP is an advanced enterprise resource planning solution designed to
            streamline essential business functions like inventory control, payroll,
            employee management, and branch operations. Built for real-time insights
            and operational efficiency, it simplifies complex workflows behind a
            cohesive Next.js experience.
          </p>

          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href={LINKS.github}
              {...externalLinkProps(LINKS.github)}
              className="inline-flex items-center gap-2 rounded-sm border border-amber-500/40 bg-amber-500/12 px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-amber-400/60 hover:bg-amber-500/18"
            >
              <Github className="h-3.5 w-3.5 opacity-90" />
              View code
            </a>
            <a
              href={LINKS.live}
              {...externalLinkProps(LINKS.live)}
              className="inline-flex items-center gap-2 rounded-sm border border-foreground/18 bg-background/70 px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-amber-500/35 hover:bg-amber-500/8"
            >
              <ExternalLink className="h-3.5 w-3.5 opacity-80" />
              Live demo
            </a>
          </div>
        </div>
      </header>

      <section className="ignite-reveal grid gap-10 lg:grid-cols-12 lg:gap-12 lg:items-start">
        <div className="space-y-3 lg:col-span-4">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-theme-subtle">
            Scope
          </p>
          <p className="font-sans text-4xl font-black tabular-nums tracking-tight text-foreground">
            6+
          </p>
          <p className="font-sans text-sm text-theme-muted">Core domains in one suite</p>
          <p className="font-sans text-sm leading-relaxed text-theme-muted">
            From branches and staff to products and stock—designed so operators see
            fewer disconnected tools and more one coherent system.
          </p>
        </div>
        <div className="space-y-6 lg:col-span-8">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-theme-subtle">
            Brief
          </p>
          <p className="font-sans text-lg leading-[1.75] text-foreground/95 md:text-xl">
            ERP software should reduce friction between departments. IGNITE focuses on
            the daily reality of inventory, people, and multi-site coordination—
            pairing MongoDB persistence with a React client that stays fast under load.
          </p>
          <p className="font-sans text-base leading-[1.75] text-theme-muted md:text-[1.05rem]">
            Next.js anchors routing and UI; TanStack Query manages server state;
            React Hook Form keeps long forms predictable; Auth0 handles identity;
            Node.js services back the APIs your dashboard depends on.
          </p>
        </div>
      </section>

      <section className="ignite-reveal space-y-8">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-theme-subtle">
            Key features
          </p>
          <h2 className="mt-2 flex flex-wrap items-center gap-2 font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            <Flame className="h-7 w-7 text-amber-500" strokeWidth={1.5} aria-hidden />
            What the suite covers
          </h2>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {PILLARS.map((p) => (
            <li
              key={p.title}
              className="border border-amber-500/18 bg-linear-to-br from-amber-500/6 to-transparent p-5"
            >
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-amber-500/30 bg-amber-500/10 text-amber-200">
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

      <section className="ignite-reveal space-y-8">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-theme-subtle">
            Interface
          </p>
          <h2 className="mt-2 font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Screens &amp; modules
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="group relative block w-full overflow-hidden border border-amber-500/20 text-left"
            onClick={() => openLightbox(0)}
            aria-label="Open overview full size"
          >
            <div className="relative aspect-21/9 min-h-[160px] w-full sm:min-h-[200px]">
              <Image
                src={GALLERY[0].src}
                alt=""
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, min(1200px, 92vw)"
                priority
              />
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 border-t border-amber-500/20 bg-[#050607]/85 px-3 py-2">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-amber-100/90">
                {GALLERY[0].caption}
              </p>
            </div>
          </button>
          <div className="grid gap-3 sm:grid-cols-2">
            {GALLERY.slice(1).map((item, idx) => (
              <button
                key={item.src}
                type="button"
                className="group relative block overflow-hidden border border-amber-500/18 text-left"
                onClick={() => openLightbox(idx + 1)}
                aria-label={`Open ${item.caption} full size`}
              >
                <div className="relative aspect-video w-full min-h-[140px]">
                  <Image
                    src={item.src}
                    alt=""
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    sizes="(max-width: 640px) 100vw, 45vw"
                  />
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 border-t border-amber-500/20 bg-[#050607]/85 px-2.5 py-1.5">
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-amber-100/88">
                    {item.caption}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="ignite-reveal space-y-6">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-theme-subtle">
            Stack
          </p>
          <h2 className="mt-2 font-sans text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Tools &amp; services
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {STACK.map((label) => (
            <span
              key={label}
              className="rounded-sm border border-zinc-600/35 bg-amber-900/40 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white"
            >
              {label}
            </span>
          ))}
        </div>
      </section>

      <section className="ignite-reveal border border-amber-500/20 bg-amber-500/4 px-6 py-8 md:px-10 md:py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-12">
          <div className="shrink-0">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600/80">
              Delivery
            </p>
            <h2 className="mt-2 max-w-sm font-sans text-xl font-bold tracking-tight text-foreground md:text-2xl">
              Built for operational clarity
            </h2>
          </div>
          <ul className="max-w-2xl space-y-4 border-l-2 border-amber-500/30 pl-6">
            {CAPABILITIES.map((line) => (
              <li
                key={line}
                className="flex gap-3 font-sans text-sm leading-relaxed text-theme-muted md:text-base"
              >
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ignite-reveal flex flex-col gap-5 border-t border-foreground/10 pt-12 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-theme-subtle">
            Repository &amp; demo
          </p>
          <p className="mt-2 max-w-md font-sans text-sm text-theme-muted">
            Explore the implementation or try the live experience.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={LINKS.github}
            {...externalLinkProps(LINKS.github)}
            className="inline-flex items-center gap-2 rounded-sm border border-amber-500/40 bg-amber-500/12 px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-amber-400/60 hover:bg-amber-500/18"
          >
            <Github className="h-3.5 w-3.5 opacity-90" />
            View code
          </a>
          <a
            href={LINKS.live}
            {...externalLinkProps(LINKS.live)}
            className="inline-flex items-center gap-2 rounded-sm border border-foreground/18 bg-background/70 px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-amber-500/35 hover:bg-amber-500/8"
          >
            <ExternalLink className="h-3.5 w-3.5 opacity-80" />
            Live demo
          </a>
        </div>
      </section>

      {lightboxIndex !== null
        ? createPortal(
            <div
              className={cn(
                "fixed inset-0 z-998 flex cursor-default items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6",
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
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-amber-400">
                    {LIGHTBOX_ITEMS[lightboxIndex].caption}
                  </p>
                  <button
                    type="button"
                    className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-foreground/15 bg-background/90 text-foreground transition-colors hover:bg-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
                    onClick={closeLightbox}
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" strokeWidth={1.75} />
                  </button>
                </div>
                <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-auto rounded-xl border border-amber-500/25 bg-zinc-950/60 p-2 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.65)] sm:p-4">
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

"use client";

import Image from "next/image";
import Link from "next/link";
import { useScroll } from "motion/react";
import { flushSync } from "react-dom";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { ArrowRightIcon } from "lucide-react";
import { projectShowcase } from "@/content/project-showcase";
import { MagneticLink } from "@/components/ui/MagneticLink";
import {
  StickyScrollReveal,
  useStickyScrollIndexSync,
} from "@/components/ui/sticky-scroll-reveal";
import { cn } from "@/lib/utils";
import styles from "./project-showcase-section.module.css";

const STACK_ROTATIONS = ["-6deg", "3deg", "-2deg"] as const;
const STACK_OFFSETS = [
  { top: "0%", left: "5%" },
  { top: "12%", left: "18%" },
  { top: "24%", left: "8%" },
] as const;
const SWIPE_THRESHOLD_PX = 48;
const DRAG_RESISTANCE = 0.22;
const DRAG_MAX = 36;
const AXIS_LOCK_PX = 10;

const MD_QUERY = "(min-width: 768px)";

function subscribeMd(query: string, onChange: () => void) {
  const mq = window.matchMedia(query);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function useMdUp() {
  return useSyncExternalStore(
    (onStoreChange) => subscribeMd(MD_QUERY, onStoreChange),
    () => window.matchMedia(MD_QUERY).matches,
    () => false,
  );
}

function ProjectLinkBlock({
  item,
  index,
  onActivate,
  mobileImage,
}: {
  item: (typeof projectShowcase.featured)[number];
  index: number;
  onActivate: () => void;
  /** When set (mobile), render image card above the text link; button calls this to open the lightbox */
  mobileImage?: { onOpenLightbox: () => void };
}) {
  return (
    <>
      {mobileImage ? (
        <div className="relative mb-10 h-full w-[calc(100%+2rem)] -mx-4 sm:w-[calc(100%+3rem)] sm:-mx-6">
          {/* #-shaped frame: horizontal + vertical rules slightly past the image */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 left-1/2 z-10 h-0 w-[105%] -translate-x-1/2 border-t border-foreground/20"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-1/2 z-10 h-0 w-[105%] -translate-x-1/2 border-b border-foreground/20"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-0 z-10 h-[105%] w-0 -translate-y-1/2 border-l border-foreground/20"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-0 z-10 h-[105%] w-0 -translate-y-1/2 border-r border-foreground/20"
          />
          <div className=" block aspect-16/10 w-full">
            <Image
              src={item.imageSrc}
              alt=""
              width={960}
              height={600}
              sizes="100vw"
              className="h-full w-full z-10 object-cover transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
              draggable={false}
            />

            <Link
              href={item.href}
              className="group z-20 flex w-full cursor-pointer flex-col px-4 py-2 sm:px-6"
              onMouseEnter={onActivate}
              onFocus={onActivate}
            >
              <h3 className=" line-clamp-1 text-ellipsis pt-2 text-lg  inline font-bold tracking-[-0.02em] text-foreground transition-colors duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-primary md:text-xl">
                {item.title}
              </h3>
              <p className=" line-clamp-1 text-ellipsis pt-2 max-w-md inline text-sm leading-relaxed text-theme-muted md:text-[0.95rem]">
                {item.description}
              </p>
            </Link>
          </div>
        </div>
      ) : (
        <Link
          href={item.href}
          className="group block cursor-pointer rounded-lg outline-none transition-[color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          onMouseEnter={onActivate}
          onFocus={onActivate}
        >
          <p className="font-mono text-[10px] font-bold tracking-[0.28em] text-theme-subtle uppercase">
            {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-2 text-lg font-bold tracking-[-0.02em] text-foreground transition-colors duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-primary md:text-xl">
            {item.title}
          </h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-theme-muted md:text-[0.95rem]">
            {item.description}
          </p>
          <span className="mt-3 text-transparent group-hover:text-primary/90 inline-flex items-center gap-1 font-mono text-[10px] font-medium tracking-wider  uppercase opacity-0 transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:opacity-100 group-focus-visible:translate-x-0.5 group-focus-visible:opacity-100 md:translate-x-0 md:opacity-100">
            Open
            <span
              aria-hidden
              className="inline-block transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5"
            >
              →
            </span>
          </span>
        </Link>
      )}
    </>
  );
}

function ProjectShowcaseStack({
  featured,
  activeIndex,
  n,
  dragOffset,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  goNext,
  goPrev,
  hint,
}: {
  featured: typeof projectShowcase.featured;
  activeIndex: number;
  n: number;
  dragOffset: number;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerCancel: () => void;
  goNext: () => void;
  goPrev: () => void;
  hint: string;
}) {
  const stackLayers = [
    { stackPos: 2 as const, z: 1, featureIndex: (activeIndex + 2) % n },
    { stackPos: 1 as const, z: 2, featureIndex: (activeIndex + 1) % n },
    { stackPos: 0 as const, z: 3, featureIndex: activeIndex },
  ];
  const active = featured[activeIndex];

  return (
    <div className="relative mx-auto w-full max-w-md select-none md:mx-0 md:max-w-none">
      <div className="mb-4 flex items-end justify-between gap-4 md:flex-row-reverse">
        <p
          className="font-mono text-[10px] font-medium tracking-[0.38em] text-theme-subtle uppercase"
          aria-hidden
        >
          Stack
        </p>
        <p
          className="max-w-[18ch] text-right font-mono text-[10px] leading-snug text-theme-subtle motion-safe:transition-[opacity,transform] motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] md:text-left"
          aria-live="polite"
        >
          <span className="inline-block text-foreground/85" key={activeIndex}>
            {active.title}
          </span>
          <span className="mt-1 block font-normal tracking-normal text-theme-subtle">
            {hint}
          </span>
        </p>
      </div>

      <div
        role="group"
        aria-label="Project photos. Swipe horizontally or use the list to change the cover."
        className={cn(
          styles.stackSurface,
          "relative aspect-4/5 w-full min-h-[280px] cursor-grab outline-none active:cursor-grabbing sm:min-h-[340px] md:aspect-5/6 md:min-h-[420px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        )}
        style={{
          transform:
            dragOffset !== 0 ? `translate3d(${dragOffset}px,0,0)` : undefined,
          touchAction: "pan-y",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            goPrev();
          }
          if (e.key === "ArrowRight") {
            e.preventDefault();
            goNext();
          }
        }}
      >
        {stackLayers.map(({ stackPos, z, featureIndex }) => {
          const item = featured[featureIndex];
          const isCover = stackPos === 0;
          const rot = STACK_ROTATIONS[stackPos % STACK_ROTATIONS.length];
          return (
            <div
              key={stackPos}
              className="absolute overflow-visible rounded-2xl"
              style={{
                width: isCover ? "78%" : "72%",
                zIndex: z,
                top: STACK_OFFSETS[stackPos]?.top,
                left: STACK_OFFSETS[stackPos]?.left,
              }}
            >
              <div
                className={cn(
                  styles.stackCard,
                  "h-full w-full overflow-hidden rounded-2xl border border-foreground/15 bg-background]",
                  isCover && "ring-1 ring-primary/30",
                  isCover && styles.stackCardCoverPop,
                )}
                style={
                  {
                    "--stack-rot": rot,
                  } as React.CSSProperties
                }
                key={
                  isCover
                    ? `cover-${activeIndex}`
                    : `layer-${stackPos}-${featureIndex}`
                }
              >
                <Image
                  src={item.imageSrc}
                  alt={isCover ? item.imageAlt : ""}
                  width={960}
                  height={720}
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="h-full w-full object-cover motion-safe:transition-[transform,opacity] motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]"
                  draggable={false}
                  aria-hidden={!isCover}
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/40 via-transparent to-transparent" />
              </div>
            </div>
          );
        })}
      </div>

      <div className=" flex justify-center items-center pb-4">
                  <MagneticLink>
                    <Link
                      href="/projects"
                      className="inline-flex min-h-11 gap-2 items-center rounded-full hover:border border-foreground/20 px-5 py-2.5 font-bold text-foreground transition-[transform,background-color,border-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-foreground/40 hover:bg-foreground/5 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      View All Projects
                      <ArrowRightIcon/>
                    </Link>
                  </MagneticLink>
                </div>
    </div>
  );
}

export function ProjectShowcaseSection() {
  const { eyebrow, title, subtitle, viewAll, featured } = projectShowcase;
  const n = featured.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const isMdUp = useMdUp();

  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  useStickyScrollIndexSync(scrollYProgress, n, setActiveIndex, isMdUp);

  const dragStartX = useRef<number | null>(null);
  const dragStartY = useRef<number | null>(null);
  const axisRef = useRef<"h" | "v" | null>(null);
  const draggingRef = useRef(false);

  const lightboxRef = useRef<HTMLDialogElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % n);
  }, [n]);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + n) % n);
  }, [n]);

  const openLightbox = useCallback((index: number) => {
    flushSync(() => {
      setLightboxIndex(index);
    });
    lightboxRef.current?.showModal();
  }, []);

  const closeLightbox = useCallback(() => {
    lightboxRef.current?.close();
  }, []);

  useEffect(() => {
    const dialog = lightboxRef.current;
    if (!dialog) return;
    const onCancel = (e: Event) => {
      e.preventDefault();
      dialog.close();
    };
    dialog.addEventListener("cancel", onCancel);
    return () => dialog.removeEventListener("cancel", onCancel);
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragStartX.current = e.clientX;
    dragStartY.current = e.clientY;
    axisRef.current = null;
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (
      dragStartX.current == null ||
      dragStartY.current == null ||
      !draggingRef.current
    )
      return;

    const dx = e.clientX - dragStartX.current;
    const dy = e.clientY - dragStartY.current;

    if (
      axisRef.current === null &&
      (Math.abs(dx) > AXIS_LOCK_PX || Math.abs(dy) > AXIS_LOCK_PX)
    ) {
      if (Math.abs(dy) >= Math.abs(dx)) {
        axisRef.current = "v";
        setDragOffset(0);
        try {
          e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
          /* */
        }
        draggingRef.current = false;
        dragStartX.current = null;
        dragStartY.current = null;
        return;
      }
      axisRef.current = "h";
    }

    if (axisRef.current !== "h") return;

    const raw = e.clientX - dragStartX.current;
    setDragOffset(
      Math.max(-DRAG_MAX, Math.min(DRAG_MAX, raw * DRAG_RESISTANCE)),
    );
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* */
      }

      const wasHorizontal = axisRef.current === "h";
      const startX = dragStartX.current;

      draggingRef.current = false;
      axisRef.current = null;
      dragStartY.current = null;
      setDragOffset(0);

      if (!wasHorizontal || startX == null) {
        dragStartX.current = null;
        return;
      }

      const dx = e.clientX - startX;
      dragStartX.current = null;
      if (Math.abs(dx) < SWIPE_THRESHOLD_PX) return;
      if (dx < 0) goNext();
      else goPrev();
    },
    [goNext, goPrev],
  );

  const onPointerCancel = useCallback(() => {
    draggingRef.current = false;
    axisRef.current = null;
    dragStartX.current = null;
    dragStartY.current = null;
    setDragOffset(0);
  }, []);

  const lightboxItem = featured[lightboxIndex] ?? featured[0];

  function Intro({ headingId }: { headingId?: string }) {
    return (
      <>
        <p className="font-mono text-[10px] font-medium tracking-[0.42em] text-theme-subtle uppercase">
          {eyebrow}
        </p>
        <h2
          id={headingId}
          className="mt-3 max-w-[18ch] text-pretty text-[clamp(1.85rem,calc(3vw+0.85rem),2.85rem)] font-black leading-[0.95] tracking-[-0.04em] text-foreground md:mt-4"
        >
          {title}
        </h2>
        <p className="mt-6 max-w-xl font-display text-[clamp(1rem,1.05vw+0.82rem,1.2rem)] leading-[1.55] tracking-[-0.01em] text-foreground md:mt-8">
          {subtitle}
        </p>
      </>
    );
  }

  return (
    <section
      className="scroll-shrink-section relative py-10 md:py-10 lg:py-10"
      aria-labelledby="project-showcase-heading"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-foreground/12 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Mobile: project rows each include image card + link (no separate preview strip) */}
        <div className="md:hidden">
          <header
            className="story-chapter-reveal min-w-0"
            style={{ animationDelay: "0ms" }}
          >
            <Intro headingId="project-showcase-heading" />
            <ol className="mt-8 space-y-0 md:mt-10">
              {featured.map((item, index) => (
                <li
                  key={item.title}
                  className={cn(
                    styles.projectRow,
                    "story-chapter-reveal md:border-t border-foreground/15 pt-6 first:border-t-0 first:pt-0",
                  )}
                  style={{ animationDelay: `${40 + index * 70}ms` }}
                >
                  <ProjectLinkBlock
                    item={item}
                    index={index}
                    onActivate={() => setActiveIndex(index)}
                    mobileImage={{ onOpenLightbox: () => openLightbox(index) }}
                  />
                </li>
              ))}
            </ol>

            <div className="mt-10 md:mt-12 w-full flex justify-center items-center">
              <Link
                href={viewAll.href}
                className="relative px-3 py-2 "
              >
                {/* #-shaped frame: horizontal + vertical rules slightly past the image */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute top-0 left-1/2 z-10 h-0 w-[110%] -translate-x-1/2 border-t border-foreground/20"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute bottom-0 left-1/2 z-10 h-0 w-[110%] -translate-x-1/2 border-b border-foreground/20"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 left-0 z-10 h-[120%] w-0 -translate-y-1/2 border-l border-foreground/20"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 right-0 z-10 h-[120%] w-0 -translate-y-1/2 border-r border-foreground/20"
                />
                {viewAll.label}
              </Link>
            </div>
          </header>
        </div>

        {/* Desktop: Aceternity-style sticky column + scroll-driven progress */}
        <div className="hidden md:block">
          <StickyScrollReveal
            left={
              <div
                className="story-chapter-reveal min-w-0"
                style={{ animationDelay: "0ms" }}
              >
                <Intro />
                <div ref={trackRef} className="mt-10 space-y-0">
                  {featured.map((item, index) => (
                    <div
                      key={item.title}
                      className="flex  flex-col justify-center border-t border-foreground/15 pt-12 first:border-t-0 first:pt-0"
                      onMouseEnter={() => setActiveIndex(index)}
                    >
                      <ProjectLinkBlock
                        item={item}
                        index={index}
                        onActivate={() => setActiveIndex(index)}
                      />
                    </div>
                  ))}
                </div>

              </div>
            }
            sticky={
              <ProjectShowcaseStack
                featured={featured}
                activeIndex={activeIndex}
                n={n}
                dragOffset={dragOffset}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerCancel}
                goNext={goNext}
                goPrev={goPrev}
                hint="Scroll the list, hover, or swipe"
              />
            }
          />
        </div>
      </div>
    </section>
  );
}

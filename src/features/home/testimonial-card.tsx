"use client";

import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { HashFrameLines } from "@/components/ui/Icons";

const LINE_CLAMP_CLASS = "line-clamp-[7]";

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  avatar: string;
  profileUrl: string;
  profileLabel: string;
}

interface TestimonialCardProps {
  item: TestimonialItem;
}

export function TestimonialCard({ item }: TestimonialCardProps) {
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const contentId = useId();

  const checkOverflow = useCallback(() => {
    const el = quoteRef.current;
    if (!el) return;

    if (expanded) {
      setShowToggle(true);
      return;
    }

    const overflows = el.scrollHeight > el.clientHeight + 2;
    setShowToggle(overflows);
  }, [expanded]);

  useLayoutEffect(() => {
    checkOverflow();
  }, [checkOverflow, item.quote]);

  useEffect(() => {
    const el = quoteRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver(() => checkOverflow());
    ro.observe(el);
    return () => ro.disconnect();
  }, [checkOverflow]);

  return (
    <article className="scroll-shrink-item relative z-0 flex h-full min-h-0 flex-col overflow-visible rounded-none border-0 bg-background/70 p-5 transition-ui md:z-auto md:overflow-hidden md:rounded-2xl md:border md:border-foreground/10 md:p-6 md:hover:border-foreground/18">
      <div
        className="pointer-events-none absolute inset-0 overflow-visible md:hidden"
        aria-hidden
      >
        <HashFrameLines />
      </div>
      <div className="relative z-1 flex min-h-0 flex-1 flex-col">
        <p
          ref={quoteRef}
          id={contentId}
          className={`text-theme-muted text-sm leading-relaxed md:text-base ${expanded ? "" : LINE_CLAMP_CLASS}`}
        >
          &ldquo;{item.quote}&rdquo;
        </p>
        {showToggle ? (
          <button
            type="button"
            className="mt-2 inline-flex w-fit min-h-10 items-center font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-primary underline decoration-primary/35 underline-offset-[5px] transition-ui hover:decoration-primary hover:text-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-expanded={expanded}
            aria-controls={contentId}
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        ) : null}
        <div className="mt-auto flex shrink-0 flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 md:pt-5">
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
  );
}

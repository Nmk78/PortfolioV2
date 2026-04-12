"use client";

import { useMotionValueEvent, type MotionValue } from "motion/react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Aceternity-style: map page scroll progress through a target region to the
 * closest card index (see https://ui.aceternity.com/components/sticky-scroll-reveal).
 *
 * Only updates React state when the derived index actually changes, so scrolling
 * does not re-render the sticky stack on every motion tick.
 */
export function useStickyScrollIndexSync(
  scrollYProgress: MotionValue<number>,
  itemCount: number,
  setActiveIndex: (i: number) => void,
  enabled = true,
) {
  const lastIndexRef = useRef(-1);

  const breakpoints = useMemo(
    () =>
      itemCount > 0
        ? Array.from({ length: itemCount }, (_, index) => index / itemCount)
        : [],
    [itemCount],
  );

  useEffect(() => {
    lastIndexRef.current = -1;
  }, [itemCount, enabled]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!enabled || breakpoints.length === 0) return;
    const closestBreakpointIndex = breakpoints.reduce((acc, breakpoint, index) => {
      const distance = Math.abs(latest - breakpoint);
      if (distance < Math.abs(latest - breakpoints[acc])) return index;
      return acc;
    }, 0);
    if (closestBreakpointIndex === lastIndexRef.current) return;
    lastIndexRef.current = closestBreakpointIndex;
    setActiveIndex(closestBreakpointIndex);
  });
}

type StickyScrollRevealProps = {
  className?: string;
  left: ReactNode;
  sticky: ReactNode;
  stickyClassName?: string;
};

/** Two-column layout: sticky right column (full viewport height on md+). */
export function StickyScrollReveal({
  className,
  left,
  sticky,
  stickyClassName,
}: StickyScrollRevealProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-16",
        className,
      )}
    >
      <div className="min-w-0">{left}</div>
      <div
        className={cn(
          "sticky top-70 flex min-h-0 w-full items-center justify-center self-start md:h-screen md:pt-10",
          stickyClassName,
        )}
      >
        <div className="w-full max-w-md md:max-w-none">{sticky}</div>
      </div>
    </div>
  );
}

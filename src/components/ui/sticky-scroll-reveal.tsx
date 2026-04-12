"use client";

import { useMotionValueEvent, useScroll, type MotionValue } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Aceternity-style: map page scroll progress through a target region to the
 * closest card index (see https://ui.aceternity.com/components/sticky-scroll-reveal).
 */
export function useStickyScrollIndexSync(
  scrollYProgress: MotionValue<number>,
  itemCount: number,
  setActiveIndex: (i: number) => void,
  enabled = true,
) {
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!enabled || itemCount <= 0) return;
    const cardLength = itemCount;
    const cardsBreakpoints = Array.from({ length: itemCount }, (_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce((acc, breakpoint, index) => {
      const distance = Math.abs(latest - breakpoint);
      if (distance < Math.abs(latest - cardsBreakpoints[acc])) return index;
      return acc;
    }, 0);
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

"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ReactLenis = dynamic(
  () => import("lenis/react").then((module) => module.ReactLenis),
  { ssr: false },
);

/**
 * Lenis is off by default: it runs a continuous scroll smoother that fights Framer Motion,
 * scroll-driven sections, and the main thread. Set `NEXT_PUBLIC_ENABLE_LENIS=true` to opt in.
 */
const lenisOptIn =
  typeof process.env.NEXT_PUBLIC_ENABLE_LENIS === "string" &&
  process.env.NEXT_PUBLIC_ENABLE_LENIS === "true";

export function SmoothScrolling({ children }: { children: React.ReactNode }) {
  // if (lenisOptIn) {
  //   return <>{children}</>;
  // }

  /** Must stay false on server and on the first client render — do not read `window` in useState init (hydration mismatch). */
  const [isLenisEnabled, setIsLenisEnabled] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    setIsLenisEnabled(!prefersReduced && hasFinePointer);
  }, []);

  if (!isLenisEnabled) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.14,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1,
        /** Let overflow-y/auto regions (chat dock, modals) receive wheel before Lenis smooths the page */
        allowNestedScroll: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}

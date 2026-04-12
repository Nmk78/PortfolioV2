"use client";
import dynamic from "next/dynamic";
import { useState } from "react";

const ReactLenis = dynamic(
  () => import("lenis/react").then((module) => module.ReactLenis),
  { ssr: false },
);

export function SmoothScrolling({ children }: { children: React.ReactNode }) {
  const [isLenisEnabled] = useState(() => {
    if (typeof window === "undefined") return false;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    return !prefersReduced && hasFinePointer;
  });

  if (!isLenisEnabled) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1,
      }}
    >
      {children}
    </ReactLenis>
  );
}

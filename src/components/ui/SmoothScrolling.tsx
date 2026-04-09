"use client";
import { ReactLenis } from "lenis/react";
import { useEffect, useState } from "react";

export function SmoothScrolling({ children }: { children: React.ReactNode }) {
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

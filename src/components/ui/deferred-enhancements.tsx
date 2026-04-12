"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CustomCursor = dynamic(
  () => import("@/components/ui/CustomCursor").then((module) => module.CustomCursor),
  { ssr: false },
);

const PortfolioChatDock = dynamic(
  () =>
    import("@/features/portfolio-shell/portfolio-chat-dock").then(
      (module) => module.PortfolioChatDock,
    ),
  { ssr: false },
);

export function DeferredEnhancements() {
  const [isReady, setIsReady] = useState(false);
  const [shouldShowCursor, setShouldShowCursor] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    setShouldShowCursor(!prefersReduced && hasFinePointer);

    const windowWithIdle = window as Window & {
      requestIdleCallback?: (
        callback: (deadline: IdleDeadline) => void,
        options?: { timeout: number },
      ) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (
      typeof windowWithIdle.requestIdleCallback === "function" &&
      typeof windowWithIdle.cancelIdleCallback === "function"
    ) {
      const idleId = windowWithIdle.requestIdleCallback(() => setIsReady(true), {
        timeout: 1200,
      });
      return () => windowWithIdle.cancelIdleCallback?.(idleId);
    }

    const timeoutId = window.setTimeout(() => setIsReady(true), 450);
    return () => window.clearTimeout(timeoutId);
  }, []);

  if (!isReady) return null;

  return (
    <>
      {shouldShowCursor ? <CustomCursor /> : null}
      <PortfolioChatDock />
    </>
  );
}

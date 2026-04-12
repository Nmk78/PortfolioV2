"use client";

import { useEffect } from "react";
import { useEmployerMode } from "@/components/ui/employer-mode-provider";

export function HomeScrollEffects() {
  const { isEmployerMode } = useEmployerMode();

  useEffect(() => {
    const items = Array.from(
      document.querySelectorAll<HTMLElement>(".scroll-shrink-item"),
    );
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
        const visibleHeight = Math.max(
          0,
          Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0),
        );
        const baseHeight = Math.max(1, Math.min(rect.height, viewportHeight));
        const visibilityRatio = Math.max(
          0,
          Math.min(1, visibleHeight / baseHeight),
        );
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

  return null;
}

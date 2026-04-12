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

    const applyVisibilityStyles = (item: HTMLElement, visibilityRatio: number) => {
      const clampedRatio = Math.max(0, Math.min(1, visibilityRatio));
      const scale = 0.5 + clampedRatio * 0.5;
      const opacity = 0.45 + clampedRatio * 0.55;
      item.style.setProperty("--scroll-scale", scale.toFixed(3));
      item.style.setProperty("--scroll-opacity", opacity.toFixed(3));
    };

    if (isEmployerMode) {
      items.forEach((item) => {
        item.style.setProperty("--scroll-scale", "1");
        item.style.setProperty("--scroll-opacity", "1");
      });
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((item) => {
        item.style.setProperty("--scroll-scale", "1");
        item.style.setProperty("--scroll-opacity", "1");
      });
      return;
    }

    const threshold = Array.from({ length: 21 }, (_, index) => index / 20);
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          applyVisibilityStyles(entry.target as HTMLElement, entry.intersectionRatio);
        });
      },
      { threshold },
    );

    items.forEach((item) => {
      applyVisibilityStyles(item, 0);
      visibilityObserver.observe(item);
    });

    return () => visibilityObserver.disconnect();
  }, [isEmployerMode]);

  return null;
}

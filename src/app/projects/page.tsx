"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { IgniteProjectPreview } from "@/features/projects/ignite/preview";
import { LbmsProjectPreview } from "@/features/projects/lbms/preview";
import { NoteProjectPreview } from "@/features/projects/note/preview";
import { PivotProjectPreview } from "@/features/projects/pivot/preview";
import { PuSelectionProjectPreview } from "@/features/projects/pu-selection/preview";

export default function ProjectsPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = containerRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.from(".projects-hero-title", {
        y: 48,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out",
      });
      gsap.from(".projects-hero-lede", {
        y: 28,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        delay: 0.12,
      });
      gsap.from(".projects-section-label", {
        y: 20,
        opacity: 0,
        duration: 0.85,
        ease: "expo.out",
        delay: 0.2,
        stagger: 0.08,
      });
      gsap.from(".project-card", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "expo.out",
        delay: 0.35,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full space-y-24 md:space-y-32">
      <header className="space-y-8 text-center lg:text-left">
        <h1 className="projects-hero-title font-sans text-6xl font-black uppercase leading-[0.85] tracking-tighter text-foreground opacity-90 mix-blend-difference transition-ui sm:text-7xl md:text-8xl lg:text-9xl">
          Selected <br />{" "}
          <span className="text-primary opacity-80">Works.</span>
        </h1>
        {/* <p className="projects-hero-lede mx-auto max-w-3xl font-sans text-lg font-normal leading-relaxed text-theme-muted transition-ui md:mx-0 md:text-xl lg:text-2xl">
          Selected shipped projects with implementation details.
        </p> */}
      </header>

      <section className="relative z-10 space-y-10" aria-labelledby="case-studies-heading">
        <div className="projects-section-label flex flex-col gap-3 border-b border-foreground/10 pb-6">
          <h2
            id="case-studies-heading"
            className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-theme-subtle"
          >
            Projects
          </h2>
          <p className="max-w-2xl font-sans text-sm text-theme-subtle md:text-base">
            Current published work.
          </p>
        </div>

        <div className="mx-auto flex max-w-5xl flex-col gap-14 lg:gap-20">
          <PivotProjectPreview />
          <PuSelectionProjectPreview />
          <NoteProjectPreview />
          <IgniteProjectPreview />
          <LbmsProjectPreview />
        </div>
      </section>
    </div>
  );
}

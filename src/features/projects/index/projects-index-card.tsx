"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Github } from "@/components/ui/Icons";
import type { ProjectIndexEntry } from "@/features/projects/index/projects-index-data";

interface ProjectsIndexCardProps {
  project: ProjectIndexEntry;
  variant: "case-study" | "archive";
}

export function ProjectsIndexCard({ project, variant }: ProjectsIndexCardProps) {
  const Preview = project.Preview;
  const exploreHref = project.detailHref ?? project.link;
  const isCaseStudy = variant === "case-study";

  return (
    <article className="h-full">
      <GlassCard
        hoverGlow={false}
        className="project-card flex h-full flex-col justify-between border-foreground/10 p-8 shadow-2xl transition-ui md:p-10 lg:p-12"
      >
        <div className="pointer-events-none absolute inset-0 z-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 transition-ui transition-ui-slow group-hover:opacity-100" />

        <div className="relative z-10 flex min-h-0 flex-1 flex-col">
          <Link
            href={exploreHref}
            className="group/main -m-1 block rounded-xl p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Preview />
            <h3
              className={`font-sans font-black tracking-tighter text-foreground transition-ui group-hover/main:text-primary ${
                isCaseStudy ? "text-4xl leading-[1.05] sm:text-5xl md:text-6xl" : "text-3xl leading-tight sm:text-4xl"
              }`}
            >
              {project.title}
            </h3>
            <p
              className={`mt-4 font-sans font-normal leading-relaxed text-theme-muted transition-ui ${
                isCaseStudy ? "text-lg md:text-xl lg:text-2xl" : "text-base md:text-lg"
              }`}
            >
              {project.description}
            </p>
          </Link>
        </div>

        <div className="relative z-10 mt-10 space-y-8">
          <div className="flex flex-wrap gap-2 md:gap-3">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-foreground/5 bg-foreground/5 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-theme-muted transition-ui md:px-4 md:py-2"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-6 border-t border-foreground/10 pt-8 md:gap-10">
            <Link
              href={project.github}
              className="group/link flex cursor-pointer items-center gap-3 font-mono text-theme-subtle transition-[color,opacity,transform] duration-(--duration-ui-slow) ease-(--ease-ui) hover:text-foreground"
            >
              <Github className="h-5 w-5 opacity-40 transition-opacity duration-(--duration-ui-slow) ease-(--ease-ui) group-hover/link:opacity-100" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-0 transition-[opacity,transform] duration-(--duration-ui-slow) ease-(--ease-ui) -translate-x-4 group-hover/link:translate-x-0 group-hover/link:opacity-100">
                Source
              </span>
            </Link>
            <Link
              href={exploreHref}
              className="group/link flex cursor-pointer items-center gap-3 font-mono text-theme-subtle transition-[color,opacity,transform] duration-(--duration-ui-slow) ease-(--ease-ui) hover:text-foreground"
            >
              <ExternalLink className="h-5 w-5 opacity-40 transition-opacity duration-(--duration-ui-slow) ease-(--ease-ui) group-hover/link:opacity-100" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-0 transition-[opacity,transform] duration-(--duration-ui-slow) ease-(--ease-ui) -translate-x-4 group-hover/link:translate-x-0 group-hover/link:opacity-100">
                {project.detailHref ? "Case study" : "Explore"}
              </span>
            </Link>
          </div>
        </div>
      </GlassCard>
    </article>
  );
}

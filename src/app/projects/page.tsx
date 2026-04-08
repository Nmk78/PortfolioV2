"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { GlassCard } from "@/components/ui/GlassCard";
import { ExternalLink } from "lucide-react";
import { Github } from "@/components/ui/Icons";
import Link from "next/link";
import { MagneticLink } from "@/components/ui/MagneticLink";

const PROJECTS = [
  {
    title: "Library Management System",
    description: "A comprehensive digital solution for managing library resources, borrowing operations and student cataloging.",
    tags: ["Java", "SQL", "Swing"],
    link: "#",
    github: "#",
    size: "large"
  },
  {
    title: "IGNITE",
    description: "An innovative web platform dedicated to educational empowerment, bridging students and tutors.",
    tags: ["React", "Node.js", "MongoDB"],
    link: "#",
    github: "#",
    size: "small"
  },
  {
    title: "Online Voting System",
    description: "A secure and transparent e-voting portal designed for seamless campus elections.",
    tags: ["Next.js", "PostgreSQL", "Tailwind"],
    link: "#",
    github: "#",
    size: "small"
  },
  {
    title: "WYT-Blog",
    description: "A sleek, MDX-powered personal blogging platform with dynamic routing.",
    tags: ["Next.js", "MDX", "TypeScript"],
    link: "#",
    github: "#",
    size: "large"
  },
  {
    title: "Now Connect",
    description: "A real-time messaging application with presence indicators and group chat features.",
    tags: ["React Native", "Firebase"],
    link: "#",
    github: "#",
    size: "small"
  },
  {
    title: "Note App",
    description: "A minimalist note-taking app with offline-first capabilities and cloud sync.",
    tags: ["React", "Redux", "Express"],
    link: "#",
    github: "#",
    size: "small"
  }
];

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".projects-title", {
        y: 60,
        opacity: 0,
        duration: 1.5,
        ease: "expo.out",
      });
      gsap.from(".project-card", {
        y: 50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "expo.out",
        delay: 0.3
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full space-y-32">
      <header className="space-y-10 text-center lg:text-left">
        <h1 className="projects-title text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] text-foreground opacity-90 uppercase mix-blend-difference">
          Selected <br /> <span className="text-primary opacity-80">Works.</span>
        </h1>
        <p className="project-card text-xl md:text-2xl text-zinc-500 dark:text-zinc-400 font-light max-w-3xl leading-relaxed">
          A curated collection of digital products, experiments, and open-source contributions. Each piece is a study in logic and aesthetics.
        </p>
      </header>

      <div className="relative z-10">
        <div className="flex flex-wrap md:-mx-6 gap-y-16 md:gap-y-24">
          {PROJECTS.map((project, index) => (
            <div 
              key={index} 
              className={`w-full md:px-6 ${
                project.size === "large" ? "md:w-full lg:w-3/4" : "md:w-1/2 lg:w-1/4"
              }`}
            >
              <MagneticLink className="w-full h-full block">
                <GlassCard hoverGlow={false} className="project-card p-12 md:p-14 flex flex-col justify-between h-full group border-foreground/10 shadow-2xl hover-target cursor-none">
                  
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-out z-0"></div>

                  <div className="relative z-10 flex-1 space-y-8">
                    <h3 className={`font-black tracking-tighter text-foreground transition-colors duration-700 leading-tight ${
                      project.size === "large" ? "text-5xl md:text-6xl" : "text-3xl"
                    }`}>
                      {project.title}
                    </h3>
                    <p className={`text-zinc-500 dark:text-zinc-400 leading-relaxed font-light ${
                      project.size === "large" ? "text-xl md:text-2xl" : "text-lg"
                    }`}>
                      {project.description}
                    </p>
                  </div>
                  
                  <div className="relative z-10 mt-12 space-y-12">
                    <div className="flex flex-wrap gap-4">
                      {project.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-bold tracking-[0.2em] uppercase bg-foreground/5 text-zinc-500 px-5 py-2.5 rounded-full border border-foreground/5">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-10 pt-10 border-t border-foreground/10">
                      <Link href={project.github} className="text-zinc-400 hover:text-foreground transition-all duration-500 group/link flex items-center gap-3">
                        <Github className="w-5 h-5 opacity-40 group-hover/link:opacity-100" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-0 -translate-x-4 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-700">Source</span>
                      </Link>
                      <Link href={project.link} className="text-zinc-400 hover:text-foreground transition-all duration-500 group/link flex items-center gap-3">
                        <ExternalLink className="w-5 h-5 opacity-40 group-hover/link:opacity-100" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-0 -translate-x-4 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-700">Explore</span>
                      </Link>
                    </div>
                  </div>
                </GlassCard>
              </MagneticLink>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, FileText, Smartphone } from "lucide-react";
import { Github } from "@/components/ui/Icons";

const STACK = ["Expo", "TailwindCSS", "TypeScript"] as const;

const LINKS = {
  github: "#",
  live: "#",
} as const;

const KEY_FEATURES = ["Backup Note"] as const;

export function NoteProjectPage() {
  return (
    <div className="w-full space-y-12 pb-24 pt-6 md:space-y-14 md:pt-8">
      <header className="space-y-8">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-theme-subtle transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          All projects
        </Link>

        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-sm border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-600">
              <FileText className="h-3.5 w-3.5" />
              Note App
            </span>
            <span className="rounded-sm border border-foreground/15 bg-background/70 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-foreground/80">
              Simple Note App with Expo
            </span>
          </div>

          <h1 className="max-w-[16ch] font-sans text-[clamp(2.2rem,7vw,3.6rem)] font-black leading-[0.92] tracking-tighter text-foreground">
            Note App
          </h1>

          <p className="max-w-3xl font-sans text-base leading-8 text-theme-muted md:text-lg">
            Note App is a cross-platform note-taking solution built with React Native
            and Expo, designed to deliver a seamless experience on Android, iOS, and
            web. After initially using AsyncStorage, I upgraded to SQLite for
            reliable, scalable data storage, resolving key limitations while
            maintaining performance. The app features a clean UI powered by Tailwind
            CSS and nativewind, with smooth navigation via Expo Router. While I
            explored rich-text editing with Lexical, I ultimately opted for efficient
            plain-text storage to prioritize simplicity and stability. The Android
            version is currently available, with web deployment planned once final
            features are polished. This project deepened my understanding of React
            Native architecture, database optimization, and the balance between
            functionality and user experience.
          </p>
        </div>
      </header>

      <section className="overflow-hidden border border-foreground/15">
        <div className="relative aspect-video w-full">
          <Image
            src="/projects/note/cover.webp"
            alt="Note App preview"
            fill
            className="object-cover object-top"
            sizes="(max-width: 1024px) 100vw, 1100px"
            priority
          />
        </div>
      </section>

      <section className="grid gap-8 border border-foreground/10 p-6 md:grid-cols-2 md:p-8">
        <div className="space-y-4">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-theme-subtle">
            Key features
          </p>
          <ul className="space-y-2">
            {KEY_FEATURES.map((feature) => (
              <li
                key={feature}
                className="inline-flex items-center gap-2 rounded-sm border border-cyan-500/25 bg-cyan-500/8 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-700"
              >
                <Smartphone className="h-3.5 w-3.5" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-theme-subtle">
            Stack
          </p>
          <div className="flex flex-wrap gap-2">
            {STACK.map((item) => (
              <span
                key={item}
                className="rounded-sm border border-foreground/15 bg-background px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-foreground"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-wrap gap-3 border-t border-foreground/10 pt-8">
        <a
          href={LINKS.github}
          className="inline-flex items-center gap-2 rounded-sm border border-cyan-500/35 bg-cyan-500/10 px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-foreground transition-colors hover:bg-cyan-500/15"
        >
          <Github className="h-3.5 w-3.5" />
          View code
        </a>
        <a
          href={LINKS.live}
          className="inline-flex items-center gap-2 rounded-sm border border-foreground/18 bg-background px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-foreground transition-colors hover:bg-foreground/5"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Live demo
        </a>
      </section>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MagneticLink } from "@/components/ui/MagneticLink";

const storyParagraphs = [
  "I started by building practical web experiences for real users, then kept leveling up by pairing clean engineering with thoughtful UI detail.",
  "Today I focus on product-grade frontends with strong UX and reliable backend integrations, so teams can ship faster without sacrificing quality.",
  "If you are building something ambitious, I can help turn the idea into a clear, polished, and production-ready experience.",
];

// const storyHighlights = [
//   "Frontend Architecture",
//   "Design System Execution",
//   "Next.js + TypeScript",
//   "API Integrations",
// ];

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".contact-title", {
        y: 60,
        opacity: 0,
        duration: 1.5,
        ease: "expo.out",
      });
      gsap.from(".contact-animate", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "expo.out",
        delay: 0.2,
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full space-y-20 pb-20 pt-10"
    >
      <header className="relative mb-16 flex flex-col items-center text-center lg:items-start lg:text-left">
        <h1 className="contact-title mb-6 font-sans text-[5rem] font-black leading-none tracking-tighter text-foreground opacity-90 md:text-[8rem] lg:text-[10rem]">
          HELLO
          <span className="animate-pulse">.</span>
        </h1>
        <p className="contact-animate font-sans text-2xl font-normal leading-tight text-theme-muted transition-ui md:text-4xl lg:max-w-4xl">
          Have an idea or a project in mind? Let&apos;s build something{" "}
          <span className="bg-linear-to-r from-primary to-accent bg-clip-text font-medium text-transparent">
            extraordinary
          </span>{" "}
          together.
        </p>
      </header>

      <section className="contact-animate relative mx-auto max-w-6xl overflow-hidden border-y border-foreground/15 py-10 md:py-14">
        {/* <div className="pointer-events-none absolute -left-28 top-0 h-56 w-56 rounded-full bg-primary/15 blur-3xl" /> */}
        <div className="pointer-events-none absolute -right-24 bottom-0 h-52 w-52 rounded-full bg-foreground/15 blur-3xl" />

        <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="space-y-6">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-theme-subtle">
              About
            </p>
            <h2 className="max-w-3xl text-balance font-sans text-4xl font-black leading-[0.95] tracking-tight text-foreground md:text-6xl">
              I build systems that feel sharp, fast, and unmistakably human.
            </h2>
            <div className="space-y-4">
              {storyParagraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="max-w-[68ch] text-base leading-relaxed text-theme-muted md:text-lg"
                >
                  {paragraph}
                </p>
              ))}
            </div>
            {/* <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
              {storyHighlights.map((highlight) => (
                <span
                  key={highlight}
                  className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-foreground/80"
                >
                  {highlight}
                </span>
              ))}
            </div> */}
          </article>

          <aside className="flex flex-col justify-between gap-8 border-l border-foreground/15 pl-5 md:pl-8">
            <p className="font-sans text-2xl leading-tight font-semibold text-foreground/95 md:text-3xl">
              Clean code, intentional motion, and product-focused decisions.
            </p>
            <div className="space-y-4">
              <div className="border-l-2 border-primary pl-4">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-theme-subtle">
                  Based In
                </p>
                <p className="text-lg font-semibold text-foreground">Myanmar</p>
              </div>
              <div className="border-l-2 border-accent pl-4">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-theme-subtle">
                  Availability
                </p>
                <p className="text-lg font-semibold text-foreground">
                  Open for freelance
                </p>
              </div>
              <div className="border-l-2 border-foreground/30 pl-4">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-theme-subtle">
                  Response
                </p>
                <p className="text-lg font-semibold text-foreground">
                  Within 24 hours
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <div id="contact" className="relative z-10 mx-auto max-w-5xl space-y-10">
        <p className="contact-animate text-center font-mono text-sm leading-relaxed text-theme-muted lg:text-left">
          For a quick anonymous note to Telegram, use the site chat (bottom
          bar) → <span className="font-semibold text-foreground">Message</span>{" "}
          mode — no name or email required. Optional: turn on Reply me and add
          your Telegram username.
        </p>

        <div className="contact-animate border-t border-foreground/15">
          <MagneticLink className="w-full">
            <a
              href="mailto:naymyokhant78@gmail.com"
              className="hover-target group flex w-full items-end justify-between gap-4 border-b border-foreground/15 py-6 transition-ui hover:border-primary/45"
            >
              <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-theme-subtle">
                Email
              </p>
              <p className="text-right font-sans text-2xl font-black tracking-tight text-foreground transition-ui group-hover:text-primary md:text-3xl">
                naymyokhant78@gmail.com
              </p>
            </a>
          </MagneticLink>

          <MagneticLink className="w-full">
            <a
              href="tel:+959459133418"
              className="hover-target group flex w-full items-end justify-between gap-4 border-b border-foreground/15 py-6 transition-ui hover:border-accent/45"
            >
              <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-theme-subtle">
                Phone
              </p>
              <p className="text-right font-sans text-2xl font-black tracking-tight text-foreground transition-ui group-hover:text-accent md:text-3xl">
                +95 945 913 3418
              </p>
            </a>
          </MagneticLink>

          <MagneticLink className="w-full">
            <a
              href="https://github.com/Nmk78"
              target="_blank"
              rel="noreferrer"
              className="hover-target group flex w-full items-end justify-between gap-4 border-b border-foreground/15 py-6 transition-ui hover:border-foreground/45"
            >
              <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-theme-subtle">
                GitHub
              </p>
              <p className="text-right font-sans text-2xl font-black tracking-tight text-foreground transition-ui group-hover:text-primary md:text-3xl">
                github.com/Nmk78
              </p>
            </a>
          </MagneticLink>
        </div>
      </div>
    </div>
  );
}

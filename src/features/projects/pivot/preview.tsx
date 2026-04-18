"use client";

import Image from "next/image";
import Link from "next/link";

export function PivotProjectPreview() {
  return (
    <Link
      href="/projects/pivot"
      className="project-card group/pivot relative mb-8 block overflow-hidden bg-cyan-500/8 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="relative aspect-video w-full">
        <Image
          src="/projects/pivot/system.webp"
          alt=""
          fill
          className="object-cover object-center transition-transform duration-700 ease-out group-hover/pivot:scale-[1.03] group-focus-visible/pivot:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover/pivot:scale-100"
          sizes="(max-width: 768px) 100vw, 960px"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] bg-linear-to-t from-cyan-950/78 to-transparent md:h-[52%]" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <div className="bg-cyan-950/78 px-3 py-2 transition-all duration-500 ease-out group-hover/pivot:bg-cyan-950/92 group-focus-visible/pivot:bg-cyan-950/92 sm:px-6 sm:py-4">
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-300/80 transition-all duration-500 motion-reduce:transition-none group-hover/pivot:tracking-[0.24em] sm:text-[10px] sm:tracking-[0.24em] sm:group-hover/pivot:tracking-[0.28em]">
            AI security copilot
          </p>
          <h3 className="mt-0.5 font-sans text-lg font-black tracking-tight text-cyan-50 sm:mt-1 sm:text-2xl">Pivot</h3>
          <p className="mt-0.5 line-clamp-2 font-sans text-xs leading-snug text-cyan-100/85 sm:mt-1 sm:line-clamp-none sm:text-sm sm:leading-relaxed md:text-base">
            One assistant layer for web, mobile, and chat-based threat response workflows...
          </p>
        </div>
      </div>
    </Link>
  );
}

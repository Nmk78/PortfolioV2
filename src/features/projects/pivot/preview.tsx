"use client";

import Image from "next/image";
import Link from "next/link";

export function PivotProjectPreview() {
  return (
    <Link
      href="/projects/pivot"
      className="group/pivot relative mb-8 block overflow-hidden bg-cyan-500/8 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="relative aspect-video w-full">
        <Image
          src="/projects/pivot/app-mockup.webp"
          alt=""
          fill
          className="object-cover object-center transition-transform duration-700 ease-out group-hover/pivot:scale-[1.03] group-focus-visible/pivot:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover/pivot:scale-100"
          sizes="(max-width: 768px) 100vw, 960px"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-cyan-950/95 via-cyan-950/35 to-transparent" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <div className="bg-cyan-950/78 px-6 py-4 transition-all duration-500 ease-out group-hover/pivot:bg-cyan-950/92 group-focus-visible/pivot:bg-cyan-950/92">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-300/80 transition-all duration-500 group-hover/pivot:tracking-[0.28em] motion-reduce:transition-none">
            AI security copilot
          </p>
          <h3 className="mt-1 font-sans text-2xl font-black tracking-tight text-cyan-50">Pivot</h3>
          <p className="font-sans text-sm text-cyan-100/85 sm:text-base">
            One assistant layer for web, mobile, and chat-based threat response workflows...
          </p>
        </div>
      </div>
    </Link>
  );
}

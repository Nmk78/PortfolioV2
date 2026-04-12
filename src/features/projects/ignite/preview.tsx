"use client";

import Image from "next/image";
import Link from "next/link";

export function IgniteProjectPreview() {
  return (
    <Link
      href="/projects/ignite"
      className="project-card group/ignite relative mb-8 block overflow-hidden bg-amber-500/8 outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="relative aspect-video w-full">
        <Image
          src="/projects/ignite/hero.webp"
          alt=""
          fill
          className="object-cover object-top transition-transform duration-700 ease-out group-hover/ignite:scale-[1.03] group-focus-visible/ignite:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover/ignite:scale-100"
          sizes="(max-width: 768px) 100vw, 960px"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] bg-linear-to-t from-amber-950/80 to-transparent md:h-[52%]" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <div className="bg-amber-950/78 px-3 py-2 transition-all duration-500 ease-out group-hover/ignite:bg-amber-950/92 group-focus-visible/ignite:bg-amber-950/92 sm:px-6 sm:py-4">
          <div className="mb-1 h-0.5 w-8 bg-amber-300/70 transition-all duration-500 motion-reduce:transition-none group-hover/ignite:w-14 group-focus-visible/ignite:w-14 sm:mb-2 sm:w-10 sm:group-hover/ignite:w-18 sm:group-focus-visible/ignite:w-18" />
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-amber-300/80 sm:text-[10px] sm:tracking-[0.24em]">
            Enterprise operations
          </p>
          <h3 className="mt-0.5 font-sans text-lg font-black tracking-tight text-amber-50 sm:mt-1 sm:text-2xl">IGNITE</h3>
          <p className="mt-0.5 line-clamp-2 font-sans text-xs leading-snug text-amber-100/85 sm:mt-1 sm:line-clamp-none sm:text-sm sm:leading-relaxed md:text-base">
            Inventory, branch, and sales operations connected in a single ERP workflow...
          </p>
        </div>
      </div>
    </Link>
  );
}

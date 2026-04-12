"use client";

import Image from "next/image";
import Link from "next/link";

export function LbmsProjectPreview() {
  return (
    <Link
      href="/projects/lbms"
      className="group/lbms relative mb-8 block overflow-hidden bg-emerald-500/8 outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="relative aspect-video w-full">
        <Image
          src="/projects/lbms/hero.webp"
          alt=""
          fill
          className="object-cover object-top transition-transform duration-700 ease-out group-hover/lbms:scale-[1.03] group-focus-visible/lbms:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover/lbms:scale-100"
          sizes="(max-width: 768px) 100vw, 960px"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] bg-linear-to-t from-emerald-950/78 to-transparent md:h-[52%]" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <div className="translate-y-1 bg-emerald-950/78 px-3 py-2 opacity-90 transition-all duration-500 ease-out group-hover/lbms:translate-y-0 group-hover/lbms:opacity-100 group-focus-visible/lbms:translate-y-0 group-focus-visible/lbms:opacity-100 motion-reduce:translate-y-0 sm:translate-y-2 sm:px-6 sm:py-4">
          <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-300/80 sm:text-[10px] sm:tracking-[0.24em]">
            Library stack
          </p>
          <h3 className="mt-0.5 font-sans text-lg font-black tracking-tight text-emerald-50 sm:mt-1 sm:text-2xl">LBMS</h3>
          <p className="mt-0.5 line-clamp-2 font-sans text-xs leading-snug text-emerald-100/85 sm:mt-1 sm:line-clamp-none sm:text-sm sm:leading-relaxed md:text-base">
            Clean catalog, loan tracking, and due-date workflows in one fast dashboard...
          </p>
        </div>
      </div>
    </Link>
  );
}

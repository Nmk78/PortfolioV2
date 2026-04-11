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
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-emerald-950/90 via-emerald-950/35 to-transparent" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <div className="translate-y-2 bg-emerald-950/78 px-6 py-4 opacity-90 transition-all duration-500 ease-out group-hover/lbms:translate-y-0 group-hover/lbms:opacity-100 group-focus-visible/lbms:translate-y-0 group-focus-visible/lbms:opacity-100 motion-reduce:translate-y-0">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-300/80">
            Library stack
          </p>
          <h3 className="mt-1 font-sans text-2xl font-black tracking-tight text-emerald-50">LBMS</h3>
          <p className="font-sans text-sm text-emerald-100/85 sm:text-base">
            Clean catalog, loan tracking, and due-date workflows in one fast dashboard...
          </p>
        </div>
      </div>
    </Link>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";

export function IgniteProjectPreview() {
  return (
    <Link
      href="/projects/ignite"
      className="group/ignite relative mb-8 block overflow-hidden bg-amber-500/8 outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="relative aspect-video w-full">
        <Image
          src="/projects/ignite/hero.webp"
          alt=""
          fill
          className="object-contain object-top transition-transform duration-700 ease-out group-hover/ignite:scale-[1.03] group-focus-visible/ignite:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover/ignite:scale-100"
          sizes="(max-width: 768px) 100vw, 960px"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-amber-950/90 via-amber-950/32 to-transparent" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <div className="bg-amber-950/78 px-6 py-4 transition-all duration-500 ease-out group-hover/ignite:bg-amber-950/92 group-focus-visible/ignite:bg-amber-950/92">
          <div className="mb-2 h-0.5 w-10 bg-amber-300/70 transition-all duration-500 group-hover/ignite:w-18 group-focus-visible/ignite:w-18 motion-reduce:transition-none" />
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-amber-300/80">
            Enterprise operations
          </p>
          <h3 className="mt-1 font-sans text-2xl font-black tracking-tight text-amber-50">IGNITE</h3>
          <p className="font-sans text-sm text-amber-100/85 sm:text-base">
            Inventory, branch, and sales operations connected in a single ERP workflow...
          </p>
        </div>
      </div>
    </Link>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { Crown } from "lucide-react";

/**
 * Cover-photo preview with ticket-style info banner.
 */
export function PuSelectionProjectPreview() {
  return (
    <Link
      href="/projects/pu-selection"
      className="group/pu relative mb-8 block overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="relative aspect-video w-full">
        <Image
          src="/projects/selectionV2/hero.webp"
          alt=""
          fill
          className="object-cover object-center transition-transform duration-700 ease-out group-hover/pu:scale-[1.03] group-focus-visible/pu:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover/pu:scale-100"
          sizes="(max-width: 768px) 100vw, 960px"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#120c10]/88 via-[#120c10]/30 to-transparent" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-4 sm:px-5 sm:pb-5">
        <div className="relative overflow-hidden bg-[#120c10]/88 backdrop-blur-[1px]">
          <div className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-background" />
          <div className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-background" />
          <div className="border-y border-dashed border-[#c4a35a]/40 px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-[#fbbf24]" strokeWidth={1.8} aria-hidden />
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#c4a35a]/85">
                King &amp; Queen voting platform
              </p>
            </div>
            <div className="mt-1.5 flex items-center justify-between gap-3">
              <h3 className="font-sans text-xl font-black tracking-tight text-[#fef3c7] sm:text-2xl">
                PU Selection
              </h3>
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#fde68a]/85">
                Ticket #2025
              </span>
            </div>
            <p className="mt-1 font-sans text-sm text-[#fde68a]/88 sm:text-base">
              Campus election flow with profile previews, voting, and result tracking...
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

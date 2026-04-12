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
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] bg-linear-to-t from-[#120c10]/82 to-transparent md:h-[52%]" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 px-3 pb-2 sm:px-5 sm:pb-4">
        <div className="relative overflow-hidden bg-[#120c10]/88 backdrop-blur-[1px]">
          <div className="absolute -left-2 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-background sm:h-4 sm:w-4" />
          <div className="absolute -right-2 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-background sm:h-4 sm:w-4" />
          <div className="border-y border-dashed border-[#c4a35a]/40 px-3 py-2 sm:px-5 sm:py-3">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Crown className="h-3.5 w-3.5 shrink-0 text-[#fbbf24] sm:h-4 sm:w-4" strokeWidth={1.8} aria-hidden />
              <p className="truncate font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#c4a35a]/85 sm:text-[10px] sm:tracking-[0.24em]">
                King &amp; Queen voting platform
              </p>
            </div>
            <div className="mt-1 flex items-center justify-between gap-2 sm:mt-1.5 sm:gap-3">
              <h3 className="font-sans text-lg font-black tracking-tight text-[#fef3c7] sm:text-2xl">
                PU Selection
              </h3>
              <span className="shrink-0 font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-[#fde68a]/85 sm:text-[9px] sm:tracking-[0.2em]">
                Ticket #2025
              </span>
            </div>
            <p className="mt-0.5 line-clamp-2 font-sans text-xs leading-snug text-[#fde68a]/88 sm:mt-1 sm:line-clamp-none sm:text-sm md:text-base">
              Campus election flow with profile previews, voting, and result tracking...
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { FileText, Save } from "lucide-react";

export function NoteProjectPreview() {
  return (
    <Link
      href="/projects/note"
      className="project-card group/note relative mb-8 block overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="relative aspect-video w-full">
        <Image
          src="/projects/note/cover.webp"
          alt=""
          fill
          className="object-cover object-top transition-transform duration-700 ease-out group-hover/note:scale-[1.03] group-focus-visible/note:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover/note:scale-100"
          sizes="(max-width: 768px) 100vw, 960px"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] bg-linear-to-t from-cyan-950/82 to-transparent md:h-[52%]" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 px-3 pb-2 sm:px-5 sm:pb-4">
        <div className="relative overflow-hidden bg-cyan-950/80 backdrop-blur-[1px] transition-colors duration-500 group-hover/note:bg-cyan-950/92 group-focus-visible/note:bg-cyan-950/92">
          <div className="border-y border-dashed border-cyan-300/35 px-3 py-2 sm:px-5 sm:py-3">
            <div className="flex items-center justify-between gap-2 sm:gap-3">
              <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
                <FileText className="h-3.5 w-3.5 shrink-0 text-cyan-300 sm:h-4 sm:w-4" strokeWidth={1.8} />
                <p className="truncate font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-300/85 sm:text-[10px] sm:tracking-[0.22em]">
                  Expo note project
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-cyan-200/85 sm:text-[9px] sm:tracking-[0.18em]">
                <Save className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                SQLite
              </span>
            </div>
            <h3 className="mt-0.5 font-sans text-lg font-black tracking-tight text-cyan-50 sm:mt-1 sm:text-2xl">
              Note App
            </h3>
            <p className="mt-0.5 line-clamp-2 font-sans text-xs leading-snug text-cyan-100/85 sm:mt-1 sm:line-clamp-none sm:text-sm sm:leading-relaxed md:text-base">
              Quick mobile note capture with local-first storage and smooth write flows...
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

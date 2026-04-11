"use client";

import Image from "next/image";
import Link from "next/link";
import { FileText, Save } from "lucide-react";

export function NoteProjectPreview() {
  return (
    <Link
      href="/projects/note"
      className="group/note relative mb-8 block overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="relative aspect-video w-full">
        <Image
          src="/projects/note/cover.webp"
          alt=""
          fill
          className="object-cover object-top transition-transform duration-700 ease-out group-hover/note:scale-[1.03] group-focus-visible/note:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover/note:scale-100"
          sizes="(max-width: 768px) 100vw, 960px"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-cyan-950/90 via-cyan-950/30 to-transparent" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-4 sm:px-5 sm:pb-5">
        <div className="relative overflow-hidden bg-cyan-950/80 backdrop-blur-[1px] transition-colors duration-500 group-hover/note:bg-cyan-950/92 group-focus-visible/note:bg-cyan-950/92">
          <div className="border-y border-dashed border-cyan-300/35 px-4 py-3 sm:px-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <FileText className="h-4 w-4 shrink-0 text-cyan-300" strokeWidth={1.8} />
                <p className="truncate font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-300/85">
                  Expo note project
                </p>
              </div>
              <span className="inline-flex items-center gap-1 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-cyan-200/85">
                <Save className="h-3 w-3" />
                SQLite
              </span>
            </div>
            <h3 className="mt-1 font-sans text-2xl font-black tracking-tight text-cyan-50">Note App</h3>
            <p className="font-sans text-sm text-cyan-100/85 sm:text-base">
              Quick mobile note capture with local-first storage and smooth write flows...
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

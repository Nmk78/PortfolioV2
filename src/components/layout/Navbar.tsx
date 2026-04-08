"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { MagneticLink } from "@/components/ui/MagneticLink";
import { useTheme } from "next-themes";
import { GripHorizontal, Moon, Sun } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useEmployerMode } from "../ui/employer-mode-provider";

interface NavItem {
  href: string;
  label: string;
  mobileLabel: string;
}

const navItems: NavItem[] = [
  { href: "/", label: "Home", mobileLabel: "home" },
  { href: "/projects", label: "Projects", mobileLabel: "projects" },
  { href: "/contact", label: "Contact", mobileLabel: "contact" },
];

const EDGE_PAD = 12;
/** Keep default placement above the home chat composer (fixed bottom). */
const MOBILE_RISE_FROM_BOTTOM = 96;

function clampPillPosition(
  x: number,
  y: number,
  width: number,
  height: number,
  viewportW: number,
  viewportH: number
) {
  const maxX = viewportW - width - EDGE_PAD;
  const maxY = viewportH - height - EDGE_PAD;
  return {
    x: Math.round(Math.min(maxX, Math.max(EDGE_PAD, x))),
    y: Math.round(Math.min(maxY, Math.max(EDGE_PAD, y))),
  };
}

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { isEmployerMode, toggleEmployerMode } = useEmployerMode();
  const [mounted, setMounted] = useState(false);
  const pillRef = useRef<HTMLDivElement>(null);
  const [pillPos, setPillPos] = useState<{ x: number; y: number } | null>(null);
  const [pillReady, setPillReady] = useState(false);
  const dragRef = useRef({
    dragging: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  });

  useEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    const el = pillRef.current;
    if (!el || typeof window === "undefined") return;
    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const startX = (vw - rect.width) / 2;
    const startY = vh - rect.height - EDGE_PAD - MOBILE_RISE_FROM_BOTTOM;
    setPillPos(clampPillPosition(startX, startY, rect.width, rect.height, vw, vh));
    setPillReady(true);
  }, []);

  useEffect(() => {
    function onResize() {
      const el = pillRef.current;
      if (!el || typeof window === "undefined") return;
      const rect = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setPillPos((prev) => {
        if (!prev) return prev;
        return clampPillPosition(prev.x, prev.y, rect.width, rect.height, vw, vh);
      });
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  function onDragPointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    if (e.button !== 0) return;
    e.preventDefault();
    const pos = pillPos;
    if (!pos) return;
    dragRef.current = {
      dragging: true,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: pos.x,
      originY: pos.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onDragPointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    const d = dragRef.current;
    if (!d.dragging || e.pointerId !== d.pointerId) return;
    const el = pillRef.current;
    if (!el || typeof window === "undefined") return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    setPillPos(
      clampPillPosition(d.originX + dx, d.originY + dy, rect.width, rect.height, vw, vh)
    );
  }

  function onDragPointerEnd(e: React.PointerEvent<HTMLButtonElement>) {
    const d = dragRef.current;
    if (!d.dragging || e.pointerId !== d.pointerId) return;
    d.dragging = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  }

  return (
    <>
      <div className="fixed top-[max(1.5rem,env(safe-area-inset-top))] inset-x-0 z-50 w-full max-w-7xl mx-auto px-[max(1rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))] sm:px-12 lg:px-16">
        <nav aria-label="Main" className="relative flex w-full items-center justify-between gap-3">
          <MagneticLink>
            <Link
              href="/"
              className="font-bold text-xl tracking-tighter text-foreground cursor-pointer rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              NMK.
            </Link>
          </MagneticLink>

          <div className="glass-nav absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-4 px-8 py-2 md:flex sm:gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <MagneticLink key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative cursor-pointer rounded-md px-3 py-2 text-sm font-medium transition-[color] duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      isActive ? "text-primary" : "text-theme-subtle",
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </MagneticLink>
              );
            })}
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {mounted && (
              <>
                <button
                  onClick={toggleEmployerMode}
                  className={cn(
                    "inline-flex min-h-11 items-center gap-2 rounded-full border-0 px-2.5 text-xs font-semibold tracking-wide uppercase transition-[color] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:px-3 touch-manipulation",
                    isEmployerMode
                      ? "border-0 bg-transparent text-primary"
                      : "border-0 text-theme-muted hover:text-foreground",
                  )}
                  aria-pressed={isEmployerMode}
                  aria-label="Toggle employer mode"
                  type="button"
                >
                  <div
                    id="bluedot"
                    className={`h-2 w-2 shrink-0 rounded-full bg-primary ${isEmployerMode ? "animate-pulse" : "bg-transparent"}`}
                  />
                  <span className="max-[380px]:sr-only">Recruiter</span>
                </button>

                <MagneticLink>
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="min-h-11 min-w-11 cursor-pointer rounded-full p-2 text-foreground transition-[color,background-color] duration-200 hover:bg-black/5 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background touch-manipulation"
                    aria-label="Toggle theme"
                    type="button"
                  >
                    {theme === "dark" ? (
                      <Sun className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Moon className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </MagneticLink>
              </>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile: draggable nav capsule */}
      <div
        ref={pillRef}
        style={
          pillPos
            ? {
                left: pillPos.x,
                top: pillPos.y,
                right: "auto",
                bottom: "auto",
              }
            : { left: 0, top: 0, visibility: "hidden" as const }
        }
        className={cn(
          "md:hidden w-min fixed z-45 flex  flex-col items-stretch overflow-hidden rounded-2xl border border-(--glass-border) bg-background/92 shadow-[0_6px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-opacity duration-150 motion-reduce:transition-none dark:shadow-[0_8px_40px_rgba(0,0,0,0.4)]",
          pillReady ? "opacity-100" : "opacity-0",
        )}
      >
        <button
          type="button"
          aria-label="Drag to move navigation"
          className="touch-none flex w-full shrink-0 cursor-grab items-center justify-center border-b border-(--glass-border) bg-foreground/3 py-1.5 text-theme-muted transition-[color] active:cursor-grabbing hover:text-foreground [-webkit-tap-highlight-color:transparent]"
          onPointerDown={onDragPointerDown}
          onPointerMove={onDragPointerMove}
          onPointerUp={onDragPointerEnd}
          onPointerCancel={onDragPointerEnd}
        >
          <GripHorizontal className="h-5 w-5 shrink-0 opacity-70" aria-hidden="true" />
        </button>
        <nav
          aria-label="Mobile pages"
          className="flex flex-col gap-0.5 px-2 py-1.5 pb-3"
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block min-h-10 w-min text-right rounded-full px-1 py-1.5 text-[0.85rem] font-medium lowercase tracking-tight transition-[color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background [-webkit-tap-highlight-color:transparent]",
                  isActive ? "text-primary" : "text-theme-muted hover:text-foreground",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {item.mobileLabel}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}

"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { MagneticLink } from "@/components/ui/MagneticLink";
import { useTheme } from "next-themes";
import { GripHorizontal, Moon, Sun } from "lucide-react";
import { startTransition, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useEmployerMode } from "@/components/ui/employer-mode-provider";

interface NavItem {
  href: string;
  label: string;
  mobileLabel: string;
}

const navItems: NavItem[] = [
  { href: "/", label: "Home", mobileLabel: "home" },
  { href: "/projects", label: "Projects", mobileLabel: "projects" },
  { href: "/about#contact", label: "Contact", mobileLabel: "contact" },
  { href: "/about", label: "About", mobileLabel: "about" },
];

const EDGE_PAD = 12;
/** Initial mobile pill placement near top-right edge. */
const MOBILE_TOP_OFFSET = 96;
/** Prevent dropping the draggable pill under the fixed top navbar hit area. */
const MOBILE_SAFE_TOP_BOUNDARY = 72;

function clampPillPosition(
  x: number,
  y: number,
  width: number,
  height: number,
  viewportW: number,
  viewportH: number,
) {
  const maxX = viewportW - width - EDGE_PAD;
  const maxY = viewportH - height - EDGE_PAD;
  return {
    x: Math.round(Math.min(maxX, Math.max(EDGE_PAD, x))),
    y: Math.round(Math.min(maxY, Math.max(MOBILE_SAFE_TOP_BOUNDARY, y))),
  };
}

export function Navbar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const { isEmployerMode, toggleEmployerMode } = useEmployerMode();
  const [mounted, setMounted] = useState(false);
  const pillRef = useRef<HTMLDivElement>(null);
  const [pillPos, setPillPos] = useState<{ x: number; y: number } | null>(null);
  const [pillReady, setPillReady] = useState(false);
  const [isPillIdle, setIsPillIdle] = useState(false);
  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
    const startX = vw - rect.width - EDGE_PAD;
    const startY = MOBILE_TOP_OFFSET;
    setPillPos(
      clampPillPosition(startX, startY, rect.width, rect.height, vw, vh),
    );
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
        return clampPillPosition(
          prev.x,
          prev.y,
          rect.width,
          rect.height,
          vw,
          vh,
        );
      });
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const bumpPillActive = () => {
      setIsPillIdle(false);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = setTimeout(() => {
        setIsPillIdle(true);
      }, 2000);
    };

    const onPointerMove = (e: PointerEvent) => {
      const el = pillRef.current;
      if (!el) return;
      const target = e.target instanceof Node ? e.target : null;
      if (!target) return;
      if (el.contains(target)) bumpPillActive();
    };

    bumpPillActive();
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };
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
      clampPillPosition(
        d.originX + dx,
        d.originY + dy,
        rect.width,
        rect.height,
        vw,
        vh,
      ),
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

  function toggleTheme() {
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
    startTransition(() => setTheme(nextTheme));
  }

  return (
    <>
      <div className="fixed top-[max(1.25rem,env(safe-area-inset-top))] inset-x-0 z-50 mx-auto w-full max-w-7xl px-[max(1rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] sm:px-10 lg:max-w-6xl lg:px-12 2xl:max-w-7xl">
        <nav
          aria-label="Main"
          className="  bg-background/20  backdrop-blur-md  relative flex w-full items-center justify-between gap-3 md:bg-transparent md:backdrop-blur-none"
        >
          <MagneticLink>
            <Link
              href="/"
              className="font-bold text-xl tracking-tighter text-foreground cursor-pointer rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              NMK.
            </Link>
          </MagneticLink>

          <div className="glass-nav absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-4 px-8 md:flex sm:gap-6">
                  {/* #-shaped frame: horizontal + vertical rules slightly past the image */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-1/2 z-10 h-0 w-[110%] -translate-x-1/2 border-t border-foreground/20"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 z-10 h-0 w-[110%] -translate-x-1/2 border-b border-foreground/20"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-0 z-10 h-[120%] w-0 -translate-y-1/2 border-l border-foreground/20"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-0 z-10 h-[120%] w-0 -translate-y-1/2 border-r border-foreground/20"
        />
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <MagneticLink key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative cursor-pointer rounded-md px-3 py-2 font-sans text-sm font-medium transition-ui hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
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

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 z-30">
            {mounted && (
              <>
                <button
                  onClick={toggleEmployerMode}
                  className={cn(
                    "group inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-0 px-2.5 font-mono text-xs font-semibold tracking-wide uppercase transition-ui focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:px-3 touch-manipulation",
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
                  <span className="relative inline-flex items-center max-[380px]:sr-only">
                    <svg
                      viewBox="0 0 156 44"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                      className={cn(
                        "pointer-events-none absolute -inset-x-5 -inset-y-4 h-[calc(100%+34px)] w-[calc(100%+42px)] transition-ui",
                        isEmployerMode
                          ? "text-primary opacity-95 hidden"
                          : "text-primary/80 opacity-100",
                      )}
                    >
                      <ellipse
                        cx="78"
                        cy="22"
                        rx="70"
                        ry="15.2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        pathLength={1}
                        className={cn(
                          "transition-[stroke-dashoffset,opacity] duration-500 ease-out [stroke-dasharray:1] [stroke-dashoffset:1.08]",
                          isEmployerMode
                            ? "opacity-100 [stroke-dashoffset:0]"
                            : "opacity-90 [stroke-dashoffset:1.08]",
                        )}
                      >
                        {!isEmployerMode ? (
                          <animate
                            attributeName="stroke-dashoffset"
                            values="1.08;0;1.08"
                            dur="1.65s"
                            repeatCount="indefinite"
                          />
                        ) : null}
                      </ellipse>
                      <ellipse
                        cx="78"
                        cy="22"
                        rx="66.3"
                        ry="13.4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.15"
                        strokeLinecap="round"
                        transform="rotate(-1.7 78 22)"
                        pathLength={1}
                        className={cn(
                          "transition-[stroke-dashoffset,opacity] duration-700 ease-out [stroke-dasharray:1] [stroke-dashoffset:1.16]",
                          isEmployerMode
                            ? "opacity-80 [stroke-dashoffset:0]"
                            : "opacity-55 [stroke-dashoffset:1.16]",
                        )}
                      >
                        {!isEmployerMode ? (
                          <animate
                            attributeName="stroke-dashoffset"
                            values="1.16;0;1.16"
                            dur="1.95s"
                            begin="0.18s"
                            repeatCount="indefinite"
                          />
                        ) : null}
                      </ellipse>
                    </svg>
                    <span className="relative z-10">Recruiter</span>
                  </span>
                </button>

                <MagneticLink>
                  <button
                    onClick={toggleTheme}
                    className="min-h-11 min-w-11 cursor-pointer rounded-full p-2 text-foreground transition-[color,background-color] duration-200 hover:bg-black/5 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background touch-manipulation"
                    aria-label="Toggle theme"
                    type="button"
                  >
                    {resolvedTheme === "dark" ? (
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
          "md:hidden w-min fixed z-40 flex flex-col items-stretch overflow-visible rounded-0 bg-background/92 shadow-[0_6px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-opacity duration-300 motion-reduce:transition-none dark:shadow-[0_8px_40px_rgba(0,0,0,0.4)]",
          pillReady ? "opacity-100" : "opacity-0",
          isPillIdle ? "opacity-55" : "opacity-100",
        )}
        onPointerDown={() => {
          setIsPillIdle(false);
          if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
          idleTimeoutRef.current = setTimeout(() => setIsPillIdle(true), 2000);
        }}
        onPointerEnter={() => {
          setIsPillIdle(false);
          if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
          idleTimeoutRef.current = setTimeout(() => setIsPillIdle(true), 2000);
        }}
        onTouchStart={() => {
          setIsPillIdle(false);
          if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
          idleTimeoutRef.current = setTimeout(() => setIsPillIdle(true), 2000);
        }}
      >
        {/* #-shaped frame: horizontal + vertical rules slightly past the image */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-1/2 z-10 h-0 w-[120%] -translate-x-1/2 border-t border-foreground/20"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 z-10 h-0 w-[120%] -translate-x-1/2 border-b border-foreground/20"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-0 z-10 h-[110%] w-0 -translate-y-1/2 border-l border-foreground/20"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-0 z-10 h-[110%] w-0 -translate-y-1/2 border-r border-foreground/20"
        />
        <button
          type="button"
          aria-label="Drag to move navigation"
          className="touch-none flex w-full shrink-0 cursor-grab items-center justify-center border-b border-(--glass-border) bg-foreground/3 py-1.5 text-theme-muted transition-[color] active:cursor-grabbing hover:text-foreground [-webkit-tap-highlight-color:transparent]"
          onPointerDown={onDragPointerDown}
          onPointerMove={onDragPointerMove}
          onPointerUp={onDragPointerEnd}
          onPointerCancel={onDragPointerEnd}
        >
          <GripHorizontal
            className="h-5 w-5 shrink-0 opacity-70"
            aria-hidden="true"
          />
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
                  "block min-h-8 w-min rounded-full px-1 py-1.5 text-right font-sans text-[0.85rem] font-medium lowercase tracking-tight transition-ui focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background [-webkit-tap-highlight-color:transparent]",
                  isActive
                    ? "text-primary"
                    : "text-theme-muted hover:text-foreground",
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

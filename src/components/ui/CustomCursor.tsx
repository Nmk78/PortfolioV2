"use client";
import { useEffect, useRef } from "react";

type CursorVariant = "default" | "link" | "external" | "button" | "input" | "drag";

type CursorState = {
  variant: CursorVariant;
  label: string;
  active: boolean;
};

function resolveCursorState(target: EventTarget | null): CursorState {
  const element = target instanceof Element ? target.closest<HTMLElement>("[data-cursor], a, button, input, textarea, select, summary, [role='button'], [draggable='true']") : null;

  if (!element) return { variant: "default", label: "", active: false };

  const customVariant = element.dataset.cursor as CursorVariant | undefined;
  const customLabel = element.dataset.cursorLabel;
  if (customVariant) {
    return {
      variant: customVariant,
      label: customLabel ?? "",
      active: customVariant !== "default",
    };
  }

  if (element.matches("input, textarea, select")) {
    return { variant: "input", label: "Type", active: true };
  }

  if (element.matches("button, [role='button'], summary")) {
    return { variant: "button", label: "Click", active: true };
  }

  if (element.matches("[draggable='true']")) {
    return { variant: "drag", label: "Drag", active: true };
  }

  if (element.matches("a")) {
    const href = element.getAttribute("href") ?? "";
    const targetAttr = element.getAttribute("target");
    const isExternal =
      targetAttr === "_blank" || href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:") || href.startsWith("tel:");
    return isExternal
      ? { variant: "external", label: "Open in new tab", active: true }
      : { variant: "link", label: "Open", active: true };
  }

  return { variant: "default", label: "", active: false };
}

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const targetPositionRef = useRef({ x: 0, y: 0 });
  const currentPositionRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);
  const isPointerInitializedRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const lastIntentUpdateMsRef = useRef(0);
  const currentStateRef = useRef<CursorState>({ variant: "default", label: "", active: false });

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    document.body.classList.add("custom-cursor-active");

    const variantClassMap: Record<CursorVariant, string> = {
      default: "border-white/55 bg-white/25 text-foreground",
      external: "border-primary/70 bg-primary/20 text-primary",
      link: "border-foreground/40 bg-foreground/15 text-foreground",
      button: "border-accent/65 bg-accent/20 text-foreground",
      input: "border-emerald-500/60 bg-emerald-500/15 text-foreground",
      drag: "border-amber-500/60 bg-amber-500/15 text-foreground",
    };

    const applyCursorState = (nextState: CursorState) => {
      const prev = currentStateRef.current;
      if (prev.variant === nextState.variant && prev.label === nextState.label && prev.active === nextState.active) return;

      cursor.classList.remove(
        "border-white/55",
        "bg-white/25",
        "text-foreground",
        "border-primary/70",
        "bg-primary/20",
        "text-primary",
        "border-foreground/40",
        "bg-foreground/15",
        "border-accent/65",
        "bg-accent/20",
        "border-emerald-500/60",
        "bg-emerald-500/15",
        "border-amber-500/60",
        "bg-amber-500/15",
        "opacity-100",
        "opacity-85"
      );
      cursor.classList.add(...variantClassMap[nextState.variant].split(" "));
      cursor.classList.add(nextState.active ? "opacity-100" : "opacity-85");

      if (labelRef.current) labelRef.current.textContent = nextState.label;
      currentStateRef.current = nextState;
    };

    const onPointerMove = (e: PointerEvent) => {
      targetPositionRef.current.x = e.clientX;
      targetPositionRef.current.y = e.clientY;

      if (!isPointerInitializedRef.current) {
        currentPositionRef.current.x = e.clientX;
        currentPositionRef.current.y = e.clientY;
        isPointerInitializedRef.current = true;
      }

      const now = performance.now();
      if (now - lastIntentUpdateMsRef.current > 80) {
        applyCursorState(resolveCursorState(e.target));
        lastIntentUpdateMsRef.current = now;
      }

      if (!isAnimatingRef.current) {
        isAnimatingRef.current = true;
        animationFrameRef.current = window.requestAnimationFrame(animateCursor);
      }
    };

    const onPointerLeaveWindow = () => {
      applyCursorState({ variant: "default", label: "", active: false });
    };

    const onPointerDown = () => {
      cursor.classList.add("opacity-75");
    };

    const onPointerUp = () => {
      cursor.classList.remove("opacity-75");
    };

    const CURSOR_OFFSET_X = 0;
    const CURSOR_OFFSET_Y = 0;

    const animateCursor = () => {
      const target = targetPositionRef.current;
      const current = currentPositionRef.current;
      const ease = 1;

      current.x += (target.x - current.x) * ease;
      current.y += (target.y - current.y) * ease;

      cursor.style.transform = `translate3d(${current.x + CURSOR_OFFSET_X}px, ${current.y + CURSOR_OFFSET_Y}px, 0)`;
      const dx = Math.abs(target.x - current.x);
      const dy = Math.abs(target.y - current.y);

      if (dx < 0.1 && dy < 0.1) {
        isAnimatingRef.current = false;
        animationFrameRef.current = null;
        return;
      }

      animationFrameRef.current = window.requestAnimationFrame(animateCursor);
    };

    applyCursorState({ variant: "default", label: "", active: false });
    isAnimatingRef.current = true;
    animationFrameRef.current = window.requestAnimationFrame(animateCursor);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("blur", onPointerLeaveWindow);
    document.addEventListener("mouseleave", onPointerLeaveWindow);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("blur", onPointerLeaveWindow);
      document.removeEventListener("mouseleave", onPointerLeaveWindow);
      if (animationFrameRef.current !== null) window.cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 p-1 space-x-1 hidden pointer-events-none z-9999 md:flex items-center  rounded-full boorder-foreground dark:border text-[10px] font-mono tracking-wide uppercase will-change-transform transition-[opacity,background-color,border-color,color] duration-150`}
    >
      <span className="h-2.5 w-2.5 rounded-full bg-current opacity-85" />
      <span ref={labelRef} className="whitespace-nowrap" />
    </div>
  );
}

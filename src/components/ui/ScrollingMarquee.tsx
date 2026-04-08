"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

interface ScrollingMarqueeProps {
  items: string[];
  className?: string;
  speed?: number;
}

export function ScrollingMarquee({ items, className, speed = 20 }: ScrollingMarqueeProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!marqueeRef.current || !containerRef.current) return;
    
    // Calculate full width to loop seamlessly
    const marqueeWidth = marqueeRef.current.scrollWidth / 2;

    const ctx = gsap.context(() => {
      gsap.to(marqueeRef.current, {
        x: -marqueeWidth,
        ease: "none",
        duration: speed,
        repeat: -1,
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, [speed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-[100vw] left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] overflow-hidden rotate-[-2deg] my-20 py-4 bg-primary text-white font-bold text-2xl uppercase tracking-widest",
        className
      )}
    >
      <div className="flex whitespace-nowrap" ref={marqueeRef}>
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} className="mx-8">
            {item} <span className="mx-8 text-black opacity-30">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}

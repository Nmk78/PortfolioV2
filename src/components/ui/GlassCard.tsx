"use client";
import * as React from "react"
import { cn } from "@/lib/utils"

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverGlow?: boolean
}

export function GlassCard({ className, hoverGlow = true, children, ...props }: GlassCardProps) {
  return (
    <div className="relative h-full" {...props}>
      <div
        className={cn(
          "glass-card transition-ui transition-ui-slow w-full h-full relative overflow-hidden group",
          hoverGlow && "hover:border-primary/30 hover:shadow-[0_12px_60px_rgba(0,0,0,0.08)]",
          className
        )}
      >
        {hoverGlow && (
          <div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-ui transition-ui-slow z-0 bg-radial-[at_30%_20%] from-primary/20 via-accent/10 to-transparent"
          />
        )}
        <div className="relative z-10 w-full h-full">{children}</div>
      </div>
    </div>
  )
}

import type { SVGProps } from "react";
import Image from "next/image";
import {
  Atom,
  Database,
  Flame,
  MoveHorizontal,
  Server,
  Smartphone,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Github(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4" />
    </svg>
  );
}

function BrandImg({
  src,
  className,
  invertOnDark,
}: {
  src: string;
  className?: string;
  invertOnDark?: boolean;
}) {
  return (
    <Image
      src={src}
      alt=""
      width={24}
      height={24}
      className={cn(
        "object-contain",
        invertOnDark && "invert-on-dark",
        className,
      )}
    />
  );
}

const lucideBase = "shrink-0 text-foreground";

/**
 * Renders the icon for a tech name from `techStacks` in portfolio-identity.
 */
export function TechStackIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const lucideIcon = cn(
    lucideBase,
    "h-6 w-6",
    className,
  );

  switch (name) {
    case "Next.js":
      return (
        <BrandImg
          src="/icons/next.svg"
          className={cn("h-6 w-6 object-contain", className)}
          invertOnDark
        />
      );
    case "React":
      return <Atom className={lucideIcon} aria-hidden />;
    case "React Native":
      return <Smartphone className={lucideIcon} aria-hidden />;
    case "Expo":
      return (
        <BrandImg
          src="/icons/expo.svg"
          className={cn("h-6 w-6 object-contain", className)}
          invertOnDark
        />
      );
    case "TypeScript":
      return (
        <BrandImg
          src="/icons/typescript.svg"
          className={cn("h-6 w-6 object-contain", className)}
        />
      );
    case "Tailwind":
      return (
        <BrandImg
          src="/icons/tailwind.svg"
          className={cn("h-6 w-6 object-contain", className)}
        />
      );
    case "Node.js":
      return <Server className={lucideIcon} aria-hidden />;
    case "Docker":
      return (
        <BrandImg
          src="/icons/docker.svg"
          className={cn("h-6 w-6 object-contain", className)}
        />
      );
    case "Convex":
      return (
        <BrandImg
          src="/icons/convex.svg"
          className={cn("h-6 w-6 object-contain", className)}
        />
      );
    case "Supabase":
      return (
        <Database
          className={cn(
            lucideIcon,
            "text-emerald-600 dark:text-emerald-400",
          )}
          aria-hidden
        />
      );
    case "MongoDB":
      return (
        <BrandImg
          src="/icons/mongodb.svg"
          className={cn("h-6 w-6 object-contain", className)}
        />
      );
    case "PostgreSQL":
      return (
        <Database
          className={cn(lucideIcon, "text-sky-700 dark:text-sky-400")}
          aria-hidden
        />
      );
    case "Framer Motion":
      return <MoveHorizontal className={lucideIcon} aria-hidden />;
    case "GSAP":
      return <Zap className={lucideIcon} aria-hidden />;
    case "Nest.js":
      return (
        <BrandImg
          src="/icons/nest.svg"
          className={cn("h-6 w-6 object-contain", className)}
        />
      );
    default:
      return (
        <span
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border border-dashed border-foreground/30 font-mono text-[9px] font-bold text-theme-muted",
            className,
          )}
          aria-hidden
        >
          {name.slice(0, 2).toUpperCase()}
        </span>
      );
  }
}

/** Decorative #-shaped frame (horizontal + vertical rules slightly past the box). */
export function HashFrameLines({ className }: { className?: string }) {
  return (
    <>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-0 left-1/2 z-10 h-0 w-[108%] -translate-x-1/2 border-t border-foreground/25",
          className,
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute bottom-0 left-1/2 z-10 h-0 w-[108%] -translate-x-1/2 border-b border-foreground/25",
          className,
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-1/2 left-0 z-10 h-[106%] w-0 -translate-y-1/2 border-l border-foreground/25",
          className,
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-1/2 right-0 z-10 h-[106%] w-0 -translate-y-1/2 border-r border-foreground/25",
          className,
        )}
      />
    </>
  );
}

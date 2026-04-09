"use client";

import { useMemo } from "react";
import Image from "next/image";
import styles from "./pixel-reveal-portrait.module.css";

interface PixelRevealPortraitProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

function createSeededRng(seedText: string) {
  let hash = 2166136261;
  for (let i = 0; i < seedText.length; i++) {
    hash ^= seedText.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  let seed = hash >>> 0;
  return function nextRandom() {
    seed += 0x6d2b79f5;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function PixelRevealPortrait({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
}: PixelRevealPortraitProps) {
  const pieces = useMemo(() => {
    const columns = 16;
    const rows = 20;
    const total = columns * rows;
    const rng = createSeededRng(`${src}:${width}x${height}`);

    return Array.from({ length: total }, (_, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);
      const dx = Math.round((rng() - 0.5) * 320);
      const dy = Math.round((rng() - 0.5) * 320);
      const delay = Math.round(rng() * 900);
      const duration = 700 + Math.round(rng() * 800);

      return {
        id: `piece-${col}-${row}`,
        x: col,
        y: row,
        dx,
        dy,
        delay,
        duration,
        columns,
        rows,
      };
    });
  }, [height, src, width]);

  return (
    <div className={`${styles.wrapper} ${className ?? ""}`}>
      <div className={styles.imageStage}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className={styles.image}
        />

        <div className={styles.pixelLayer} aria-hidden="true">
          {pieces.map((piece) => (
            <span
              key={piece.id}
              className={styles.piece}
              style={
                {
                  "--x": piece.x,
                  "--y": piece.y,
                  "--dx": `${piece.dx}px`,
                  "--dy": `${piece.dy}px`,
                  "--delay": `${piece.delay}ms`,
                  "--duration": `${piece.duration}ms`,
                  "--cols": piece.columns,
                  "--rows": piece.rows,
                  "--img": `url("${src}")`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

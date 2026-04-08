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

    return Array.from({ length: total }, (_, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);
      const dx = Math.round((Math.random() - 0.5) * 320);
      const dy = Math.round((Math.random() - 0.5) * 320);
      const delay = Math.round(Math.random() * 900);
      const duration = 700 + Math.round(Math.random() * 800);

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
  }, []);

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

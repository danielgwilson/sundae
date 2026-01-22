"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function HalftoneDotGradient({
  className,
  variant = "subtle",
  behavior = "drift",
  style,
}: {
  className?: string;
  variant?: "subtle" | "hero";
  behavior?: "off" | "drift" | "cursor";
  style?: React.CSSProperties;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (behavior === "off") return;

    const el = ref.current;
    if (!el) return;

    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionMq.matches) return;

    const coarsePointerMq = window.matchMedia("(pointer: coarse)");
    const effectiveBehavior =
      behavior === "cursor" && coarsePointerMq.matches ? "drift" : behavior;

    let raf = 0;
    let mounted = true;

    let targetX = 0.5;
    let targetY = variant === "hero" ? 0.18 : 0.12;
    let currentX = targetX;
    let currentY = targetY;
    let lastX = currentX;
    let lastY = currentY;
    let lastT = performance.now();
    let lastPointerAt = performance.now();
    let energy = 0;

    const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const setVars = (x: number, y: number, e: number) => {
      el.style.setProperty("--halftone-focus-x", `${(x * 100).toFixed(2)}%`);
      el.style.setProperty("--halftone-focus-y", `${(y * 100).toFixed(2)}%`);

      const parallax = variant === "hero" ? 26 : 14;
      el.style.setProperty(
        "--halftone-grid-x",
        `${((x - 0.5) * parallax).toFixed(2)}px`,
      );
      el.style.setProperty(
        "--halftone-grid-y",
        `${((y - 0.2) * parallax).toFixed(2)}px`,
      );
      el.style.setProperty("--halftone-energy", e.toFixed(3));
    };

    const onPointerMove = (event: PointerEvent) => {
      if (effectiveBehavior !== "cursor") return;
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      targetX = clamp01(x);
      targetY = clamp01(y);
      lastPointerAt = performance.now();
    };

    if (effectiveBehavior === "cursor") {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    const tick = (t: number) => {
      if (!mounted) return;
      const dt = Math.max(1, t - lastT);
      lastT = t;

      const time = t / 1000;
      if (effectiveBehavior === "cursor" && t - lastPointerAt > 900) {
        targetX = lerp(targetX, 0.5, 0.06);
        targetY = lerp(targetY, variant === "hero" ? 0.18 : 0.12, 0.06);
      }

      const driftMag =
        effectiveBehavior === "drift"
          ? variant === "hero"
            ? 0.06
            : 0.04
          : 0.018;
      const driftX = Math.sin(time * 0.33) * driftMag;
      const driftY = Math.cos(time * 0.28) * driftMag;

      const aimX = clamp01(targetX + driftX);
      const aimY = clamp01(targetY + driftY);

      const ease = effectiveBehavior === "cursor" ? 0.085 : 0.05;
      currentX = lerp(currentX, aimX, 1 - (1 - ease) ** (dt / 16.67));
      currentY = lerp(currentY, aimY, 1 - (1 - ease) ** (dt / 16.67));

      const vx = (currentX - lastX) / (dt / 16.67);
      const vy = (currentY - lastY) / (dt / 16.67);
      const v = Math.min(1, Math.hypot(vx, vy) * 0.45);
      energy = lerp(energy, v, 1 - (1 - 0.12) ** (dt / 16.67));

      lastX = currentX;
      lastY = currentY;

      setVars(currentX, currentY, energy);
      raf = window.requestAnimationFrame(tick);
    };

    setVars(currentX, currentY, energy);
    raf = window.requestAnimationFrame(tick);

    return () => {
      mounted = false;
      window.cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [behavior, variant]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 halftone-dot-gradient",
        variant === "hero" ? "halftone-dot-gradient--hero" : null,
        className,
      )}
      style={style}
    />
  );
}

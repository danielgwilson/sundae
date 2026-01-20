"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Cluster = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
};

type Dot = {
  cluster: number;
  ox: number;
  oy: number;
  weight: number;
  size: number;
  glow: number;
  color: string;
  spriteIndex: number;
};

function hash(n: number) {
  n = n ^ 61 ^ (n >>> 16);
  n = n + (n << 3);
  n = n ^ (n >>> 4);
  n = n * 0x27d4eb2d;
  return n ^ (n >>> 15);
}

function rand01(seed: number) {
  return (hash(seed) >>> 0) / 4294967295;
}

function randSigned(seed: number) {
  return rand01(seed) * 2 - 1;
}

function gauss(seed: number) {
  const u1 = Math.max(1e-6, rand01(seed * 13 + 1));
  const u2 = rand01(seed * 13 + 2);
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function cssVar(root: HTMLElement, name: string, fallback: string) {
  const value = getComputedStyle(root).getPropertyValue(name).trim();
  return value || fallback;
}

function toRgbaColor(color: string, probe: HTMLElement) {
  probe.style.color = color;
  const computed = getComputedStyle(probe).color;
  return computed || "rgba(160,255,180,0.18)";
}

function withAlpha(color: string, alpha: number) {
  if (color.startsWith("rgba(")) {
    return color.replace(/rgba\(([^)]+),\s*[\d.]+\)/, `rgba($1, ${alpha})`);
  }
  if (color.startsWith("rgb(")) {
    return color.replace("rgb(", "rgba(").replace(")", `, ${alpha})`);
  }
  return color;
}

function makeDotSprite(color: string, size: number) {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const g = c.getContext("2d");
  if (!g) return c;

  const r = size / 2;
  const grad = g.createRadialGradient(r, r, 0, r, r, r);
  grad.addColorStop(0, withAlpha(color, 0.9));
  grad.addColorStop(0.45, withAlpha(color, 0.28));
  grad.addColorStop(1, withAlpha(color, 0));
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

export function PixelCloudGrid({ className }: { className?: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasEl: HTMLCanvasElement = canvas;

    const ctxMaybe = canvasEl.getContext("2d", { alpha: true });
    if (!ctxMaybe) return;
    const ctx: CanvasRenderingContext2D = ctxMaybe;

    const root = document.documentElement;

    const probe = document.createElement("span");
    probe.style.position = "fixed";
    probe.style.opacity = "0";
    probe.style.pointerEvents = "none";
    document.body.appendChild(probe);

    let reducedMotion = false;
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion = motionMq.matches;

    let dpr = Math.min(2, window.devicePixelRatio || 1);
    let raf = 0;
    let lastT = 0;
    let lastDraw = 0;

    let palette: string[] = [];
    let sprites: HTMLCanvasElement[] = [];
    let clusters: Cluster[] = [];
    let dots: Dot[] = [];

    function readPalette() {
      const raw = [
        cssVar(root, "--pixel-cloud-a", "rgba(160,255,180,0.18)"),
        cssVar(root, "--pixel-cloud-b", "rgba(160,220,255,0.16)"),
        cssVar(root, "--pixel-cloud-c", "rgba(255,160,240,0.12)"),
      ];
      palette = raw.map((c) => toRgbaColor(c, probe));
      sprites = palette.map((c) => makeDotSprite(c, Math.round(56 * dpr)));
    }

    function rebuild() {
      readPalette();

      const w = window.innerWidth;
      const h = window.innerHeight;
      dpr = Math.min(2, window.devicePixelRatio || 1);

      canvasEl.width = Math.max(1, Math.floor(w * dpr));
      canvasEl.height = Math.max(1, Math.floor(h * dpr));

      canvasEl.style.width = `${w}px`;
      canvasEl.style.height = `${h}px`;

      const seedBase = Math.floor(rand01(w * 31 + h * 97) * 1e9);
      const isDark = root.classList.contains("dark");

      const clusterCount = w < 520 ? 5 : 8;
      clusters = Array.from({ length: clusterCount }).map((_, i) => {
        const seed = seedBase + i * 997;
        const speed = 0.06 + rand01(seed + 5) * 0.12;
        return {
          x: rand01(seed + 1) * w,
          y: rand01(seed + 2) * h,
          vx: randSigned(seed + 3) * speed,
          vy: randSigned(seed + 4) * speed * 0.6,
          phase: rand01(seed + 6) * Math.PI * 2,
        };
      });

      const area = w * h;
      const targetDots = Math.round(Math.min(1400, Math.max(520, area / 1700)));
      dots = Array.from({ length: targetDots }).map((_, i) => {
        const seed = seedBase + 10000 + i * 41;
        const cluster = Math.floor(rand01(seed + 1) * clusters.length);
        const spread = (w < 520 ? 62 : 86) * (0.75 + rand01(seed + 2) * 1.1);
        const ox = gauss(seed + 3) * spread;
        const oy = gauss(seed + 4) * spread * (0.75 + rand01(seed + 5) * 0.55);
        const radial = Math.min(
          1,
          Math.sqrt((ox * ox + oy * oy) / (spread * spread)),
        );
        const weight = Math.max(0.05, 1 - radial);
        const size = (0.85 + rand01(seed + 6) * 1.55) * (w < 520 ? 1.05 : 1);
        const glow = size * (6.2 + rand01(seed + 7) * 10.5);
        const color =
          palette[(i + cluster) % Math.max(1, palette.length)] ??
          palette[0] ??
          "rgba(160,255,180,0.18)";
        const spriteIndex =
          (i + cluster) % Math.max(1, sprites.length || palette.length || 1);

        return { cluster, ox, oy, weight, size, glow, color, spriteIndex };
      });

      // Dial down the “cheesy” feel on light backgrounds.
      if (!isDark) {
        dots = dots.map((d) => ({ ...d, glow: d.glow * 0.92 }));
      }
    }

    function drawFrame(t: number) {
      if (t - lastDraw < 26) return;
      lastDraw = t;

      const dtMs = Math.min(48, t - lastT || 16);
      const dt = dtMs / 1000;
      lastT = t;

      const w = canvasEl.width / dpr;
      const h = canvasEl.height / dpr;

      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      const isDark = root.classList.contains("dark");
      ctx.globalCompositeOperation = isDark ? "screen" : "multiply";

      // Slow drift + subtle “breathing”.
      for (let i = 0; i < clusters.length; i += 1) {
        const c = clusters[i];
        if (!c) continue;
        c.phase += dt * 0.18;
        c.x += c.vx * dt * 22;
        c.y += c.vy * dt * 22;
        c.y += Math.sin(c.phase) * dt * 10;

        if (c.x > w + 140) c.x = -140;
        if (c.x < -140) c.x = w + 140;
        if (c.y > h + 140) c.y = -140;
        if (c.y < -140) c.y = h + 140;
      }

      // Glow pass (high-end “misty” points).
      for (let i = 0; i < dots.length; i += 1) {
        const d = dots[i];
        if (!d) continue;
        const c = clusters[d.cluster];
        if (!c) continue;
        const x = c.x + d.ox;
        const y = c.y + d.oy;
        const alpha = Math.min(0.22, 0.1 + d.weight * 0.16);
        const sprite = sprites[d.spriteIndex] ?? sprites[0] ?? null;
        if (!sprite) continue;
        const r = d.glow;
        ctx.globalAlpha = alpha;
        ctx.drawImage(sprite, x - r, y - r, r * 2, r * 2);
      }

      // Crisp points.
      ctx.globalCompositeOperation = "source-over";
      for (let i = 0; i < dots.length; i += 1) {
        const d = dots[i];
        if (!d) continue;
        const c = clusters[d.cluster];
        if (!c) continue;
        const x = c.x + d.ox;
        const y = c.y + d.oy;
        const alpha = Math.min(0.62, 0.08 + d.weight * 0.56);
        ctx.beginPath();
        ctx.fillStyle = d.color;
        ctx.globalAlpha = alpha;
        ctx.arc(x, y, d.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    function tick(t: number) {
      drawFrame(t);
      if (!reducedMotion) raf = window.requestAnimationFrame(tick);
    }

    const onResize = () => {
      rebuild();
      drawFrame(performance.now());
    };

    const onMotionChange = () => {
      reducedMotion = motionMq.matches;
      window.cancelAnimationFrame(raf);
      drawFrame(performance.now());
      if (!reducedMotion) raf = window.requestAnimationFrame(tick);
    };

    const onThemeChange = () => {
      readPalette();
    };

    rebuild();
    drawFrame(performance.now());
    if (!reducedMotion) raf = window.requestAnimationFrame(tick);

    window.addEventListener("resize", onResize, { passive: true });
    motionMq.addEventListener("change", onMotionChange);

    const obs = new MutationObserver(onThemeChange);
    obs.observe(root, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      motionMq.removeEventListener("change", onMotionChange);
      obs.disconnect();
      probe.remove();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      <div className="absolute inset-0 bg-background" />

      <div className="absolute inset-0 opacity-[0.55] [mask-image:radial-gradient(55%_55%_at_50%_12%,#000_25%,transparent_78%)]">
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[oklch(0.88_0.23_145/10%)] blur-3xl" />
        <div className="absolute -right-56 -top-44 h-[560px] w-[560px] rounded-full bg-[oklch(0.9_0.08_225/9%)] blur-3xl" />
      </div>

      <div className="absolute inset-0 pixel-grid opacity-[0.33] dark:opacity-[0.26]" />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-[0.82] mix-blend-multiply dark:mix-blend-screen"
      />

      <div className="absolute inset-0 pixel-noise opacity-[0.18] dark:opacity-[0.14]" />
    </div>
  );
}

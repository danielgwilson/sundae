"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Dot = {
  x: number;
  y: number;
  r: number;
  baseAlpha: number;
  color: string;
  bloom: number;
  seed: number;
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

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function fade(t: number) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function valueNoise2D(x: number, y: number, seed: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;

  const h00 = rand01(seed + xi * 374761 + yi * 668265);
  const h10 = rand01(seed + (xi + 1) * 374761 + yi * 668265);
  const h01 = rand01(seed + xi * 374761 + (yi + 1) * 668265);
  const h11 = rand01(seed + (xi + 1) * 374761 + (yi + 1) * 668265);

  const u = fade(xf);
  const v = fade(yf);

  const x1 = lerp(h00, h10, u);
  const x2 = lerp(h01, h11, u);
  return lerp(x1, x2, v);
}

function fbm2D(x: number, y: number, seed: number, octaves = 4) {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let norm = 0;

  for (let i = 0; i < octaves; i += 1) {
    value +=
      valueNoise2D(x * frequency, y * frequency, seed + i * 1013) * amplitude;
    norm += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return value / Math.max(1e-6, norm);
}

function cssVar(root: HTMLElement, name: string, fallback: string) {
  const value = getComputedStyle(root).getPropertyValue(name).trim();
  return value || fallback;
}

function toRgb(color: string, probe: HTMLElement) {
  probe.style.color = color;
  const computed = getComputedStyle(probe).color;
  return computed || "rgb(160,255,180)";
}

export function PixelCloudGrid({ className }: { className?: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const grainId = `grain-${React.useId().replaceAll(":", "")}`;

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const canvasEl: HTMLCanvasElement = canvas;
    const ctx2d: CanvasRenderingContext2D = ctx;

    const root = document.documentElement;
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const probe = document.createElement("span");
    probe.style.position = "fixed";
    probe.style.opacity = "0";
    probe.style.pointerEvents = "none";
    document.body.appendChild(probe);

    let dpr = Math.min(2, window.devicePixelRatio || 1);
    let dots: Dot[] = [];
    let raf = 0;
    let lastDraw = 0;
    let reducedMotion = motionMq.matches;

    const seedBase = 713_071;

    function buildDots() {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvasEl.width = Math.max(1, Math.floor(w * dpr));
      canvasEl.height = Math.max(1, Math.floor(h * dpr));
      canvasEl.style.width = `${w}px`;
      canvasEl.style.height = `${h}px`;

      const isDark = root.classList.contains("dark");
      const palette = [
        toRgb(cssVar(root, "--pixel-cloud-a", "rgba(160,255,180,0.18)"), probe),
        toRgb(cssVar(root, "--pixel-cloud-b", "rgba(160,220,255,0.16)"), probe),
        toRgb(cssVar(root, "--pixel-cloud-c", "rgba(255,160,240,0.12)"), probe),
      ];

      const area = w * h;
      const target = Math.round(Math.min(3400, Math.max(1100, area / 1150)));
      const cell = Math.max(18, Math.min(34, Math.sqrt(area / target)));

      const xCells = Math.max(1, Math.floor(w / cell));
      const yCells = Math.max(1, Math.floor(h / cell));

      const next: Dot[] = [];
      let i = 0;

      // Structured “fields” driven by a calm FBM (no vectors, no drifting dots).
      for (let cy = 0; cy <= yCells; cy += 1) {
        for (let cx = 0; cx <= xCells; cx += 1) {
          const seed = seedBase + cx * 9176 + cy * 13849;
          const jx = (rand01(seed + 1) - 0.5) * cell * 0.92;
          const jy = (rand01(seed + 2) - 0.5) * cell * 0.92;
          const x = cx * cell + jx;
          const y = cy * cell + jy;

          // Radial mask keeps texture focused on hero/top, fades out edges.
          const mx = x / Math.max(1, w) - 0.52;
          const my = y / Math.max(1, h) - 0.22;
          const d = Math.sqrt(mx * mx * 1.15 + my * my * 1.65);
          const mask = 1 - smoothstep(0.25, 0.95, d);
          if (mask <= 0) continue;

          const field = fbm2D(x * 0.0024, y * 0.0024, seedBase + 31, 4);
          const density = smoothstep(0.38, 0.78, field) * mask;

          // Deterministic “keep” test -> controlled stipple, not uniform static.
          const keep = rand01(seed + 3);
          if (keep > density * 0.92) continue;

          const r = (0.72 + rand01(seed + 4) * 1.35) * (w < 520 ? 1.05 : 1);
          const baseAlpha =
            (0.028 + density * (isDark ? 0.11 : 0.085)) *
            (0.7 + rand01(seed + 5) * 0.75);
          const bloom = rand01(seed + 6) < 0.09 ? 0.55 + rand01(seed + 7) : 0;
          const color =
            palette[i % Math.max(1, palette.length)] ??
            palette[0] ??
            "rgb(160,255,180)";

          next.push({ x, y, r, baseAlpha, color, bloom, seed });
          i += 1;
        }
      }

      dots = next;
    }

    function draw(t: number) {
      // Throttle: calm, near-static motion (no obvious vectors).
      if (t - lastDraw < 40) {
        if (!reducedMotion) raf = window.requestAnimationFrame(draw);
        return;
      }
      lastDraw = t;

      const w = canvasEl.width / dpr;
      const h = canvasEl.height / dpr;
      const time = t / 1000;

      ctx2d.clearRect(0, 0, canvasEl.width, canvasEl.height);
      ctx2d.save();
      ctx2d.scale(dpr, dpr);

      const isDark = root.classList.contains("dark");
      ctx2d.globalCompositeOperation = isDark ? "screen" : "multiply";

      // A calm stipple field: static points, barely shifting opacity (no vectors).
      for (const d of dots) {
        const drift =
          fbm2D(
            d.x * 0.0105 + time * 0.028,
            d.y * 0.0105 - time * 0.022,
            seedBase + d.seed,
            3,
          ) *
            2 -
          1;

        const alpha = clamp01(d.baseAlpha * (1 + drift * 0.09));
        if (alpha <= 0.002) continue;

        // Rare micro-bloom adds depth without looking like “clouds”.
        if (d.bloom > 0) {
          ctx2d.beginPath();
          ctx2d.fillStyle = d.color;
          ctx2d.globalAlpha = alpha * 0.22 * d.bloom;
          ctx2d.arc(d.x, d.y, d.r * (2.25 + d.bloom), 0, Math.PI * 2);
          ctx2d.fill();
        }

        ctx2d.beginPath();
        ctx2d.fillStyle = d.color;
        ctx2d.globalAlpha = alpha;
        ctx2d.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx2d.fill();
      }

      // Gentle “lift” on the very top band (keeps it feeling expensive).
      const grad = ctx2d.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "rgba(255,255,255,0.22)");
      grad.addColorStop(0.38, "rgba(255,255,255,0)");
      ctx2d.globalCompositeOperation = isDark ? "screen" : "multiply";
      ctx2d.globalAlpha = isDark ? 0.22 : 0.14;
      ctx2d.fillStyle = grad;
      ctx2d.fillRect(0, 0, w, h);

      ctx2d.restore();

      if (!reducedMotion) raf = window.requestAnimationFrame(draw);
    }

    const onResize = () => {
      buildDots();
      draw(performance.now());
    };

    const onMotionChange = () => {
      reducedMotion = motionMq.matches;
      window.cancelAnimationFrame(raf);
      draw(performance.now());
      if (!reducedMotion) raf = window.requestAnimationFrame(draw);
    };

    const onThemeChange = () => {
      buildDots();
      draw(performance.now());
    };

    buildDots();
    draw(performance.now());
    if (!reducedMotion) raf = window.requestAnimationFrame(draw);

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

      {/* Soft brand wash (kept subtle; the texture is the point). */}
      <div className="absolute inset-0 opacity-[0.45] [mask-image:radial-gradient(55%_55%_at_50%_10%,#000_22%,transparent_78%)]">
        <div className="absolute -left-44 -top-48 h-[560px] w-[560px] rounded-full bg-[oklch(0.88_0.23_145/9%)] blur-3xl" />
        <div className="absolute -right-56 -top-52 h-[620px] w-[620px] rounded-full bg-[oklch(0.9_0.08_225/8%)] blur-3xl" />
        <div className="absolute -top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-[oklch(0.67_0.21_330/7%)] blur-3xl" />
      </div>

      {/* Very subtle structure grid for “technical calm”. */}
      <div className="absolute inset-0 pixel-grid opacity-[0.18] dark:opacity-[0.14]" />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full opacity-[0.78] mix-blend-multiply dark:mix-blend-screen"
      />

      {/* Algorithmic grain: subtle, non-tiled texture (SVG turbulence). */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.08] mix-blend-multiply dark:opacity-[0.07] dark:mix-blend-screen"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <filter id={grainId} x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves={2}
            seed={8}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${grainId})`} />
      </svg>
    </div>
  );
}

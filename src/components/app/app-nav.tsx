"use client";

import { usePathname } from "next/navigation";
import * as React from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/app/editor", label: "Editor" },
  { href: "/app/analytics", label: "Analytics" },
  { href: "/app/leads", label: "Leads" },
  { href: "/app/settings", label: "Settings" },
] as const;

export function AppNav({ className }: { className?: string }) {
  const pathname = usePathname();
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const linkRefs = React.useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicator, setIndicator] = React.useState<{
    left: number;
    width: number;
    opacity: number;
  }>({ left: 0, width: 0, opacity: 0 });

  const updateIndicator = React.useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const activeItem = NAV.find(
      (item) => pathname === item.href || pathname?.startsWith(item.href),
    );
    if (!activeItem) {
      setIndicator((prev) => ({ ...prev, opacity: 0 }));
      return;
    }

    const el = linkRefs.current[activeItem.href];
    if (!el) return;

    const c = container.getBoundingClientRect();
    const r = el.getBoundingClientRect();

    setIndicator({
      left: r.left - c.left,
      width: r.width,
      opacity: 1,
    });
  }, [pathname]);

  React.useLayoutEffect(() => {
    updateIndicator();
  }, [updateIndicator]);

  React.useEffect(() => {
    updateIndicator();
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(updateIndicator);
    ro.observe(container);
    window.addEventListener("resize", updateIndicator, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateIndicator);
    };
  }, [updateIndicator]);

  return (
    <div
      ref={containerRef}
      className={cn(
        [
          "relative flex flex-wrap items-center gap-1",
          "studio-nav overflow-hidden",
        ].join(" "),
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="studio-nav-indicator absolute inset-y-1 left-1 rounded-full transition-[transform,width,opacity] duration-300 ease-out"
        style={{
          width: `${Math.max(0, indicator.width)}px`,
          transform: `translateX(${indicator.left}px)`,
          opacity: indicator.opacity,
        }}
      />
      {NAV.map((item) => {
        const active =
          pathname === item.href || pathname?.startsWith(item.href);

        return (
          <a
            key={item.href}
            href={item.href}
            data-active={active ? "true" : "false"}
            className={cn(
              [
                "relative z-10 rounded-full px-4 py-2 text-sm font-semibold tracking-tight",
                "transition-[transform,color,opacity] duration-200",
                "hover:-translate-y-0.5",
                "data-[active=true]:text-primary-foreground data-[active=false]:text-muted-foreground",
                "data-[active=false]:hover:text-foreground",
              ].join(" "),
            )}
            ref={(node) => {
              linkRefs.current[item.href] = node;
            }}
          >
            {item.label}
          </a>
        );
      })}
    </div>
  );
}

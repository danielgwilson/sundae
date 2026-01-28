"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Tab = "build" | "preview";

export function EditorShell({
  build,
  preview,
}: {
  build: React.ReactNode;
  preview: React.ReactNode;
}) {
  const [tab, setTab] = React.useState<Tab>("build");
  const scrollY = React.useRef<Record<Tab, number>>({ build: 0, preview: 0 });

  const selectTab = React.useCallback(
    (next: Tab) => {
      const current: Tab = tab;
      scrollY.current[current] = window.scrollY;
      setTab(next);

      // Restore the previous scroll position for the target tab.
      window.setTimeout(() => {
        const target = scrollY.current[next] ?? 0;
        const maxY = Math.max(
          0,
          document.documentElement.scrollHeight - window.innerHeight,
        );
        window.scrollTo({ top: Math.min(target, maxY), behavior: "auto" });
      }, 0);
    },
    [tab],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className={cn(tab !== "build" && "hidden", "space-y-6 lg:block")}>
        <div className="sticky top-20 z-10 -mx-1 -mt-2 px-1 lg:hidden">
          <TabBar tab={tab} onChange={selectTab} />
        </div>
        {build}
      </div>

      <div className={cn(tab !== "preview" && "hidden", "space-y-4 lg:block")}>
        <div className="sticky top-20 z-10 -mx-1 -mt-2 px-1 lg:hidden">
          <TabBar tab={tab} onChange={selectTab} />
        </div>
        {preview}
      </div>
    </div>
  );
}

function TabBar({ tab, onChange }: { tab: Tab; onChange: (tab: Tab) => void }) {
  return (
    <div className="studio-tabbar relative">
      <div className="grid grid-cols-2 gap-1">
        <TabButton active={tab === "build"} onClick={() => onChange("build")}>
          Build
        </TabButton>
        <TabButton
          active={tab === "preview"}
          onClick={() => onChange("preview")}
        >
          Preview
        </TabButton>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        [
          "h-10 rounded-full px-4 text-sm font-semibold tracking-tight",
          "transition-[transform,background-color,box-shadow] duration-200",
          "active:scale-[0.99]",
        ].join(" "),
        active
          ? "bg-primary text-primary-foreground shadow-[0_18px_44px_-34px_oklch(0.17_0.02_265/45%)]"
          : "text-muted-foreground hover:bg-background/80 hover:text-foreground",
      )}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}

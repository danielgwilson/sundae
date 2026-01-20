"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/app/editor", label: "Editor" },
  { href: "/app/analytics", label: "Analytics" },
  { href: "/app/leads", label: "Leads" },
  { href: "/app/settings", label: "Settings" },
] as const;

export function AppNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1 rounded-full border bg-background/70 p-1 shadow-sm backdrop-blur",
        className,
      )}
    >
      {NAV.map((item) => {
        const active =
          pathname === item.href || pathname?.startsWith(item.href);

        return (
          <a
            key={item.href}
            href={item.href}
            data-active={active ? "true" : "false"}
            className={cn(
              "rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition",
              "hover:text-foreground",
              "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow-sm",
            )}
          >
            {item.label}
          </a>
        );
      })}
    </div>
  );
}

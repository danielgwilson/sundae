import type * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        [
          "w-full min-w-0",
          "h-11 rounded-2xl border border-black/10 bg-background px-4 text-sm text-foreground",
          "placeholder:text-muted-foreground",
          "shadow-[0_12px_26px_-22px_oklch(0.17_0.02_265/25%)]",
          "transition-[border-color,box-shadow,background-color] duration-200",
          "outline-none",
          "focus-visible:border-ring focus-visible:ring-ring/35 focus-visible:ring-[3px]",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "aria-invalid:ring-destructive/25 aria-invalid:border-destructive",
          "selection:bg-primary selection:text-primary-foreground",
          "file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

export { Input };

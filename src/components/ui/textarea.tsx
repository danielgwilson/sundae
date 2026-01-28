import type * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        [
          "flex field-sizing-content w-full min-w-0",
          "min-h-28 resize-y rounded-2xl border border-black/10 bg-background px-4 py-3 text-sm text-foreground",
          "placeholder:text-muted-foreground",
          "shadow-[0_12px_26px_-22px_oklch(0.17_0.02_265/25%)]",
          "transition-[border-color,box-shadow,background-color] duration-200",
          "outline-none",
          "focus-visible:border-ring focus-visible:ring-ring/35 focus-visible:ring-[3px]",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "aria-invalid:ring-destructive/25 aria-invalid:border-destructive",
          "selection:bg-primary selection:text-primary-foreground",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };

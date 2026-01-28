import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold tracking-tight",
    "transition-[transform,box-shadow,background-color,color,border-color] duration-200",
    "disabled:pointer-events-none disabled:opacity-50",
    "shrink-0 [&_svg]:shrink-0 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
    "outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    "aria-invalid:ring-destructive/25 aria-invalid:border-destructive",
    "select-none",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "overflow-hidden border border-black/10 bg-primary text-primary-foreground shadow-sm",
          "hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-18px_oklch(0.17_0.02_265/45%)]",
          "active:translate-y-0 active:shadow-[0_10px_24px_-18px_oklch(0.17_0.02_265/42%)]",
          "before:absolute before:inset-0 before:opacity-0 before:transition-opacity",
          "before:bg-[radial-gradient(420px_220px_at_20%_0%,oklch(1_0_0/35%),transparent_60%)]",
          "hover:before:opacity-100",
        ].join(" "),
        destructive: [
          "overflow-hidden border border-black/10 bg-destructive text-white shadow-sm",
          "hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-20px_oklch(0.62_0.25_25/55%)]",
          "active:translate-y-0",
          "focus-visible:ring-destructive/35",
        ].join(" "),
        outline: [
          "border bg-background text-foreground shadow-sm",
          "hover:-translate-y-0.5 hover:bg-background/95 hover:shadow-[0_14px_34px_-22px_oklch(0.17_0.02_265/35%)]",
          "active:translate-y-0",
        ].join(" "),
        secondary: [
          "border bg-secondary text-secondary-foreground shadow-sm",
          "hover:-translate-y-0.5 hover:bg-secondary/80",
          "active:translate-y-0",
        ].join(" "),
        ghost: [
          "border border-transparent bg-transparent text-foreground",
          "hover:bg-accent/60 hover:-translate-y-0.5",
          "active:translate-y-0",
        ].join(" "),
        link: "border-0 bg-transparent p-0 text-foreground underline underline-offset-4 hover:text-foreground/80",
      },
      size: {
        default: "h-10 rounded-2xl px-4 has-[>svg]:px-3",
        sm: "h-9 rounded-2xl gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-11 rounded-2xl px-6 has-[>svg]:px-4",
        icon: "size-10 rounded-2xl",
        "icon-sm": "size-9 rounded-2xl",
        "icon-lg": "size-11 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };

"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

function coerceHex(value: string): string | null {
  const v = value.trim();
  if (/^#[0-9a-f]{6}$/i.test(v)) return v;
  if (/^#[0-9a-f]{3}$/i.test(v)) {
    const r = v[1];
    const g = v[2];
    const b = v[3];
    if (!r || !g || !b) return null;
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  return null;
}

export function ColorStringField({
  label,
  name,
  defaultValue,
  placeholder,
  description,
  className,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  description?: string;
  className?: string;
}) {
  const [value, setValue] = React.useState(defaultValue ?? "");
  const id = React.useId();

  const hex = coerceHex(value);
  const pickerValue = hex ?? "#000000";

  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <div
            aria-hidden="true"
            className="h-11 w-11 rounded-2xl border border-black/10 shadow-[0_10px_24px_-18px_oklch(0.17_0.02_265/28%)]"
            style={{
              background: value || "transparent",
            }}
          />
          <input
            aria-label={`${label} color picker`}
            className="absolute inset-0 h-11 w-11 cursor-pointer opacity-0"
            type="color"
            value={pickerValue}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <input
          id={id}
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "studio-input h-11 w-full min-w-0 rounded-2xl px-4 text-sm text-foreground shadow-[0_12px_26px_-22px_oklch(0.17_0.02_265/25%)] outline-none transition-[border-color,box-shadow] duration-200",
            "focus-visible:border-ring focus-visible:ring-ring/35 focus-visible:ring-[3px]",
          )}
          inputMode="text"
          autoComplete="off"
        />
      </div>
      {description ? (
        <div className="text-xs text-muted-foreground">{description}</div>
      ) : null}
    </div>
  );
}

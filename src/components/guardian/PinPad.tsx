import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface PinPadProps {
  length?: number;
  value: string;
  onChange: (v: string) => void;
  onComplete?: (v: string) => void;
  error?: boolean;
  label?: string;
}

export function PinPad({ length = 4, value, onChange, onComplete, error, label }: PinPadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (value.length === length && onComplete) onComplete(value);
  }, [value, length, onComplete]);

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      {label && <div className="text-sm text-muted-foreground">{label}</div>}
      <button
        type="button"
        className="flex gap-3"
        onClick={() => inputRef.current?.focus()}
      >
        {Array.from({ length }).map((_, i) => {
          const filled = i < value.length;
          return (
            <div
              key={i}
              className={cn(
                "h-14 w-12 rounded-xl border-2 flex items-center justify-center text-2xl font-semibold transition-all",
                error
                  ? "border-destructive"
                  : filled
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card",
                focused && i === value.length && "ring-2 ring-primary",
              )}
            >
              {filled ? "●" : ""}
            </div>
          );
        })}
      </button>
      <input
        ref={inputRef}
        type="tel"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]*"
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => {
          const v = e.target.value.replace(/\D/g, "").slice(0, length);
          onChange(v);
        }}
        className="sr-only"
      />
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { RiArrowDownSLine } from "@remixicon/react";
import { Text } from "@/components/Text";
import { cn } from "@/shared/utils/cn";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
}

export function Select({ value, onChange, options, className }: SelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = options.find((opt) => opt.value === value);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative shrink-0", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 py-2"
      >
        <Text as="span" variant="body-2">
          {selected?.label}
        </Text>
        <RiArrowDownSLine
          className={cn("text-secondary h-4 w-4 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <ul className="border-gray absolute top-full left-0 z-10 mt-2 w-28 overflow-hidden rounded-lg border bg-white py-1 shadow-lg">
          {options
            .filter((opt) => opt.value !== value)
            .map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className="block w-full px-3 py-2 text-left"
                >
                  <Text as="span" variant="body-2" color="secondary">
                    {opt.label}
                  </Text>
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

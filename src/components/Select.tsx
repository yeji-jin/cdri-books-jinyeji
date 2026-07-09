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
  label: string;
  className?: string;
}

export function Select({ value, onChange, options, label, className }: SelectProps) {
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
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1 py-2 w-25 border-gray justify-between border-b"
      >
        <Text as="span" variant="body-2" className="font-bold">
          {selected?.label}
        </Text>
        <RiArrowDownSLine
          aria-hidden="true"
          className={cn("text-secondary h-4 w-4 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={label}
          className="border-gray absolute top-full left-0 z-10 mt-2 w-25 overflow-hidden border bg-white py-1 shadow-lg"
        >
          {options
            .filter((opt) => opt.value !== value)
            .map((opt) => (
              <li key={opt.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={false}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className="block w-full px-2 py-1 text-left"
                >
                  <Text as="span" variant="body-2" color="secondary" className="font-medium">
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

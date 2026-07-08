"use client";

import { useIsFetching } from "@tanstack/react-query";
import { cn } from "@/shared/utils/cn";

export function GlobalLoadingBar() {
  const isFetching = useIsFetching() > 0;

  return (
    <div
      aria-hidden
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden bg-transparent transition-opacity duration-200",
        isFetching ? "opacity-100" : "opacity-0",
      )}
    >
      <div className="animate-loading-bar bg-accent h-full w-1/2" />
    </div>
  );
}

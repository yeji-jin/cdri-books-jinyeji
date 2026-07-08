"use client";

import { Toaster } from "sonner";
import { QueryProvider } from "./QueryProvider";
import { GlobalLoadingBar } from "@/components/GlobalLoadingBar";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <GlobalLoadingBar />
      {children}
      <Toaster position="top-center" richColors />
    </QueryProvider>
  );
}

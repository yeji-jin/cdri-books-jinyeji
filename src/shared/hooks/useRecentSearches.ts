"use client";

import { useCallback, useEffect, useState } from "react";
import { readJSON, writeJSON } from "@/shared/utils/storage";

const STORAGE_KEY = "certicos-recent-searches";
const MAX_ITEMS = 8;

export function useRecentSearches() {
  const [terms, setTerms] = useState<string[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTerms(readJSON(STORAGE_KEY, []));
  }, []);

  const addTerm = useCallback((term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;

    setTerms((prev) => {
      const next = [trimmed, ...prev.filter((t) => t !== trimmed)].slice(0, MAX_ITEMS);
      writeJSON(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const removeTerm = useCallback((term: string) => {
    setTerms((prev) => {
      const next = prev.filter((t) => t !== term);
      writeJSON(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return { terms, addTerm, removeTerm };
}

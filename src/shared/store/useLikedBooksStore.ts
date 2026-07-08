import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Book } from "@/shared/types/book";

interface LikedBooksState {
  liked: Record<string, Book>;
  toggleLike: (book: Book) => void;
}

export const useLikedBooksStore = create<LikedBooksState>()(
  persist(
    (set) => ({
      liked: {},
      toggleLike: (book) =>
        set((state) => {
          const next = { ...state.liked };
          if (next[book.isbn]) {
            delete next[book.isbn];
          } else {
            next[book.isbn] = book;
          }
          return { liked: next };
        }),
    }),
    { name: "certicos-liked-books" },
  ),
);

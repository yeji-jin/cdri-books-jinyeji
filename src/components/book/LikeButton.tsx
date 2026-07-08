"use client";

import { RiHeartFill, RiHeartLine } from "@remixicon/react";
import { useLikedBooksStore } from "@/shared/store/useLikedBooksStore";
import type { Book } from "@/shared/types/book";

const ICON_SIZE = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
} as const;

interface LikeButtonProps {
  book: Book;
  size?: keyof typeof ICON_SIZE;
}

export function LikeButton({ book, size = "md" }: LikeButtonProps) {
  const liked = useLikedBooksStore((state) => Boolean(state.liked[book.isbn]));
  const toggleLike = useLikedBooksStore((state) => state.toggleLike);

  const Icon = liked ? RiHeartFill : RiHeartLine;

  return (
    <button
      type="button"
      aria-label={liked ? "찜하기 취소" : "찜하기"}
      onClick={() => toggleLike(book)}
      className="text-red"
    >
      <Icon className={ICON_SIZE[size]} />
    </button>
  );
}

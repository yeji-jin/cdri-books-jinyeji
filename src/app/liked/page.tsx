"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLikedBooksStore } from "@/shared/store/useLikedBooksStore";
import { BookList } from "@/components/book/BookList";
import { Text } from "@/components/Text";
import { BOOK_PAGE_SIZE } from "@/shared/constants/book";

export default function LikedBooksPage() {
  const liked = useLikedBooksStore((state) => state.liked);
  const likedBooks = useMemo(() => Object.values(liked), [liked]);

  // 찜한 책은 이미 다 메모리에 있어서 API 호출 없이, 스크롤에 따라 보여주는 개수만 늘림
  const [visibleCount, setVisibleCount] = useState(BOOK_PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasMore = visibleCount < likedBooks.length;

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + BOOK_PAGE_SIZE, likedBooks.length));
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, likedBooks.length]);

  const pageItems = likedBooks.slice(0, visibleCount);

  return (
    <section className="flex flex-col gap-6">
      <Text as="h1" variant="title-2">
        내가 찜한 책
      </Text>

      <BookList
        books={pageItems}
        totalCount={likedBooks.length}
        countLabel="찜한 책"
        emptyMessage="찜한 책이 없습니다."
      />
      {hasMore && <div ref={sentinelRef} aria-hidden className="h-1" />}
    </section>
  );
}

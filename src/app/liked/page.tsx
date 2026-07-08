"use client";

import { useMemo, useState } from "react";
import { useLikedBooksStore } from "@/shared/store/useLikedBooksStore";
import { BookList } from "@/components/book/BookList";
import { Pagination } from "@/components/Pagination";
import { Text } from "@/components/Text";
import { BOOK_PAGE_SIZE } from "@/shared/constants/book";

const PAGE_SIZE = BOOK_PAGE_SIZE;

export default function LikedBooksPage() {
  const liked = useLikedBooksStore((state) => state.liked);
  const likedBooks = useMemo(() => Object.values(liked), [liked]);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(likedBooks.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = likedBooks.slice(start, start + PAGE_SIZE);

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
      {likedBooks.length > 0 && (
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      )}
    </section>
  );
}

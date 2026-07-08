"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/search/SearchBar";
import { BookList } from "@/components/book/BookList";
import { BookListSkeleton } from "@/components/book/BookListSkeleton";
import { ActionButton } from "@/components/ActionButton";
import { Text } from "@/components/Text";
import { useBookSearch } from "@/shared/hooks/useBookSearch";
import { BOOK_PAGE_SIZE } from "@/shared/constants/book";
import { dedupeBooksByIsbn } from "@/shared/utils/book";
import { BOOK_SEARCH_TARGETS, type BookSearchTarget } from "@/shared/types/book";

function parseTarget(value: string | null): BookSearchTarget | undefined {
  return BOOK_SEARCH_TARGETS.includes(value as BookSearchTarget)
    ? (value as BookSearchTarget)
    : undefined;
}

export function SearchPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const keyword = searchParams.get("query") ?? "";
  const target = parseTarget(searchParams.get("target"));

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useBookSearch({ keyword, target, size: BOOK_PAGE_SIZE });

  const [nextPageError, setNextPageError] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(() => {
    fetchNextPage().then((result) => setNextPageError(Boolean(result.isError)));
  }, [fetchNextPage]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNextPageError(false);
  }, [keyword, target]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage && !nextPageError) {
          loadMore();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, nextPageError, loadMore]);

  function handleSearch(nextKeyword: string, nextTarget?: BookSearchTarget) {
    const trimmed = nextKeyword.trim();
    if (!trimmed) {
      router.push("/search");
      return;
    }

    const params = new URLSearchParams();
    params.set("query", trimmed);
    if (nextTarget) params.set("target", nextTarget);
    router.push(`/search?${params.toString()}`);
  }

  const documents = useMemo(
    () => dedupeBooksByIsbn(data?.pages.flatMap((page) => page.documents) ?? []),
    [data],
  );
  const totalCount = target ? documents.length : (data?.pages[0]?.meta.total_count ?? 0);

  return (
    <section className="flex flex-col gap-6">
      <div className="w-full max-w-3xl">
        <Text as="h1" variant="title-2" className="mb-4">
          도서 검색
        </Text>
        <SearchBar onSearch={handleSearch} initialValue={keyword} />
      </div>

      {isError && !data && (
        <Text variant="body-2" color="error">
          검색 중 오류가 발생했습니다.
        </Text>
      )}

      {isLoading ? (
        <BookListSkeleton count={BOOK_PAGE_SIZE} />
      ) : (
        <>
          <BookList
            books={documents}
            totalCount={totalCount}
            countLabel="도서 검색 결과"
            emptyMessage="검색된 결과가 없습니다."
          />

          {isFetchingNextPage && <BookListSkeleton count={3} />}

          {nextPageError && (
            <div className="flex flex-col items-center gap-3 py-6">
              <Text variant="body-2" color="error">
                목록을 더 불러오지 못했습니다.
              </Text>
              <ActionButton title="다시 시도" variant="outline" size="small" onClick={loadMore} />
            </div>
          )}

          {hasNextPage && !nextPageError && <div ref={sentinelRef} aria-hidden className="h-1" />}
        </>
      )}
    </section>
  );
}

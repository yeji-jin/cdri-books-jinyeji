"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/search/SearchBar";
import { BookList } from "@/components/book/BookList";
import { BookListSkeleton } from "@/components/book/BookListSkeleton";
import { Pagination } from "@/components/Pagination";
import { Text } from "@/components/Text";
import { useBookSearch } from "@/shared/hooks/useBookSearch";
import { BOOK_PAGE_SIZE } from "@/shared/constants/book";
import { BOOK_SEARCH_TARGETS, type BookSearchTarget } from "@/shared/types/book";

const PAGE_SIZE = BOOK_PAGE_SIZE;
const KAKAO_MAX_PAGE = 50;

function parseTarget(value: string | null): BookSearchTarget | undefined {
  return BOOK_SEARCH_TARGETS.includes(value as BookSearchTarget)
    ? (value as BookSearchTarget)
    : undefined;
}

function parsePage(value: string | null): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

export function SearchPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const keyword = searchParams.get("query") ?? "";
  const target = parseTarget(searchParams.get("target"));
  const page = parsePage(searchParams.get("page"));

  const { data, isLoading, isError } = useBookSearch({
    keyword,
    target,
    page,
    size: PAGE_SIZE,
  });

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

  function handlePageChange(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    router.replace(`/search?${params.toString()}`);
  }

  const documents = data?.documents ?? [];
  const totalCount = data?.meta.total_count ?? 0;
  const totalPages = Math.min(KAKAO_MAX_PAGE, Math.max(1, Math.ceil(totalCount / PAGE_SIZE)));

  return (
    <section className="flex flex-col gap-6">
      <div className="w-full max-w-3xl">
        <Text as="h1" variant="title-2" className="mb-4">
          도서 검색
        </Text>
        <SearchBar onSearch={handleSearch} initialValue={keyword} />
      </div>

      {isError && (
        <Text variant="body-2" color="error">
          검색 중 오류가 발생했습니다.
        </Text>
      )}

      {isLoading ? (
        <BookListSkeleton count={PAGE_SIZE} />
      ) : (
        <>
          <BookList
            books={documents}
            totalCount={totalCount}
            countLabel="도서 검색 결과"
            emptyMessage="검색된 결과가 없습니다."
          />
          <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
        </>
      )}
    </section>
  );
}

"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/shared/utils/axios";
import { toBook } from "@/shared/utils/book";
import type { BookSearchTarget, KakaoBookSearchResponse } from "@/shared/types/book";

interface UseBookSearchParams {
  keyword: string;
  target?: BookSearchTarget;
  size?: number;
}

interface FetchBooksParams {
  keyword: string;
  target?: BookSearchTarget;
  page: number;
  size: number;
}

const KAKAO_MAX_PAGE = 50;

export const bookKeys = {
  all: ["books"] as const,
  list: (params: { keyword: string; target?: BookSearchTarget; size: number }) =>
    [...bookKeys.all, params.keyword, params.target, params.size] as const,
};

async function fetchBooks({ keyword, target, page, size }: FetchBooksParams) {
  const { data } = await api.get<KakaoBookSearchResponse>("/books", {
    params: { query: keyword, page, size, target },
  });
  return data;
}

export function useBookSearch({ keyword, target, size = 10 }: UseBookSearchParams) {
  const hasKeyword = keyword.trim().length > 0;

  return useInfiniteQuery({
    queryKey: bookKeys.list({ keyword, target, size }),
    queryFn: ({ pageParam }) => fetchBooks({ keyword, target, page: pageParam, size }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.meta.is_end) return undefined;
      const nextPage = allPages.length + 1;
      return nextPage <= KAKAO_MAX_PAGE ? nextPage : undefined;
    },
    enabled: hasKeyword,
    select: (data) => ({
      pages: data.pages.map((page) => ({
        documents: page.documents.map(toBook),
        meta: page.meta,
      })),
    }),
  });
}

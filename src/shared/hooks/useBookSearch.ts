"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "@/shared/utils/axios";
import { toBook, type BookSearchTarget, type KakaoBookSearchResponse } from "@/shared/types/book";

interface UseBookSearchParams {
  keyword: string;
  target?: BookSearchTarget;
  page: number;
  size?: number;
}

export const bookKeys = {
  all: ["books"] as const,
  list: (params: UseBookSearchParams) =>
    [...bookKeys.all, params.keyword, params.target, params.page, params.size] as const,
};

async function fetchBooks({
  keyword,
  target,
  page,
  size = 10,
}: UseBookSearchParams): Promise<KakaoBookSearchResponse> {
  const { data } = await api.get<KakaoBookSearchResponse>("/books", {
    params: { query: keyword, page, size, target },
  });
  return data;
}

export function useBookSearch({ keyword, target, page, size = 10 }: UseBookSearchParams) {
  const hasKeyword = keyword.trim().length > 0;

  return useQuery({
    queryKey: bookKeys.list({ keyword, target, page, size }),
    queryFn: () => fetchBooks({ keyword, target, page, size }),
    enabled: hasKeyword,
    placeholderData: hasKeyword ? keepPreviousData : undefined,
    select: (data) => ({
      documents: data.documents.map(toBook),
      meta: data.meta,
    }),
  });
}

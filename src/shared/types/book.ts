export interface KakaoBookDocument {
  title: string;
  contents: string;
  url: string;
  isbn: string;
  datetime: string;
  authors: string[];
  publisher: string;
  translators: string[];
  price: number;
  sale_price: number;
  thumbnail: string;
  status: string;
}

export interface KakaoBookSearchMeta {
  total_count: number;
  pageable_count: number;
  is_end: boolean;
}

export interface KakaoBookSearchResponse {
  meta: KakaoBookSearchMeta;
  documents: KakaoBookDocument[];
}

export type BookSearchTarget = "title" | "publisher" | "person";

export const BOOK_SEARCH_TARGETS: BookSearchTarget[] = ["title", "publisher", "person"];

export interface Book {
  isbn: string;
  title: string;
  authors: string[];
  publisher: string;
  contents: string;
  url: string;
  thumbnailUrl: string;
  price: number;
  salePrice: number;
}

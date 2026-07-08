import { Suspense } from "react";
import { SearchPageClient } from "./SearchPageClient";
import { BookListSkeleton } from "@/components/book/BookListSkeleton";

export default function SearchPage() {
  return (
    <Suspense fallback={<BookListSkeleton count={10} />}>
      <SearchPageClient />
    </Suspense>
  );
}

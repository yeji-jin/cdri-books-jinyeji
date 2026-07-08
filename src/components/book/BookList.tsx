import { BookListItem } from "./BookListItem";
import { EmptyState } from "@/components/EmptyState";
import { Text } from "@/components/Text";
import type { Book } from "@/shared/types/book";

interface BookListProps {
  books: Book[];
  totalCount: number;
  countLabel: string;
  emptyMessage: string;
}

export function BookList({ books, totalCount, countLabel, emptyMessage }: BookListProps) {
  return (
    <div>
      <Text variant="body-2" color="secondary" className="mb-6 w-full max-w-3xl">
        {countLabel} 총{" "}
        <Text as="span" variant="body-2" bold color="accent">
          {totalCount}
        </Text>
        건
      </Text>

      {books.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <ul>
          {books.map((book) => (
            <BookListItem key={book.isbn} book={book} />
          ))}
        </ul>
      )}
    </div>
  );
}

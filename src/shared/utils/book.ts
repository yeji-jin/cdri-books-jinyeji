import type { Book, KakaoBookDocument } from "@/shared/types/book";

export function toBook(doc: KakaoBookDocument): Book {
  return {
    isbn: doc.isbn,
    title: doc.title,
    authors: doc.authors,
    publisher: doc.publisher,
    contents: doc.contents,
    url: doc.url,
    thumbnailUrl: doc.thumbnail,
    price: doc.price,
    salePrice: doc.sale_price,
  };
}

export function dedupeBooksByIsbn(books: Book[]): Book[] {
  const seen = new Set<string>();
  return books.filter((book) => {
    if (seen.has(book.isbn)) return false;
    seen.add(book.isbn);
    return true;
  });
}

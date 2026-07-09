function BookListItemSkeleton() {
  return (
    <li aria-hidden="true" className="border-gray flex items-center gap-4 border-b py-4">
      <div className="bg-light-gray h-16 w-12 shrink-0 animate-pulse rounded" />

      <div className="flex-1 space-y-2">
        <div className="bg-light-gray h-4 w-2/5 animate-pulse rounded" />
        <div className="bg-light-gray h-3 w-1/5 animate-pulse rounded" />
      </div>

      <div className="bg-light-gray h-4 w-16 shrink-0 animate-pulse rounded" />
      <div className="bg-light-gray h-9 w-20 shrink-0 animate-pulse rounded" />
      <div className="bg-light-gray h-9 w-24 shrink-0 animate-pulse rounded" />
    </li>
  );
}

export function BookListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div role="status" aria-label="검색 결과를 불러오는 중">
      <ul>
        {Array.from({ length: count }, (_, index) => (
          <BookListItemSkeleton key={index} />
        ))}
      </ul>
    </div>
  );
}

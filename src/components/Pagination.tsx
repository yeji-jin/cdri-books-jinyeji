import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import { Text } from "@/components/Text";
import { cn } from "@/shared/utils/cn";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const SIBLING_COUNT = 1;
const ELLIPSIS = "ellipsis" as const;

function getPageNumbers(current: number, total: number): (number | typeof ELLIPSIS)[] {
  const totalNumbers = SIBLING_COUNT * 2 + 5;
  if (total <= totalNumbers) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(current - SIBLING_COUNT, 1);
  const rightSibling = Math.min(current + SIBLING_COUNT, total);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < total - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftRange = Array.from({ length: 3 + SIBLING_COUNT * 2 }, (_, i) => i + 1);
    return [...leftRange, ELLIPSIS, total];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightCount = 3 + SIBLING_COUNT * 2;
    const rightRange = Array.from({ length: rightCount }, (_, i) => total - rightCount + i + 1);
    return [1, ELLIPSIS, ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSibling - leftSibling + 1 },
    (_, i) => leftSibling + i,
  );
  return [1, ELLIPSIS, ...middleRange, ELLIPSIS, total];
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);

  return (
    <div className="mt-6 flex items-center justify-center gap-1">
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="text-secondary flex h-8 w-8 items-center justify-center disabled:opacity-30"
      >
        <RiArrowLeftSLine className="h-5 w-5" />
      </button>

      {pages.map((p, index) =>
        p === ELLIPSIS ? (
          <Text
            key={`ellipsis-${index}`}
            as="span"
            variant="body-2"
            color="subtitle"
            className="flex h-8 w-8 items-center justify-center"
          >
            ...
          </Text>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full",
              p === page && "bg-light-gray",
            )}
          >
            <Text
              as="span"
              variant="body-2"
              color={p === page ? "primary" : "secondary"}
              bold={p === page}
            >
              {p}
            </Text>
          </button>
        ),
      )}

      <button
        type="button"
        aria-label="다음 페이지"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="text-secondary flex h-8 w-8 items-center justify-center disabled:opacity-30"
      >
        <RiArrowRightSLine className="h-5 w-5" />
      </button>
    </div>
  );
}

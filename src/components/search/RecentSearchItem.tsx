import { RiCloseLine } from "@remixicon/react";
import { Text } from "@/components/Text";

interface RecentSearchItemProps {
  term: string;
  onSelect: (term: string) => void;
  onRemove: (term: string) => void;
}

export function RecentSearchItem({ term, onSelect, onRemove }: RecentSearchItemProps) {
  return (
    <li className="flex items-center justify-between py-3">
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onSelect(term)}
      >
        <Text as="span" variant="caption" color="secondary">
          {term}
        </Text>
      </button>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => onRemove(term)}
        aria-label={`${term} 검색기록 삭제`}
        className="text-primary"
      >
        <RiCloseLine aria-hidden="true" className="h-5 w-5" />
      </button>
    </li>
  );
}

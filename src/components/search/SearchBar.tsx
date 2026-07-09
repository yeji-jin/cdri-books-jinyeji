"use client";

import { useEffect, useRef, useState } from "react";
import { RiSearchLine } from "@remixicon/react";
import { useRecentSearches } from "@/shared/hooks/useRecentSearches";
import { ActionButton } from "@/components/ActionButton";
import { DetailSearchPopover } from "./DetailSearchPopover";
import { RecentSearchItem } from "./RecentSearchItem";
import type { BookSearchTarget } from "@/shared/types/book";

interface SearchBarProps {
  onSearch: (keyword: string, target?: BookSearchTarget) => void;
  initialValue?: string;
}

export function SearchBar({
  onSearch,
  initialValue = "",
}: SearchBarProps) {
  const [value, setValue] = useState(initialValue);
  const [detailOpen, setDetailOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { terms, addTerm, removeTerm } = useRecentSearches();
  const detailContainerRef = useRef<HTMLDivElement>(null);

  // 뒤로/앞으로 가기로 URL의 query가 바뀌었을 때 입력창도 따라가도록 동기화
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (!detailOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (!detailContainerRef.current?.contains(e.target as Node)) {
        setDetailOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [detailOpen]);

  // 일반 검색(메인 인풋 Enter, 검색기록 클릭)과 상세검색 제출이 이 함수를 공유한다.
  // 상세검색은 target(저자명/출판사 등)으로 검색하는 것이라, 그 키워드를 메인
  // 검색창에 채워넣으면 사용자가 입력하지 않은 값이 갑자기 나타나는 것처럼 보인다.
  // syncInput=false로 넘기면 메인 인풋 값은 건드리지 않는다.
  //
  // 검색어를 지우고 Enter쳤을 때(trimmed === "")도 onSearch는 호출해야 결과가
  // 리셋된다. 여기서 그냥 return해버리면 검색 상태가 그대로 남는다 — 다만 빈
  // 검색어를 검색기록에 저장하진 않는다.
  function runSearch(keyword: string, target?: BookSearchTarget, syncInput = true) {
    const trimmed = keyword.trim();
    if (trimmed) addTerm(trimmed);
    if (syncInput) setValue(trimmed);
    onSearch(trimmed, target);
    setIsFocused(false);
  }

  const showRecentSearches = isFocused && terms.length > 0;

  return (
    <div className="flex gap-4 items-center">
      <div className={`bg-light-gray relative flex-1 ${showRecentSearches ? "rounded-t-4xl" : "rounded-4xl"} px-5 py-3`}>
        <div className="flex items-center gap-3">
          <RiSearchLine aria-hidden="true" className="text-primary h-5 w-5 shrink-0" />
          <input
            type="search"
            aria-label="검색어 입력"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                runSearch(e.currentTarget.value);
              }
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="검색어 입력"
            className="text-body-1 text-primary placeholder:text-subtitle flex-1 bg-transparent placeholder:text-base placeholder:font-medium outline-none"
          />
        </div>

        {showRecentSearches && (
          <ul
            className="bg-light-gray absolute inset-x-0 top-full z-20 rounded-b-2xl p-2 shadow-lg"
            onMouseDown={(e) => e.preventDefault()}
          >
            {terms.map((term) => (
              <RecentSearchItem key={term} term={term} onSelect={runSearch} onRemove={removeTerm} />
            ))}
          </ul>
        )}
      </div>

      <div ref={detailContainerRef} className="relative shrink-0">
        <ActionButton
          title="상세검색"
          variant="outline"
          size="small"
          aria-haspopup="dialog"
          aria-expanded={detailOpen}
          aria-controls="detail-search-popover"
          onClick={() => setDetailOpen((prev) => !prev)}
        />

        {detailOpen && (
          <DetailSearchPopover
            onClose={() => setDetailOpen(false)}
            onSubmit={({ keyword, target }) => {
              setDetailOpen(false);
              // 상세검색이 실제로 제출된 시점에만 메인 인풋을 비운다 — 상세검색 결과와
              // 메인 검색창에 남아있던 이전 검색어가 서로 다른 채로 같이 보이는 것을 막는다.
              setValue("");
              runSearch(keyword, target, false);
            }}
          />
        )}
      </div>
    </div>
  );
}

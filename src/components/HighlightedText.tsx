// 정규식 특수문자가 검색어에 그대로 들어와도 깨지지 않도록 이스케이프한다.
function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

interface HighlightedTextProps {
  text: string;
  query?: string;
}

export function HighlightedText({ text, query }: HighlightedTextProps) {
  const trimmed = query?.trim();
  if (!trimmed) return <>{text}</>;

  const regex = new RegExp(`(${escapeRegExp(trimmed)})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === trimmed.toLowerCase() ? (
          <mark key={index} className="text-accent bg-transparent font-bold">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

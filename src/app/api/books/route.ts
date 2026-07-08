import { NextRequest, NextResponse } from "next/server";
import {
  BOOK_SEARCH_TARGETS,
  type BookSearchTarget,
  type KakaoBookDocument,
  type KakaoBookSearchResponse,
} from "@/shared/types/book";

const KAKAO_BOOK_SEARCH_URL = "https://dapi.kakao.com/v3/search/book";

// 띄어쓰기 차이(예: "클린코드" vs "클린 코드")까지 다른 문자열로 취급하면 정상 매치도
// 걸러지므로, 공백을 다 지우고 비교
function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "");
}

/**
 * 카카오 도서 검색 API의 target 파라미터는 "이 필드만 검색"이 아니라 느슨한 유사도
 * 검색이라, target=person으로 "김기수"를 검색해도 저자가 전혀 다른 책이 섞여 나옴
 * target이 지정된 경우에 한해 해당 필드에 검색어가 실제로 포함된 문서만 다시 거름
 */
function matchesTarget(doc: KakaoBookDocument, target: BookSearchTarget, query: string): boolean {
  const needle = normalize(query);
  switch (target) {
    case "person":
      return doc.authors.some((author) => normalize(author).includes(needle));
    case "publisher":
      return normalize(doc.publisher).includes(needle);
    case "title":
      return normalize(doc.title).includes(needle);
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim();
  const page = searchParams.get("page") ?? "1";
  const size = searchParams.get("size") ?? "10";
  const target = searchParams.get("target");

  if (!query) {
    return NextResponse.json({ error: "query is required" }, { status: 400 });
  }

  const apiKey = process.env.KAKAO_REST_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "KAKAO_REST_API_KEY is not configured on the server" },
      { status: 500 },
    );
  }

  const kakaoUrl = new URL(KAKAO_BOOK_SEARCH_URL);
  kakaoUrl.searchParams.set("query", query);
  kakaoUrl.searchParams.set("page", page);
  kakaoUrl.searchParams.set("size", size);
  kakaoUrl.searchParams.set("sort", "accuracy");
  if (target && BOOK_SEARCH_TARGETS.includes(target as BookSearchTarget)) {
    kakaoUrl.searchParams.set("target", target);
  }

  const kakaoRes = await fetch(kakaoUrl, {
    headers: { Authorization: `KakaoAK ${apiKey}` },
    cache: "no-store",
  });

  if (!kakaoRes.ok) {
    const detail = await kakaoRes.text();
    return NextResponse.json(
      { error: "Kakao book search request failed", detail },
      { status: kakaoRes.status },
    );
  }

  const data: KakaoBookSearchResponse = await kakaoRes.json();

  const validTarget =
    target && BOOK_SEARCH_TARGETS.includes(target as BookSearchTarget)
      ? (target as BookSearchTarget)
      : null;

  if (validTarget) {
    const filteredDocuments = data.documents.filter((doc) =>
      matchesTarget(doc, validTarget, query),
    );

    return NextResponse.json({
      ...data,
      documents: filteredDocuments,
      meta: {
        ...data.meta,
        total_count: filteredDocuments.length,
        pageable_count: filteredDocuments.length,
      },
    });
  }

  return NextResponse.json(data);
}

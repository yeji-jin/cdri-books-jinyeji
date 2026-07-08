# CERTICOS BOOKS

카카오 다음(Daum) 도서 검색 API를 활용한 도서 검색 / 찜하기 서비스


## 프로젝트 개요

- 도서 검색(기본 검색 + 상세검색), 검색 결과 리스트/상세보기, 찜하기(내가 찜한 책)를 구현한 프론트엔드 과제입니다.
- 카카오 REST API 키는 브라우저에 노출하지 않고 Next.js API Route를 통해 서버에서만 사용합니다.


## 실행 방법 및 환경 설정

```bash
npm install
echo "KAKAO_REST_API_KEY=발급받은키" > .env.local
npm run dev
```

- http://localhost:3000 접속
- 카카오 REST API 키는 [카카오 디벨로퍼스](https://developers.kakao.com/docs/ko/app-setting/app#rest-api-key)에서 발급 (다음 도서 검색 API는 REST API 키만 있으면 바로 사용 가능)

## 폴더 구조 및 주요 코드 설명

```
src/
├─ app/
│  ├─ layout.tsx              # 전역 레이아웃 (Providers, GlobalHeader)
│  ├─ search/                 # 도서 검색 페이지 (query/target/page를 URL과 동기화)
│  ├─ liked/page.tsx          # 내가 찜한 책 페이지
│  └─ api/books/route.ts      # 카카오 도서검색 API 서버사이드 프록시
├─ components/                 # 화면 전용 UI 컴포넌트 (도메인 로직 없음)
│  ├─ ActionButton.tsx / Text.tsx / Select.tsx / Pagination.tsx  # 디자인 시스템 컴포넌트
│  ├─ search/                 # SearchBar, DetailSearchPopover(react-hook-form+zod)
│  └─ book/                   # BookList, BookListItem, LikeButton
└─ shared/                     # 여러 화면이 공유하는 로직
   ├─ hooks/useBookSearch.ts    # useQuery + keepPreviousData 페이지네이션 조회
   ├─ store/useLikedBooksStore.ts  # 찜하기 상태 (zustand + persist)
   ├─ types/book.ts             # 카카오 응답 타입 ↔ 도메인 타입(Book) 매핑
   └─ utils/                    # axios 인스턴스, 에러 메시지 변환, storage 래퍼 등
```

## 라이브러리 선택 이유

| 라이브러리                     | 선택 이유                                                                                                                                                                                                                                                            |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Next.js (App Router)**  | Next.js API Route를 사용해 카카오 API를 서버에서 호출하도록 구성했습니다. 브라우저는 내부 /api/books만 호출하고, REST API 키는 서버 환경변수에서만 사용하도록 하여 클라이언트에 노출되지 않도록 했습니다. 또한 검색어·상세검색 조건·페이지를 URL Search Params로 관리해 새로고침, 뒤로가기, 공유 시에도 동일한 검색 상태를 유지할 수 있었습니다.                                       |
| **TypeScript**            | 컴포넌트 props, API 응답, 검색 조건, 전역 상태를 모두 타입으로 관리해 컴파일 단계에서 오류를 확인할 수 있도록 했습니다. API 응답은 프로젝트에서 사용하는 도메인 타입으로 변환해 화면에서는 일관된 타입만 사용하도록 구성했고, 공통 타입을 여러 컴포넌트와 훅에서 재사용해 유지보수가 쉬운 구조를 만들었습니다.                               |
| **React Query**           | 서버에서 가져오는 데이터를 효율적으로 관리하기 위해 사용했습니다. 요청 결과를 캐싱해 동일한 요청에 대한 불필요한 API 호출을 줄이고, 로딩·에러 상태를 일관되게 관리할 수 있습니다. 이 프로젝트에서는 페이지 이동 시 이전 데이터를 유지해 화면이 깜빡이지 않도록 했고, QueryCache.onError를 활용해 모든 요청의 실패를 공통으로 처리했습니다. |
| **Tailwind CSS**          | 디자인 목업의 컬러와 타이포그래피를 `@theme` 토큰으로 정의했습니다. `Text`, `ActionButton` 같은 공통 컴포넌트는 이 토큰만 조합해 사용하도록 구성해 화면마다 스타일이 달라지지 않도록 했고, 디자인 변경 시 토큰만 수정하면 전체 화면에 반영되도록 했습니다.                                                                      |
| **react-hook-form + zod** | 입력 상태 관리와 검증을 분리하기 위해 적용했습니다. react-hook-form은 비제어 방식이라 입력 중 불필요한 리렌더를 줄이고, zod는 검색어 검증을 담당하며 타입도 함께 관리해 별도의 validation 로직을 작성하지 않도록 했습니다.                                                                                             |
| **@hookform/resolvers**   | react-hook-form과 zod를 연결하기 위해 사용했습니다. zod 스키마를 그대로 검증 규칙으로 사용할 수 있어 폼 검증 로직을 중복 작성하지 않고 타입과 검증 기준을 하나로 관리했습니다.                                                                                                                                                   |
| **axios**                 | HTTP 요청을 일관되게 관리하기 위해 사용했습니다. 공통 인스턴스를 통해 기본 설정을 재사용하고, 요청 및 에러 처리를 간결하게 구성했습니다.                                                                           |
| **zustand**               | 찜하기는 서버와 동기화되지 않는 클라이언트 전용 상태라 별도의 전역 상태로 관리하는 것이 자연스러웠습니다. `persist` 미들웨어를 활용해 localStorage 저장을 직접 구현하지 않았고, selector 기반 구독을 사용해 특정 책의 찜 여부가 변경될 때 해당 `LikeButton`만 리렌더되도록 구성했습니다.                                                                              |
| **clsx + tailwind-merge** | 디자인 시스템 컴포넌트는 variant와 호출부의 `className`을 함께 조합하는 구조입니다. `clsx`로 조건부 클래스를 관리하고, `tailwind-merge`로 충돌하는 Tailwind 클래스를 정리해 호출부에서 전달한 스타일이 의도대로 우선 적용되도록 했습니다.                                                                                                       |
| **sonner**                | 검색 실패나 API 오류를 사용자에게 즉시 안내하기 위해 사용했습니다. React Query의 `QueryCache.onError`와 연결해 모든 요청 실패를 공통 토스트로 처리하여 컴포넌트마다 동일한 에러 UI를 반복 구현하지 않도록 했습니다.                                                                                                                        |
| **@remixicon/react**      | 검색, 찜하기 등 반복적으로 사용하는 아이콘을 React 컴포넌트 형태로 사용하기 위해 선택했습니다. SVG를 직접 관리하지 않아도 되고, 크기와 색상을 props와 Tailwind 클래스로 쉽게 제어할 수 있어 재사용성이 높았습니다.                                                                                                                              |


## 강조하고 싶은 기능

- **디자인 시스템 적용**: `Text`, `ActionButton`, `Select` 등 공통 컴포넌트를 variant 기반으로 설계해 일관된 UI를 유지하고 재사용성을 높였습니다.
- **재사용 가능한 컴포넌트 설계**: `Text`, `ActionButton`, `Select`, `Pagination`을 공통 컴포넌트로 구현했습니다. `BookList`와 `LikeButton`도 검색 페이지와 찜한 책 페이지에서 동일하게 재사용해 UI 중복을 최소화했습니다.

- **API 키 보안**: 카카오 REST API 키는 서버 환경변수에서만 관리하고, 프론트엔드는 내부 `/api/books`만 호출하도록 구성했습니다.

- **상세검색 재필터링**: 카카오 API의 느슨한 검색 결과를 보완하기 위해 서버에서 검색 대상 필드에 검색어가 실제로 포함된 도서만 한 번 더 필터링했습니다. ([자세히](#상세검색-재필터링-상세))

- **찜하기 리렌더 최적화**: Zustand selector를 사용해 변경된 책의 `LikeButton`만 리렌더되도록 구현했습니다.

- **검색 상태의 URL 동기화**: 검색어, 상세검색 조건, 페이지를 URL Search Params로 관리해 새로고침·뒤로가기·공유 시에도 동일한 검색 상태를 유지합니다.

- **번호 페이지네이션**: 현재 페이지에 따라 말줄임표(`...`)를 포함한 페이지 번호를 자동 계산해 표시합니다.

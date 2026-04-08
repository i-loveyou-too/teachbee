# TeachBee Data Flow Rules (현재 코드 기준)

기준 파일: `frontend/lib/api.ts`, `frontend/lib/types.ts`, `frontend/app/home/page.tsx`, `frontend/app/students/page.tsx`, `frontend/app/calendar/page.tsx`, `frontend/app/todo/page.tsx`, `frontend/app/billing/page.tsx`, `backend/apps/*`.

## 1) 현재 프론트 데이터 소스 요약

- 모든 API 호출 진입점은 `frontend/lib/api.ts`.
- 페이지는 주로 이 함수들을 호출:
  - 홈: `getHomeDashboard`, `getLessons`, `getTodos`, `updateTodo`, `updateLesson`
  - 학생: `getStudents`, `getLessons`, `getCancelMakeups`
  - 캘린더: `getLessons`, `getStudents`, `getTodos`, `updateLesson`
  - 정산: `getPayments`, `updatePayment`
  - 할 일: `getTodos`, `createTodo`, `updateTodo`, `deleteTodo`, `getHomeDashboard`

## 2) env / base URL 사용 방식

- `API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'`
- API prefix는 고정 `'/api'`
- 최종 호출: `${API_BASE}${API_PREFIX}${path}`
- `.env.example` 기준 프론트 기본값: `NEXT_PUBLIC_API_URL=http://localhost:8000`

## 3) 공통 호출 방식

- `request()`는 `fetch` 사용, `Content-Type: application/json` 고정.
- `res.ok`가 false면 즉시 throw (`API Error: {status}`).
- 리스트 응답은 `normalizeList()`로
  - 배열
  - 또는 `{ results: [] }`
  두 형태만 허용.

## 4) mock / fallback 사용 점검 (현재 코드 기준)

- `USE_MOCK = false`로 하드코딩되어 기본은 실API.
- 단, mock store/분기 코드가 여전히 남아 있어 추후 실수로 재활성화될 수 있음.
- 일부 페이지는 fetch 실패 시 빈 배열/낙관적 UI로 대체:
  - 예: `home`, `billing`, `calendar`, `todo`
- 이는 "장애를 숨기는 동작"이 될 수 있으므로 운영 기준에서 제한한다.

## 5) 금지 규칙

- DB 연동 페이지에서 mock fallback 금지 (`USE_MOCK` 변경 금지).
- fetch 실패를 조용히 삼키지 말 것 (`catch`에서 최소 console.error + 사용자 상태 반영).
- 응답 구조를 추측해서 파싱하지 말 것.
- 프론트 타입 불일치를 `as any`로 봉합하지 말 것.

## 6) 권장 규칙

- `loading`, `empty`, `error` 상태를 분리해 화면에 명시한다.
- API 실패 시
  - 개발 중: `console.error`로 endpoint + status + payload 확인
  - 사용자 화면: 재시도 안내 또는 명확한 오류 메시지 제공
- key mapping이 필요한 경우(`default_class_fee -> fee` 등) 페이지별 임시 매핑이 아니라 `lib/api.ts` adapter 층에서 일관 처리한다.

## 7) 핵심 화면 데이터 흐름 (실제 코드 기반)

- 학생 탭
  - `Promise.all(getStudents, getLessons, getCancelMakeups)` 로딩
  - 학생 필드 임시 정규화(`fee`, `payment_status`, `regular_*`) 수행
- 캘린더 탭
  - `getLessons + getStudents` 로 월/일 뷰 구성
  - lesson date key로 grouping (`lesson.lesson_date` 사용 코드 존재)
- 홈 탭
  - `getHomeDashboard + getLessons`
  - dashboard와 lessons를 결합해 카드/통계 표시
- 할 일 탭
  - `getTodos + getHomeDashboard`
  - 날짜별 그룹핑 + 드래그 이동 시 `updateTodo`

## 8) 실전 확인 원칙

- 화면에 데이터가 안 뜨면 순서대로 확인:
  1. Network 탭 URL
  2. HTTP status
  3. 응답 JSON key
  4. 프론트 타입/매핑 코드

## 이 문서를 갱신해야 하는 경우

- `frontend/lib/api.ts` 요청/파싱 로직 변경 시
- `frontend/lib/types.ts` 타입 변경 시
- 페이지별 데이터 로딩 패턴(`Promise.all`, fallback 처리) 변경 시
- mock 분기 정책(`USE_MOCK`) 변경 시

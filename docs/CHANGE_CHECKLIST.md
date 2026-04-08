# TeachBee Change Checklist (실전 점검 순서)

목적: 경로 오류, 응답 shape 오류, mock 혼입, import 죽음, 연동 누락을 사전에 차단한다.

## 1) 수정 전 체크

- 관련 화면 확인: `home`, `students`, `calendar`, `billing`, `todo` 중 어디가 영향 받는지 지정
- 관련 API 확인: `frontend/lib/api.ts`에서 실제 호출 endpoint 확인
- 관련 백엔드 파일 확인:
  - `urls.py` (project/app)
  - `views.py`
  - `serializers.py`
  - `models.py`
- mock 사용 여부 확인: `USE_MOCK` 값과 mock 분기 코드 영향 범위 확인
- env/base url 확인: `NEXT_PUBLIC_API_URL`, `/api` prefix 조합 확인

## 2) 수정 중 체크

- 한 번에 한 영역만 수정 (예: 라우팅만 / serializer만 / UI만).
- UI와 API를 동시에 대규모로 갈아엎지 말 것.
- 없는 함수명/경로명 추측 금지.
- `urls.py` 등록 전에 view 존재 여부를 먼저 확인.
- 타입 불일치를 `as any`로 넘기지 말고 key mismatch 원인을 먼저 제거.

## 3) 수정 후 체크 (필수)

- 백엔드 `runserver` 정상 실행 (import/attribute 오류 없음)
- 프론트 빌드/실행 시 import 에러 없음
- 브라우저 Console 에러 확인
- Network status 확인 (200/4xx/5xx)
- API 직접 호출 테스트 (핵심 endpoint)
- 실제 페이지 클릭 테스트 (탭 이동 + 상세/수정/생성 동작)

## 4) 핵심 화면별 예시 체크

- 학생 탭 (`/students`)
  - 목록 로딩 성공 여부
  - 학생 저장/수정/삭제 후 목록 반영 여부
  - 학생 필드 매핑(`fee` vs `default_class_fee`) 깨짐 여부
- 캘린더 탭 (`/calendar`)
  - 날짜별 lesson 표시 여부
  - lesson 상세 수정 patch 반영 여부
- 홈 탭 (`/home`)
  - summary/todos/alerts 카드 표시 여부
  - dashboard 집계 key mismatch 여부

## 5) 장애 대응 규칙

- **404면 URL 등록부터 본다.**
  - `config/urls.py` include 여부
  - app `urls.py` route 등록 여부
  - trailing slash 여부
- **AttributeError면 import/참조부터 본다.**
  - `views`에 함수가 실제 존재하는지
  - `urls.py`가 존재하지 않는 symbol을 참조하는지
- **데이터 비정상이면 serializer/type key부터 본다.**
  - 백엔드 응답 key와 프론트 타입 key 일치 여부
- **화면만 비면 네트워크 성공 여부를 먼저 본다.**
  - 성공이면 렌더링 조건/필터 문제
  - 실패면 endpoint/권한/CORS 문제

## 6) AI 협업 시 금지 항목

- 존재하지 않는 endpoint를 "있다고 가정"하고 코드/문서 작성 금지
- 임시 mock으로 장애를 숨기는 봉합 금지
- 확인하지 않은 함수/파일명을 추측해서 import 금지
- 라우팅/응답 계약 변경 시 문서 미갱신 금지

## 이 문서를 갱신해야 하는 경우

- 신규 탭/신규 API 추가 시
- API 라우팅 정책 변경 시
- serializer key/프론트 타입 key 변경 시
- 팀의 디버깅 표준(로그/에러표시) 변경 시

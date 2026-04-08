# TeachBee Routing Rules (현재 코드 기준)

기준 파일: `backend/config/urls.py`, `backend/apps/*/urls.py`, `backend/apps/common/views.py`, `frontend/app/**/page.tsx`, `frontend/lib/api.ts`.

## 1) Django URL 구조 요약

- 프로젝트 루트는 `backend/config/urls.py`.
- `/api/` prefix 아래에 app router를 include:
  - `students`, `lessons`, `billing`, `todos`
- 홈 대시보드 API는 `config/urls.py`에 직접 path 등록:
  - `/api/home/summary`
  - `/api/home/today-classes`
  - `/api/home/today-tasks`
  - `/api/home/alerts`

## 2) project-level / app-level 연결 방식

- `config/urls.py`는 app별 `urls.py`를 include해서 최종 경로를 만든다.
- app-level은 DRF `DefaultRouter`를 사용하여 `/{resource}/`와 `/{resource}/{id}/`를 자동 생성한다.
- `apps/common/urls.py`는 현재 존재하지만 `config/urls.py`에서 include하지 않으므로, 해당 path(`teacher/students`, `teacher/classes`)는 실제 노출되지 않는다.

## 3) `/api/...` prefix 규칙

- 백엔드 API는 모두 `/api/` 하위에 둔다.
- Next 페이지 라우트(`/home`, `/students`, `/calendar` 등)와 API 경로를 절대 섞지 않는다.
- 프론트 호출은 `NEXT_PUBLIC_API_URL + /api + endpoint` 조합(`frontend/lib/api.ts`)을 유지한다.

## 4) teacher/home/student 경로 규칙

- **home 관련**: `/api/home/*`는 `config/urls.py` 직접 매핑.
- **student 관련(정식 CRUD)**: `/api/students/` 계열 사용.
- **teacher 관련 alias (`/api/teacher/*`)**:
  - 현재 프론트에서 사용 중이지만, 백엔드 include 누락 상태.
  - 신규 작업 시 `/teacher/*`를 계속 쓸지, `/students|lessons/`로 정리할지 먼저 결정 후 일괄 수정한다.

## 5) trailing slash 정책

- DRF router 경로는 trailing slash 포함 (`/api/students/`).
- `home/*` path는 slash 없음 (`/api/home/summary`).
- 새 endpoint 추가 시 기존 그룹과 같은 slash 패턴을 따른다.

## 6) 필수 원칙 (404/참조오류 방지)

- `urls.py` 수정 전 `views` 함수/클래스 존재를 먼저 확인한다.
- 없는 view를 `path()`에 연결하지 않는다.
- 비슷한 이름 endpoint를 중복 생성하지 않는다.  
  예: `/api/lessons/`와 `/api/teacher/classes/`를 동시에 유지하면 프론트/문서/테스트가 분기되어 붕괴하기 쉽다.
- router 기반과 함수 기반 endpoint를 혼용할 때는 담당 범위를 명시한다(예: home 요약은 함수 기반, CRUD는 router 기반).

## 7) 새 endpoint 추가 시 확인 순서

1. `models.py`에 필요한 필드 존재 확인
2. `serializers.py`에 노출 필드 확정
3. `views.py` 구현
4. `app urls.py` 또는 `config/urls.py` 등록
5. `frontend/lib/api.ts` endpoint/params 반영
6. 실제 브라우저 네트워크와 직접 URL 호출로 200/404 확인

## 8) 현재 프로젝트에서 404/라우팅 오류 가능 포인트

- `/api/teacher/students/`, `/api/teacher/classes/`: include 누락으로 404 가능
- `/api/home/today-classes`: view 함수 미존재로 서버 기동/호출 오류 가능
- `/api/summary/` (`apps/common/urls.py`): 현재 미include 상태
- trailing slash 잘못 호출 시(특히 router endpoint) 301/404 혼선 가능

## 이 문서를 갱신해야 하는 경우

- `backend/config/urls.py` 변경 시
- any `backend/apps/*/urls.py` 변경 시
- `frontend/lib/api.ts` endpoint 상수 변경 시
- `/api/teacher/*` 정책 결정(유지/폐기/리다이렉트) 시

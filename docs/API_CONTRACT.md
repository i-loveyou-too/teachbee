# TeachBee API Contract (현재 코드 기준)

이 문서는 `backend/config/urls.py`, `backend/apps/*/urls.py`, `backend/apps/*/views.py`, `backend/apps/*/serializers.py`, `frontend/lib/api.ts`, `frontend/lib/types.ts`를 기준으로 작성한다.

## 1) 실제 등록된 API (백엔드 URL 기준)

### A. `config/urls.py`에 직접 등록된 홈 API

| Method | Path | 현재 상태 | 설명 | 응답 형태(코드 기준) |
|---|---|---|---|---|
| GET | `/api/home/today-classes` | **주의: view 미존재** | 오늘 수업 목록 | 현재 `common_views.today_classes` 함수가 `common/views.py`에 없음 (서버 import 단계 오류 가능) |
| GET | `/api/home/summary` | 구현됨 | 홈 상단 요약 | object: `today_class_count`, `unpaid_count`, `makeup_count`, `today_task_count` |
| GET | `/api/home/today-tasks` | 구현됨 | 오늘 할 일 목록 | array of object: `id`, `title`, `is_completed`, `priority`, `student_name` |
| GET | `/api/home/alerts` | 구현됨 | 미납/보강 알림 | array of object. payment 항목: `alert_type`, `student_name`, `amount`, `status`; makeup 항목: `alert_type`, `student_name`, `status`, `memo` |

### B. DRF Router 기반 API (`/api/` + app urls include)

| Method | Path | 설명 | 응답 형태(코드 기준) |
|---|---|---|---|
| GET/POST | `/api/students/` | 학생 목록/생성 | pagination object (`count`, `next`, `previous`, `results[]`) |
| GET/PATCH/DELETE | `/api/students/{id}/` | 학생 상세/수정/삭제 | student object (`StudentSerializer`, `fields='__all__'`) |
| GET/POST | `/api/lessons/` | 수업 목록/생성 | pagination object (`results[]`, 각 item에 `student_name` 포함) |
| GET/PATCH/DELETE | `/api/lessons/{id}/` | 수업 상세/수정/삭제 | lesson object |
| GET/POST | `/api/cancel-makeups/` | 결강/보강 목록/생성 | pagination object (`results[]`, 각 item에 `student_name`) |
| GET/PATCH/DELETE | `/api/cancel-makeups/{id}/` | 결강/보강 상세/수정/삭제 | cancel_makeup object |
| GET/POST | `/api/payments/` | 정산 목록/생성 | pagination object (`results[]`, 각 item에 `student_name`) |
| GET/PATCH/DELETE | `/api/payments/{id}/` | 정산 상세/수정/삭제 | payment object |
| GET/POST | `/api/todos/` | 할 일 목록/생성 | pagination object (`results[]`, 각 item에 `student_name`) |
| GET/PATCH/DELETE | `/api/todos/{id}/` | 할 일 상세/수정/삭제 | todo object |

## 2) 프론트에서 실제 호출 중인 엔드포인트 (연동 상태)

| 프론트 호출 경로 (`frontend/lib/api.ts`) | 현재 백엔드 매핑 | 상태 |
|---|---|---|
| `/api/teacher/students/` | `apps/common/urls.py`에 정의되어 있으나 `config/urls.py`에 include 없음 | **미연동(404 가능)** |
| `/api/teacher/classes/` | 동일 | **미연동(404 가능)** |
| `/api/home/summary` | 매핑 존재 | 연동됨 |
| `/api/home/today-classes` | URL은 있으나 view 함수 없음 | **실행 불가 위험** |
| `/api/home/today-tasks` | 매핑 존재 | 연동됨 |
| `/api/home/alerts` | 매핑 존재 | 연동됨 |
| `/api/todos/`, `/api/payments/`, `/api/cancel-makeups/` | 매핑 존재 | 연동됨 |
| `/api/lessons/{id}/` | 매핑 존재 | 연동됨(단, 리스트 호출은 `teacher/classes` 사용 중) |

## 3) 프론트 기대 key vs 백엔드 실제 key (핵심 충돌)

- `Student`
  - 프론트 타입: `fee`, `regular_day`, `regular_time`, `lesson_method`, `payment_status` 사용
  - 백엔드 모델: `default_class_fee` 존재, 위 key 다수 없음
  - 현재 `students/page.tsx`에서 임시 매핑(`default_class_fee -> fee`) 수행
- `Lesson`
  - 프론트 타입: `lesson_date`, `method`, `prep_done`, `homework` 사용
  - 백엔드 모델: `class_date`, `class_mode`, `prep_checked` 사용
- `Todo`
  - 프론트 타입: `text`, `due_date`, `done`, `related_student`, `related_lesson`
  - 백엔드 모델: `title`, `task_date`, `is_completed`, `student`, `lesson`

## 4) trailing slash 정책 (현재 코드 기준)

- DRF Router endpoint는 **trailing slash 포함 경로**가 기본: `/api/students/`, `/api/lessons/` 등.
- 홈 API (`/api/home/*`)는 `config/urls.py`에 **slash 없이 정의**: `/api/home/summary` 형식.
- 프론트는 현재 이 혼합 정책을 그대로 사용 중이므로, 신규 API 추가 시 기존 패턴을 임의로 통일하지 말고 먼저 라우팅 정의를 확인한다.

## 5) 응답 형식 통일 원칙

- 목록 API는 DRF pagination(`results`) 또는 배열 중 하나로만 반환하고, 프론트 공통 함수(`normalizeList`) 규칙을 벗어나지 않는다.
- 동일 리소스에서 key naming을 섞지 않는다. 예: lesson은 `class_date`와 `lesson_date`를 동시에 쓰지 않는다.
- serializer에서 key 변경 시 `frontend/lib/types.ts`와 `frontend/lib/api.ts`를 동시에 수정한다.

## 6) 금지 원칙

- **추측으로 응답 shape를 바꾸지 말 것.**
- 프론트가 깨졌다고 임의 key를 추가/삭제하지 말고, 모델/serializer/프론트 타입을 실제 코드 기준으로 맞춘다.
- 미연동 API를 "정상 동작"으로 문서화하지 말고, 반드시 **미연동/미구현**으로 표시한다.

## 이 문서를 갱신해야 하는 경우

- `backend/config/urls.py` 또는 `backend/apps/*/urls.py` 수정 시
- `backend/apps/*/serializers.py` 필드 변경 시
- `frontend/lib/api.ts` endpoint 상수 또는 파싱 로직 변경 시
- `frontend/lib/types.ts` 타입 키 변경 시

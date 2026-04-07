# TeachBee 🐝

> 개인 과외 선생님 전용 스마트 관리앱

---

## 프로젝트 구조

```
teachbee/
├── frontend/          # Next.js 15 + TypeScript + Tailwind CSS
│   ├── app/           # App Router 페이지
│   ├── components/    # 재사용 가능한 컴포넌트
│   ├── hooks/         # API 연동 커스텀 훅
│   ├── lib/           # types, api, utils, constants
│   └── styles/        # 전역 CSS
└── backend/           # Django 5 + DRF
    ├── config/        # settings, urls, wsgi
    ├── apps/
    │   ├── students/  # 학생 관리
    │   ├── lessons/   # 수업 + 결강/보강
    │   ├── billing/   # 정산
    │   └── todos/     # 할 일
    └── fixtures/      # 시드 데이터
```

---

## 설치 방법

### 프론트엔드

```bash
cd frontend
npm install
cp .env.example .env.local
# .env.local에서 NEXT_PUBLIC_API_URL 확인
```

### 백엔드

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# .env에서 DB 정보 입력
```

---

## 실행 방법

### 프론트엔드

```bash
cd frontend
npm run dev
# → http://localhost:3000
```

### 백엔드

```bash
cd backend

# PostgreSQL 없이 SQLite로 빠르게 시작하려면:
USE_SQLITE=True python manage.py migrate

# PostgreSQL 사용 시 .env 설정 후:
python manage.py migrate

# 시드 데이터 로드:
python manage.py loaddata fixtures/seed_data.json

# 개발 서버 실행:
python manage.py runserver 8000
# → http://localhost:8000
```

---

## 환경변수

### frontend/.env.local

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### backend/.env

```env
DEBUG=True
SECRET_KEY=your-secret-key

DB_NAME=teachbee
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432

CORS_ALLOWED_ORIGINS=http://localhost:3000
```

---

## API 목록

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET/POST | `/api/students/` | 학생 목록 / 추가 |
| GET/PATCH/DELETE | `/api/students/{id}/` | 학생 상세 / 수정 / 삭제 |
| GET/POST | `/api/lessons/` | 수업 목록 / 추가 |
| GET/PATCH/DELETE | `/api/lessons/{id}/` | 수업 상세 / 수정 / 삭제 |
| GET/POST | `/api/cancel-makeups/` | 결강/보강 목록 / 추가 |
| PATCH | `/api/cancel-makeups/{id}/` | 결강/보강 수정 |
| GET/POST | `/api/todos/` | 할 일 목록 / 추가 |
| PATCH/DELETE | `/api/todos/{id}/` | 할 일 수정 / 삭제 |
| GET/POST | `/api/payments/` | 정산 목록 / 추가 |
| PATCH | `/api/payments/{id}/` | 정산 수정 |

### 필터 파라미터

```
GET /api/lessons/?date=2026-04-07
GET /api/lessons/?student=1
GET /api/todos/?due_date=2026-04-07&done=false
GET /api/cancel-makeups/?makeup_done=false
```

---

## 페이지 구조

| 경로 | 설명 |
|------|------|
| `/onboarding` | 스플래시 + 시작하기 화면 |
| `/home` | 홈 (오늘 수업, 할 일, KPI) |
| `/calendar` | 4주 타임라인 + 날짜별 수업 |
| `/students` | 학생 목록 + 검색 |
| `/students/[id]` | 학생 상세 |
| `/billing` | 정산 현황 |
| `/todo` | 할 일 + 자동 리마인더 |
| `/settings` | 설정 |

---

## 다음 작업 TODO

### 기능
- [ ] 인증/로그인 (JWT)
- [ ] 학생별 정산 히스토리 페이지
- [ ] 결강 등록 폼 컴포넌트 분리
- [ ] 캘린더 월간 뷰 추가
- [ ] 알림 설정 기능
- [ ] 수업 시간 자동 계산 (start_time + duration → end_time)

### 개발
- [ ] React Query 또는 SWR 도입으로 캐싱/재검증 개선
- [ ] E2E 테스트 (Playwright)
- [ ] Django API 단위 테스트
- [ ] Docker Compose로 개발환경 통합
- [ ] PWA 설정 (오프라인, 홈 화면 추가)

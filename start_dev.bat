@echo off
echo [0/2] Cleaning up existing ports (3000, 8000)...
:: 3000번(Next.js)과 8000번(Django) 포트를 사용하는 프로세스를 강제 종료합니다.
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000') do taskkill /f /pid %%a >nul 2>&1

echo [1/2] Starting Frontend (Next.js) on http://localhost:3000...
cd frontend
if not exist .env.local copy .env.example .env.local
start "TeachBee-Frontend" cmd /k "npm run dev"

cd ..

echo [2/2] Starting Backend (Django) on http://localhost:8000...
cd backend
if not exist .env copy .env.example .env
if not exist venv (python -m venv venv)
start "TeachBee-Backend" cmd /k "venv\Scripts\activate && python manage.py runserver 8000"

echo.
echo ==========================================
echo  TeachBee Servers are RESTARTING!
echo  Frontend: http://localhost:3000
echo  Backend:  http://localhost:8000
echo ==========================================
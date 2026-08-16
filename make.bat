@echo off
setlocal

set TARGET=%1

if "%TARGET%"=="" (
    echo Usage: make.bat [kill^|migrate^|lint^|format^|back^|front^|dev]
    exit /b 1
)

if /i "%TARGET%"=="kill" goto kill
if /i "%TARGET%"=="migrate" goto migrate
if /i "%TARGET%"=="lint" goto lint
if /i "%TARGET%"=="format" goto format
if /i "%TARGET%"=="back" goto back
if /i "%TARGET%"=="front" goto front
if /i "%TARGET%"=="dev" goto dev

echo Unknown target: %TARGET%
exit /b 1

:kill
powershell -NoProfile -Command "$p = Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -match 'uvicorn app[.]main:app' }; if ($p) { $p | ForEach-Object { Stop-Process -Id $_.ProcessId -Force } }"
powershell -NoProfile -Command "$p = Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -match 'next[ -]dev|next[-]server' }; if ($p) { $p | ForEach-Object { Stop-Process -Id $_.ProcessId -Force } }"
echo Stopped back and front instances
exit /b 0

:migrate
cd back
call .venv\Scripts\alembic upgrade head
cd ..
exit /b 0

:lint
cd back
call .venv\Scripts\ruff check app/
cd ..
exit /b 0

:format
cd back
call .venv\Scripts\ruff format app/
cd ..
exit /b 0

:back
cd back
call .venv\Scripts\alembic upgrade head
call .venv\Scripts\uvicorn app.main:app --reload --port 8000
cd ..
exit /b 0

:front
cd front\commercialhub
call npm run dev
cd ..\..
exit /b 0

:dev
start "Commercial-Hub back" cmd /k "cd /d %~dp0back && .venv\Scripts\alembic upgrade head && .venv\Scripts\uvicorn app.main:app --reload --port 8000"
start "Commercial-Hub front" cmd /k "cd /d %~dp0front\commercialhub && npm run dev"
exit /b 0

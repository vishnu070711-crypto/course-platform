@echo off
REM CourseHub MERN Stack - Start Script
REM This script starts both backend and frontend servers

echo.
echo ========================================
echo   CourseHub MERN Stack - Startup Script
echo ========================================
echo.

REM Check if we're in the right directory
if not exist "backend" (
    echo Error: Please run this script from the nodejs directory
    echo Expected: c:\Users\HP\Documents\python0.0\nodejs
    pause
    exit /b 1
)

echo Starting backend server...
start cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak

echo Starting frontend server...
start cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo Servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo ========================================
echo.
pause

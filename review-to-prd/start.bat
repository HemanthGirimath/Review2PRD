@echo off
echo Starting Review2PRD Backend...
start "Review2PRD Backend" cmd /k "cd /d D:\GravityAgent\review-to-prd\backend && npm run dev"

timeout /t 2 >nul

echo Starting Review2PRD Frontend...
start "Review2PRD Frontend" cmd /k "cd /d D:\GravityAgent\review-to-prd\frontend && npm run dev"

echo.
echo Both servers starting...
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:5173 (or 5174 if 5173 is taken)
echo.
echo Make sure Ollama is running: ollama serve

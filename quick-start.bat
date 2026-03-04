@echo off
echo 🚀 盘古AI创世系统 - 快速启动
echo ========================================
echo.

echo 步骤1: 启动后端服务...
cd backend
call npm start
if %errorlevel% neq 0 (
    echo ❌ 后端启动失败
    pause
    exit /b 1
)

echo.
echo 步骤2: 启动前端服务...
cd ..\frontend
call npm run dev
if %errorlevel% neq 0 (
    echo ❌ 前端启动失败
    pause
    exit /b 1
)

echo.
echo ========================================
echo 🎉 系统启动成功！
echo.
echo 访问以下地址：
echo 前端: http://localhost:3000
echo 后端API: http://localhost:3001
echo.
echo 按任意键退出...
pause >nul
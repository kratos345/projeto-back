@echo off
REM Script para iniciar Backend + Frontend automaticamente
REM Compatível com Windows

echo.
echo ========================================
echo   INICIANDO PROJETO COMPLETO
echo ========================================
echo.

REM Instala dependências se a pasta node_modules não existir
if not exist "node_modules" (
    echo Instalando dependências da raiz...
    call npm install
)

if not exist "api\node_modules" (
    echo Instalando dependências da API...
    cd api
    call npm install
    cd ..
)

if not exist "web\node_modules" (
    echo Instalando dependências do Frontend...
    cd web
    call npm install
    cd ..
)

echo.
echo ========================================
echo   Iniciando Backend + Frontend...
echo ========================================
echo.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo Pressione Ctrl+C para parar tudo
echo.

npm run dev

pause

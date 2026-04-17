@echo off
echo ========================================
echo   Regeneration du client Prisma
echo ========================================
echo.

echo Etape 1: Arret du serveur (si actif)...
taskkill /F /IM node.exe /T 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Etape 2: Nettoyage du cache Prisma...
if exist "node_modules\.prisma" (
    rmdir /S /Q "node_modules\.prisma"
    echo Cache Prisma supprime
) else (
    echo Pas de cache Prisma a supprimer
)

echo.
echo Etape 3: Generation du client Prisma...
call npx prisma generate

echo.
echo Etape 4: Push des changements vers la base de donnees...
call npx prisma db push

echo.
echo ========================================
echo   Termine !
echo ========================================
echo.
echo Vous pouvez maintenant redemarrer le serveur avec:
echo npm run dev
echo.
pause

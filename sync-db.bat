@echo off
chcp 65001 > nul

REM ========================================
REM ПЕРЕХОДИМ В ПРАВИЛЬНУЮ ПАПКУ С DOCKER-COMPOSE.YML
REM ========================================
cd /d "%~dp0"

echo ========================================
echo  Синхронизация БД с боевого сервера
echo ========================================
echo.

REM Проверка Docker и наличия docker-compose.yml
if not exist docker-compose.yml (
    echo ОШИБКА: docker-compose.yml не найден!
    echo Текущая папка: %cd%
    pause
    exit /b 1
)

REM Проверка Docker
docker info >nul 2>&1
if errorlevel 1 (
    echo ОШИБКА: Docker не запущен!
    pause
    exit /b 1
)

echo [1/6] Останавливаем все контейнеры...
docker-compose down

echo [2/6] Удаляем данные БД...
docker volume rm u40ta_postgres_data >nul 2>&1

echo [3/6] Запускаем чистую БД...
docker-compose up -d postgres

echo [4/6] Ждем запуска Postgres (15 секунд)...
timeout /t 15 /nobreak >nul

echo [5/6] Проверяем подключение к БД...
docker-compose exec -T postgres pg_isready -U developer -d u40ta_db
if errorlevel 1 (
    echo ОШИБКА: Postgres не запустился
    pause
    exit /b 1
)

echo [6/6] Копируем данные с боевого сервера...
echo Пароль: Size2album^&handMaid

REM Используем .pgpass файл внутри контейнера
docker-compose exec -T postgres sh -c "echo '80.87.202.52:5432:u40ta_db:u40ta_user:Size2album&handMaid' > /tmp/.pgpass && chmod 600 /tmp/.pgpass && PGPASSFILE=/tmp/.pgpass pg_dump -h 80.87.202.52 -U u40ta_user -d u40ta_db -c --if-exists --no-owner --no-privileges" | docker-compose exec -T postgres psql -U developer -d u40ta_db

if errorlevel 1 (
    echo.
    echo ОШИБКА: Не удалось скопировать данные!
) else (
    echo.
    echo ========================================
    echo  Синхронизация завершена успешно!
    echo  Игнорируйте ошибки 'role does not exist' - это нормально
    echo ========================================
)

echo.
pause
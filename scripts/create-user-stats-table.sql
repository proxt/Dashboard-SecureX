-- Создание таблицы статистики пользователей
CREATE TABLE IF NOT EXISTS user_stats (
    id SERIAL PRIMARY KEY,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_users INTEGER DEFAULT 0,
    admins INTEGER DEFAULT 0,
    sellers INTEGER DEFAULT 0,
    banned_users INTEGER DEFAULT 0,
    active_users_today INTEGER DEFAULT 0,
    new_registrations_today INTEGER DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставка тестовых данных
INSERT INTO user_stats (
    total_users,
    admins,
    sellers,
    banned_users,
    active_users_today,
    new_registrations_today
) VALUES (
    184,
    3,
    0,
    0,
    45,
    12
);

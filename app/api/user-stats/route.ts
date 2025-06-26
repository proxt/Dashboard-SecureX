import { NextResponse } from "next/server"

// Тестовые данные для статистики пользователей
const mockUserStats = {
  id: 1,
  date: new Date().toISOString(),
  total_users: 184,
  admins: 3,
  sellers: 0,
  banned_users: 0,
  active_users_today: 45,
  new_registrations_today: 12,
  last_updated: new Date().toISOString(),
}

export async function GET() {
  try {
    // Проверяем наличие DATABASE_URL
    if (!process.env.DATABASE_URL) {
      console.log("DATABASE_URL не настроен, используем тестовые данные")
      return NextResponse.json(mockUserStats)
    }

    // Попытка подключения к базе данных
    try {
      const { Pool } = await import("pg")
      const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
      })

      const client = await pool.connect()

      try {
        // Получаем последнюю запись статистики пользователей
        const result = await client.query(`
          SELECT 
            id,
            date,
            total_users,
            admins,
            sellers,
            banned_users,
            active_users_today,
            new_registrations_today,
            last_updated
          FROM user_stats 
          ORDER BY date DESC 
          LIMIT 1
        `)

        if (result.rows.length === 0) {
          console.log("Записи статистики пользователей не найдены, используем тестовые данные")
          return NextResponse.json(mockUserStats)
        }

        const stats = result.rows[0]
        return NextResponse.json(stats)
      } finally {
        client.release()
      }
    } catch (importError) {
      console.log("Пакет pg недоступен, используем тестовые данные:", importError)
      return NextResponse.json(mockUserStats)
    }
  } catch (error) {
    console.error("Ошибка базы данных:", error)
    console.log("Возвращаем тестовые данные из-за ошибки базы данных")
    return NextResponse.json(mockUserStats)
  }
}

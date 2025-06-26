import { NextResponse } from "next/server"

// Генерация тестовых исторических данных для пользователей
function generateUserHistoricalData(metric: string, from: Date, to: Date) {
  const data = []
  const daysDiff = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24))

  for (let i = 0; i <= daysDiff; i++) {
    const date = new Date(from.getTime() + i * 24 * 60 * 60 * 1000)
    let value = 0

    // Генерируем разные значения в зависимости от метрики пользователей
    switch (metric) {
      case "total-users":
        value = Math.floor(Math.random() * 50) + 150 // 150-200
        break
      case "admins":
        value = Math.floor(Math.random() * 3) + 2 // 2-5
        break
      case "sellers":
        value = Math.floor(Math.random() * 5) + 0 // 0-5
        break
      case "banned-users":
        value = Math.floor(Math.random() * 3) + 0 // 0-3
        break
      case "active-today":
        value = Math.floor(Math.random() * 80) + 20 // 20-100
        break
      case "new-registrations":
        value = Math.floor(Math.random() * 20) + 5 // 5-25
        break
      default:
        value = Math.floor(Math.random() * 100) + 10
    }

    data.push({
      date: date.toISOString(),
      value,
      label: date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" }),
    })
  }

  return data
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const metric = searchParams.get("metric")
    const from = searchParams.get("from")
    const to = searchParams.get("to")
    const comparisonFrom = searchParams.get("comparison_from")
    const comparisonTo = searchParams.get("comparison_to")

    if (!metric || !from || !to) {
      return NextResponse.json({ error: "Отсутствуют обязательные параметры" }, { status: 400 })
    }

    const fromDate = new Date(from)
    const toDate = new Date(to)

    // Генерируем основные данные
    const historicalData = generateUserHistoricalData(metric, fromDate, toDate)

    // Генерируем данные для сравнения, если запрошены
    let comparisonData = undefined
    if (comparisonFrom && comparisonTo) {
      const comparisonFromDate = new Date(comparisonFrom)
      const comparisonToDate = new Date(comparisonTo)
      comparisonData = generateUserHistoricalData(metric, comparisonFromDate, comparisonToDate)
    }

    // Текущее значение (последнее в основных данных)
    const currentValue = historicalData[historicalData.length - 1]?.value || 0

    const response = {
      metric,
      title: metric,
      current_value: currentValue,
      historical_data: historicalData,
      comparison_data: comparisonData,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Ошибка API детальной статистики пользователей:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}

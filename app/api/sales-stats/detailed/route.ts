import { NextResponse } from "next/server"

// Генерация тестовых исторических данных
function generateHistoricalData(metric: string, from: Date, to: Date) {
  const data = []
  const daysDiff = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24))

  for (let i = 0; i <= daysDiff; i++) {
    const date = new Date(from.getTime() + i * 24 * 60 * 60 * 1000)
    let value = 0

    // Генерируем разные значения в зависимости от метрики
    switch (metric) {
      case "purchases-today":
      case "purchases-month":
      case "purchases-total":
        value = Math.floor(Math.random() * 100) + 20
        break
      case "earned-last-month":
      case "earned-this-month":
      case "earned-total":
        value = Math.floor(Math.random() * 50000) + 10000
        break
      case "net-last-month":
      case "net-this-month":
      case "net-total":
        value = Math.floor(Math.random() * 30000) + 5000
        break
      case "payout-sellers-last-month":
        value = Math.floor(Math.random() * 20000) + 3000
        break
      default:
        value = Math.floor(Math.random() * 1000) + 100
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
    const historicalData = generateHistoricalData(metric, fromDate, toDate)

    // Генерируем данные для сравнения, если запрошены
    let comparisonData = undefined
    if (comparisonFrom && comparisonTo) {
      const comparisonFromDate = new Date(comparisonFrom)
      const comparisonToDate = new Date(comparisonTo)
      comparisonData = generateHistoricalData(metric, comparisonFromDate, comparisonToDate)
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
    console.error("Ошибка API детальной статистики:", error)
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 })
  }
}

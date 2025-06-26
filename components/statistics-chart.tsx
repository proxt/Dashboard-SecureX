"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ChartData {
  date: string
  value: number
  label: string
}

interface StatisticsChartProps {
  data: ChartData[]
  comparisonData?: ChartData[]
  metric: string
  formatValue: (value: number) => string
}

export function StatisticsChart({ data, comparisonData, metric, formatValue }: StatisticsChartProps) {
  // Объединяем данные для отображения
  const chartData = data.map((item, index) => {
    const result: any = {
      date: item.label,
      current: item.value,
    }

    if (comparisonData && comparisonData[index]) {
      result.comparison = comparisonData[index].value
    }

    return result
  })

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey === "current" ? "Основной период" : "Сравнение"}: {formatValue(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
            className="text-muted-foreground"
          />
          <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="current"
            name="Основной период"
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
            opacity={0.8}
          />
          {comparisonData && (
            <Bar
              dataKey="comparison"
              name="Период сравнения"
              fill="hsl(var(--secondary))"
              radius={[4, 4, 0, 0]}
              opacity={0.6}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

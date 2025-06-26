"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Users, BarChart3 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import { StatisticsChart } from "@/components/statistics-chart"
import { DateRangePicker } from "@/components/date-range-picker"
import { CustomCheckbox } from "@/components/custom-checkbox"

interface DetailedUserStats {
  metric: string
  title: string
  current_value: number
  historical_data: Array<{
    date: string
    value: number
    label: string
  }>
  comparison_data?: Array<{
    date: string
    value: number
    label: string
  }>
}

const userMetricTitles: Record<string, string> = {
  "total-users": "Всего пользователей",
  admins: "Админов",
  sellers: "Продажников",
  "banned-users": "Забаненных",
  "active-today": "Активных сегодня",
  "new-registrations": "Новых регистраций сегодня",
}

export default function UserMetricDetailPage() {
  const [stats, setStats] = useState<DetailedUserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date(),
  })
  const [comparisonRange, setComparisonRange] = useState({
    from: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    to: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  })
  const [showComparison, setShowComparison] = useState(false)

  const router = useRouter()
  const params = useParams()
  const metric = params.metric as string

  // Проверка авторизации
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("admin_authenticated")
    if (!isAuthenticated || isAuthenticated !== "true") {
      router.push("/admin/login")
      return
    }
  }, [router])

  const fetchDetailedStats = async () => {
    try {
      const queryParams = new URLSearchParams({
        metric,
        from: dateRange.from.toISOString(),
        to: dateRange.to.toISOString(),
      })

      if (showComparison) {
        queryParams.append("comparison_from", comparisonRange.from.toISOString())
        queryParams.append("comparison_to", comparisonRange.to.toISOString())
      }

      const response = await fetch(`/api/user-stats/detailed?${queryParams}`)

      if (!response.ok) {
        throw new Error("Не удалось загрузить детальную статистику пользователей")
      }

      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Ошибка загрузки детальной статистики пользователей:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить детальную статистику пользователей",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("admin_authenticated")
    if (isAuthenticated === "true") {
      fetchDetailedStats()
    }
  }, [metric, dateRange, comparisonRange, showComparison])

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("ru-RU").format(num)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Назад
              </Button>
              <BarChart3 className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Загрузка...</h1>
            </div>
            <ThemeToggle />
          </div>
          <div className="animate-pulse space-y-6">
            <div className="h-64 bg-muted rounded-lg"></div>
            <div className="h-96 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Данные недоступны</h2>
              <p className="text-muted-foreground mb-4">Не удалось загрузить детальную статистику пользователей</p>
              <Button onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Вернуться назад
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>
            <BarChart3 className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">{userMetricTitles[metric] || "Детальная статистика пользователей"}</h1>
          </div>
          <ThemeToggle />
        </div>

        {/* Текущее значение */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Текущее значение
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{formatNumber(stats.current_value)}</div>
          </CardContent>
        </Card>

        {/* Управление датами */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Основной период
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DateRangePicker
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                label="Выберите период для анализа"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Сравнение с периодом
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CustomCheckbox
                id="comparison"
                checked={showComparison}
                onChange={setShowComparison}
                label="Включить сравнение"
              />
              {showComparison && (
                <DateRangePicker
                  dateRange={comparisonRange}
                  onDateRangeChange={setComparisonRange}
                  label="Период для сравнения"
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* График */}
        <Card>
          <CardHeader>
            <CardTitle>Гистограмма пользователей</CardTitle>
          </CardHeader>
          <CardContent>
            <StatisticsChart
              data={stats.historical_data}
              comparisonData={showComparison ? stats.comparison_data : undefined}
              metric={metric}
              formatValue={formatNumber}
            />
          </CardContent>
        </Card>

        {/* Сводка */}
        {stats.historical_data.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Сводка за период</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatNumber(Math.max(...stats.historical_data.map((d) => d.value)))}
                  </div>
                  <div className="text-sm text-muted-foreground">Максимум</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatNumber(
                      Math.round(
                        stats.historical_data.reduce((sum, d) => sum + d.value, 0) / stats.historical_data.length,
                      ),
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">Среднее</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {formatNumber(Math.min(...stats.historical_data.map((d) => d.value)))}
                  </div>
                  <div className="text-sm text-muted-foreground">Минимум</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

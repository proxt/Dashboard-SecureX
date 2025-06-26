"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Calendar, DollarSign, Target, Wallet, LogOut } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import { NavigationTabs } from "@/components/navigation-tabs"
import { Logo } from "@/components/logo"

interface SalesStats {
  id: number
  date: string
  purchases_today: number
  purchases_month: number
  purchases_total: number
  earned_last_month: number
  earned_this_month: number
  earned_total: number
  net_last_month: number
  net_this_month: number
  net_total: number
  payout_sellers_last_month: number
}

export default function SalesStatisticsPage() {
  const [stats, setStats] = useState<SalesStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [usingMockData, setUsingMockData] = useState(false)
  const [username, setUsername] = useState("")
  const router = useRouter()

  // Проверка авторизации
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("admin_authenticated")
    const storedUsername = localStorage.getItem("admin_username")

    if (!isAuthenticated || isAuthenticated !== "true") {
      router.push("/admin/login")
      return
    }

    if (storedUsername) {
      setUsername(storedUsername)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated")
    localStorage.removeItem("admin_username")
    toast({
      title: "Выход выполнен",
      description: "Вы успешно вышли из системы",
    })
    router.push("/admin/login")
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/sales-stats", {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Ошибка API:", response.status, errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log("Статистика успешно загружена:", data)

      // Обновляем время последнего обновления
      data.date = new Date().toISOString()

      // Проверяем, используем ли мы тестовые данные
      setUsingMockData(data.id === 1 && data.purchases_today === 45)
      setStats(data)
    } catch (error) {
      console.error("Ошибка загрузки статистики:", error)
      toast({
        title: "Ошибка",
        description: `Не удалось загрузить статистику: ${error instanceof Error ? error.message : "Неизвестная ошибка"}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchStats()
    toast({
      title: "Успешно",
      description: "Статистика продаж обновлена",
    })
  }

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("admin_authenticated")
    if (isAuthenticated === "true") {
      fetchStats()
    }
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("ru-RU").format(num)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Logo size="lg" />
            <div className="flex items-center gap-3">
              <ThemeToggle />
            </div>
          </div>
          <NavigationTabs />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
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
              <p className="text-muted-foreground mb-4">Не удалось загрузить статистику продаж</p>
              <Button onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                Попробовать снова
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const statsCards = [
    {
      title: "Покупки сегодня",
      value: formatNumber(stats.purchases_today),
      icon: Calendar,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Покупки в этом месяце",
      value: formatNumber(stats.purchases_month),
      icon: Calendar,
      color: "text-green-600 dark:text-green-400",
    },
    {
      title: "Всего покупок",
      value: formatNumber(stats.purchases_total),
      icon: Target,
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Заработано в прошлом месяце",
      value: formatCurrency(stats.earned_last_month),
      icon: DollarSign,
      color: "text-orange-600 dark:text-orange-400",
    },
    {
      title: "Заработано в этом месяце",
      value: formatCurrency(stats.earned_this_month),
      icon: DollarSign,
      color: "text-green-600 dark:text-green-400",
    },
    {
      title: "Всего заработано",
      value: formatCurrency(stats.earned_total),
      icon: Target,
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Чистая прибыль прошлый месяц",
      value: formatCurrency(stats.net_last_month),
      icon: Wallet,
      color: "text-red-600 dark:text-red-400",
    },
    {
      title: "Чистая прибыль этот месяц",
      value: formatCurrency(stats.net_this_month),
      icon: Wallet,
      color: "text-green-600 dark:text-green-400",
    },
    {
      title: "Всего чистой прибыли",
      value: formatCurrency(stats.net_total),
      icon: Target,
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Выплаты продавцам прошлый месяц",
      value: formatCurrency(stats.payout_sellers_last_month),
      icon: Wallet,
      color: "text-indigo-600 dark:text-indigo-400",
    },
  ]

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Logo size="lg" />
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Добро пожаловать, {username}</span>
            <ThemeToggle />
            <Button onClick={handleRefresh} disabled={refreshing} variant="outline" size="sm">
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Обновить
            </Button>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Выйти
            </Button>
          </div>
        </div>

        <NavigationTabs />

        {usingMockData && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
              <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm font-medium">Режим разработки</span>
            </div>
            <p className="text-sm text-yellow-600/80 dark:text-yellow-400/80 mt-1">
              Используются тестовые данные. Настройте переменную окружения DATABASE_URL для подключения к базе данных
              PostgreSQL.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {statsCards.map((card, index) => {
            const IconComponent = card.icon
            const metricKey = [
              "purchases-today",
              "purchases-month",
              "purchases-total",
              "earned-last-month",
              "earned-this-month",
              "earned-total",
              "net-last-month",
              "net-this-month",
              "net-total",
              "payout-sellers-last-month",
            ][index]

            return (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105"
                onClick={() => router.push(`/admin/sales-statistics/${metricKey}`)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                  <IconComponent className={`h-4 w-4 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">Нажмите для подробностей</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Последнее обновление: {new Date(stats.date).toLocaleString("ru-RU")}
        </div>
      </div>
    </div>
  )
}

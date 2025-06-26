"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Users, UserCheck, UserX, Shield, LogOut, Clock } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import { NavigationTabs } from "@/components/navigation-tabs"
import { Logo } from "@/components/logo"

interface UserStats {
  id: number
  date: string
  total_users: number
  admins: number
  sellers: number
  banned_users: number
  active_users_today: number
  new_registrations_today: number
  last_updated: string
}

export default function UserStatisticsPage() {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [usingMockData, setUsingMockData] = useState(false)
  const [username, setUsername] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())
  const router = useRouter()

  // Обновление времени каждую секунду
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

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
      const response = await fetch("/api/user-stats", {
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
      console.log("Статистика пользователей успешно загружена:", data)

      // Обновляем время последнего обновления
      data.date = new Date().toISOString()

      // Проверяем, используем ли мы тестовые данные
      setUsingMockData(data.id === 1 && data.total_users === 184)
      setStats(data)
    } catch (error) {
      console.error("Ошибка загрузки статистики пользователей:", error)
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
      description: "Статистика пользователей обновлена",
    })
  }

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("admin_authenticated")
    if (isAuthenticated === "true") {
      fetchStats()
    }
  }, [])

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
            {Array.from({ length: 6 }).map((_, i) => (
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
              <p className="text-muted-foreground mb-4">Не удалось загрузить статистику пользователей</p>
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
      title: "Всего пользователей",
      value: formatNumber(stats.total_users),
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      metric: "total-users",
    },
    {
      title: "Админов",
      value: formatNumber(stats.admins),
      icon: Shield,
      color: "text-red-600 dark:text-red-400",
      metric: "admins",
    },
    {
      title: "Продажников",
      value: formatNumber(stats.sellers),
      icon: UserCheck,
      color: "text-green-600 dark:text-green-400",
      metric: "sellers",
    },
    {
      title: "Забаненных",
      value: formatNumber(stats.banned_users),
      icon: UserX,
      color: "text-gray-600 dark:text-gray-400",
      metric: "banned-users",
    },
    {
      title: "Активных сегодня",
      value: formatNumber(stats.active_users_today),
      icon: Users,
      color: "text-emerald-600 dark:text-emerald-400",
      metric: "active-today",
    },
    {
      title: "Новых регистраций сегодня",
      value: formatNumber(stats.new_registrations_today),
      icon: UserCheck,
      color: "text-purple-600 dark:text-purple-400",
      metric: "new-registrations",
    },
  ]

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Logo size="lg" />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{currentTime.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
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

        {/* Основная статистика как на изображении */}
        <Card className="mb-6 bg-gradient-to-r from-primary/10 to-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-sm"></div>
              Статистика:
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-lg">
              <div className="flex items-center gap-2">
                <span>•</span>
                <span>
                  Всего пользователей: <strong>{formatNumber(stats.total_users)}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>•</span>
                <span>
                  Админов: <strong>{formatNumber(stats.admins)}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>•</span>
                <span>
                  Продажников: <strong>{formatNumber(stats.sellers)}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>•</span>
                <span>
                  Забаненных: <strong>{formatNumber(stats.banned_users)}</strong>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Детальные карточки */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {statsCards.map((card, index) => {
            const IconComponent = card.icon

            return (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105"
                onClick={() => router.push(`/admin/user-statistics/${card.metric}`)}
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

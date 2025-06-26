"use client"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { TrendingUp, Users } from "lucide-react"

export function NavigationTabs() {
  const router = useRouter()
  const pathname = usePathname()

  const tabs = [
    {
      id: "sales",
      label: "Статистика продаж",
      icon: TrendingUp,
      path: "/admin/sales-statistics",
    },
    {
      id: "users",
      label: "Статистика пользователей",
      icon: Users,
      path: "/admin/user-statistics",
    },
  ]

  const activeTab = tabs.find((tab) => pathname.startsWith(tab.path))?.id || "sales"

  return (
    <div className="flex gap-2 mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id

        return (
          <Button
            key={tab.id}
            variant={isActive ? "default" : "outline"}
            onClick={() => router.push(tab.path)}
            className="flex items-center gap-2"
          >
            <Icon className="h-4 w-4" />
            {tab.label}
          </Button>
        )
      })}
    </div>
  )
}

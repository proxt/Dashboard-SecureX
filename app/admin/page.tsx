"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    // Перенаправляем на страницу входа
    router.push("/admin/login")
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Перенаправление...</h1>
        <p className="text-muted-foreground">Переходим на страницу входа</p>
      </div>
    </div>
  )
}

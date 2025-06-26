"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sun, Moon, Palette, Sparkles } from "lucide-react"

type Theme = "light" | "dark" | "fluent" | "midnight"

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark")

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme
    if (savedTheme) {
      setTheme(savedTheme)
      applyTheme(savedTheme)
    }
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement

    // Удаляем все классы тем
    root.classList.remove("light", "dark", "fluent", "midnight")

    // Добавляем новый класс темы
    root.classList.add(newTheme)

    // Сохраняем в localStorage
    localStorage.setItem("theme", newTheme)
    setTheme(newTheme)
  }

  const themes = [
    {
      name: "light",
      label: "Светлая",
      icon: Sun,
    },
    {
      name: "dark" as const,
      label: "Темная",
      icon: Moon,
    },
    {
      name: "fluent" as const,
      label: "Полупрозрачная",
      icon: Sparkles,
    },
    {
      name: "midnight" as const,
      label: "Полночь",
      icon: Palette,
    },
  ]

  const currentTheme = themes.find((t) => t.name === theme)
  const CurrentIcon = currentTheme?.icon || Moon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <CurrentIcon className="h-4 w-4 mr-2" />
          Темы
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((themeOption) => {
          const Icon = themeOption.icon
          return (
            <DropdownMenuItem
              key={themeOption.name}
              onClick={() => applyTheme(themeOption.name)}
              className={theme === themeOption.name ? "bg-accent" : ""}
            >
              <Icon className="h-4 w-4 mr-2" />
              {themeOption.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

"use client"

import Image from "next/image"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  showText?: boolean
  className?: string
  vertical?: boolean
}

export function Logo({ size = "md", showText = true, className = "", vertical = false }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-20 w-20",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-4xl",
  }

  const containerClass = vertical ? "flex flex-col items-center gap-3" : "flex items-center gap-4"

  return (
    <div className={`${containerClass} ${className}`}>
      <div className={`${sizeClasses[size]} relative group`}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300 blur-lg"></div>
        <div className="relative bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-xl p-2 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
          <Image
            src="/images/securex-logo.png"
            alt="SecureX VPN"
            width={80}
            height={80}
            className="object-contain filter drop-shadow-sm"
            priority
          />
        </div>
      </div>
      {showText && (
        <div className={vertical ? "text-center" : ""}>
          <h1
            className={`font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent ${textSizeClasses[size]} tracking-tight`}
          >
            SecureX VPN
          </h1>
          {size === "lg" || size === "xl" ? (
            <p className="text-sm text-muted-foreground mt-1 font-medium">Панель Администратора</p>
          ) : null}
        </div>
      )}
    </div>
  )
}

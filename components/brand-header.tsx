"use client"

import { Logo } from "@/components/logo"

interface BrandHeaderProps {
  title?: string
  subtitle?: string
  className?: string
}

export function BrandHeader({ title, subtitle, className = "" }: BrandHeaderProps) {
  return (
    <div className={`text-center space-y-6 ${className}`}>
      <Logo size="xl" showText={true} vertical={true} />
      {title && <h2 className="text-2xl font-semibold text-foreground">{title}</h2>}
      {subtitle && <p className="text-muted-foreground max-w-md mx-auto">{subtitle}</p>}
    </div>
  )
}

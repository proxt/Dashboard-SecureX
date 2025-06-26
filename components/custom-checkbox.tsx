"use client"

import { Check } from "lucide-react"

interface CustomCheckboxProps {
  id: string
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  className?: string
}

export function CustomCheckbox({ id, checked, onChange, label, className = "" }: CustomCheckboxProps) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <label
          htmlFor={id}
          className={`
            flex items-center justify-center w-5 h-5 rounded-md border-2 cursor-pointer transition-all duration-200
            ${
              checked
                ? "bg-primary border-primary text-primary-foreground shadow-lg"
                : "border-muted-foreground/30 hover:border-primary/50 bg-background"
            }
          `}
        >
          {checked && <Check className="h-3 w-3 stroke-[3]" />}
        </label>
      </div>
      <label htmlFor={id} className="text-sm font-medium cursor-pointer select-none">
        {label}
      </label>
    </div>
  )
}

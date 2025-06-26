"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarDays } from "lucide-react"

interface DateRange {
  from: Date
  to: Date
}

interface DateRangePickerProps {
  dateRange: DateRange
  onDateRangeChange: (range: DateRange) => void
  label?: string
}

export function DateRangePicker({ dateRange, onDateRangeChange, label }: DateRangePickerProps) {
  const [fromDate, setFromDate] = useState(dateRange.from.toISOString().split("T")[0])
  const [toDate, setToDate] = useState(dateRange.to.toISOString().split("T")[0])

  const handleApply = () => {
    onDateRangeChange({
      from: new Date(fromDate),
      to: new Date(toDate),
    })
  }

  const setPreset = (days: number) => {
    const to = new Date()
    const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    setFromDate(from.toISOString().split("T")[0])
    setToDate(to.toISOString().split("T")[0])
    onDateRangeChange({ from, to })
  }

  return (
    <div className="space-y-4">
      {label && <Label className="text-sm font-medium">{label}</Label>}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="from-date" className="text-xs text-muted-foreground">
            С
          </Label>
          <Input
            id="from-date"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="to-date" className="text-xs text-muted-foreground">
            По
          </Label>
          <Input id="to-date" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="mt-1" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => setPreset(7)}>
          7 дней
        </Button>
        <Button variant="outline" size="sm" onClick={() => setPreset(30)}>
          30 дней
        </Button>
        <Button variant="outline" size="sm" onClick={() => setPreset(90)}>
          90 дней
        </Button>
      </div>

      <Button onClick={handleApply} size="sm" className="w-full">
        <CalendarDays className="h-4 w-4 mr-2" />
        Применить
      </Button>
    </div>
  )
}

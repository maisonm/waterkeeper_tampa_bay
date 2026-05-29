import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFilter } from "../../../context/FilterContext"
import {
  clampDate,
  maxEndDate,
  minStartDate,
  presetDates,
  PRESETS,
} from "./utils"

export default function DateRangeFilter() {
  const { dateRangeFilter } = useFilter()
  const { startDate, endDate, setStartDate, setEndDate } = dateRangeFilter
  const [activePreset, setActivePreset] = useState<string | undefined>(undefined)

  const handleStartChange = (date: string) => {
    setActivePreset(undefined)
    if (!date) {
      setStartDate(undefined)
      return
    }
    setStartDate(date)
    if (endDate) {
      const clamped = clampDate(endDate, date, maxEndDate(date))
      if (clamped !== endDate) setEndDate(clamped)
    }
  }

  const handleEndChange = (date: string) => {
    setActivePreset(undefined)
    if (!date) {
      setEndDate(undefined)
      return
    }
    setEndDate(date)
    if (startDate) {
      const clamped = clampDate(startDate, minStartDate(date), date)
      if (clamped !== startDate) setStartDate(clamped)
    }
  }

  const handlePreset = (value: string) => {
    if (value === "clear") {
      setActivePreset(undefined)
      setStartDate(undefined)
      setEndDate(undefined)
      return
    }
    const preset = PRESETS.find((p) => p.value === value)
    if (!preset) return
    const { startDate: s, endDate: e } = presetDates(preset.days)
    setActivePreset(value)
    setStartDate(s)
    setEndDate(e)
  }

  return (
    <>
      <Select value={activePreset ?? ""} onValueChange={handlePreset}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Date presets" />
        </SelectTrigger>
        <SelectContent>
          {PRESETS.map((p) => (
            <SelectItem key={p.value} value={p.value}>
              {p.label}
            </SelectItem>
          ))}
          <SelectItem value="clear" className="text-muted-foreground">
            Clear
          </SelectItem>
        </SelectContent>
      </Select>

      <span className="text-sm text-muted-foreground">From</span>
      <input
        type="date"
        value={startDate ?? ""}
        min={endDate ? minStartDate(endDate) : undefined}
        max={endDate ?? undefined}
        onChange={(e) => handleStartChange(e.target.value)}
        className="rounded border border-border bg-background px-2 py-1 text-sm text-foreground"
      />

      <span className="text-sm text-muted-foreground">to</span>
      <input
        type="date"
        value={endDate ?? ""}
        min={startDate ?? undefined}
        max={startDate ? maxEndDate(startDate) : undefined}
        onChange={(e) => handleEndChange(e.target.value)}
        className="rounded border border-border bg-background px-2 py-1 text-sm text-foreground"
      />
    </>
  )
}

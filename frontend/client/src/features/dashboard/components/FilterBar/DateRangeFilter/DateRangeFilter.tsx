import { useLayoutEffect, useMemo, useRef } from "react"
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
  DEFAULT_PRESET_DAYS,
  findMatchingPresetValue,
  presetDates,
  PRESETS,
} from "./utils"

const DateRangeFilter = () => {
  const { dateRangeFilter } = useFilter()
  const { startDate, endDate, setStartDate, setEndDate } = dateRangeFilter
  const hasAppliedDefault = useRef(false)

  const activePreset = useMemo(
    () => findMatchingPresetValue(startDate, endDate),
    [startDate, endDate],
  )

  useLayoutEffect(() => {
    if (hasAppliedDefault.current) return
    hasAppliedDefault.current = true

    const { startDate: defaultStart, endDate: defaultEnd } = presetDates(DEFAULT_PRESET_DAYS)
    setStartDate(defaultStart)
    setEndDate(defaultEnd)
  }, [setStartDate, setEndDate])

  const handleStartChange = (date: string) => {
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
      setStartDate(undefined)
      setEndDate(undefined)
      return
    }
    const preset = PRESETS.find((entry) => entry.value === value)
    if (!preset) return
    const { startDate: presetStart, endDate: presetEnd } = presetDates(preset.days)
    setStartDate(presetStart)
    setEndDate(presetEnd)
  }

  return (
    <>
      <Select value={activePreset ?? ""} onValueChange={handlePreset}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Date presets" />
        </SelectTrigger>
        <SelectContent position="popper" className="z-[1000]">
          {PRESETS.map((preset) => (
            <SelectItem key={preset.value} value={preset.value}>
              {preset.label}
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
        onChange={(event) => handleStartChange(event.target.value)}
        className="rounded border border-border bg-background px-2 py-1 text-sm text-foreground"
      />

      <span className="text-sm text-muted-foreground">to</span>
      <input
        type="date"
        value={endDate ?? ""}
        min={startDate ?? undefined}
        max={startDate ? maxEndDate(startDate) : undefined}
        onChange={(event) => handleEndChange(event.target.value)}
        className="rounded border border-border bg-background px-2 py-1 text-sm text-foreground"
      />
    </>
  )
}

export default DateRangeFilter

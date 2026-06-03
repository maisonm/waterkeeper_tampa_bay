import { useMemo, useState } from "react"
import dayjs from "dayjs"
import { Calendar } from "lucide-react"
import { Popover } from "radix-ui"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useFilter } from "../../../context/FilterContext"
import { clampDate, maxEndDate, minStartDate } from "./utils"

const formatRangeLabel = (startDate: string, endDate: string): string => {
  const start = dayjs(startDate)
  const end = dayjs(endDate)
  if (start.year() === end.year()) {
    return `${start.format("MMM D")} – ${end.format("MMM D, YYYY")}`
  }
  return `${start.format("MMM D, YYYY")} – ${end.format("MMM D, YYYY")}`
}

const DateRangeFields = () => {
  const { dateRangeFilter } = useFilter()
  const { startDate, endDate, setStartDate, setEndDate } = dateRangeFilter
  const [open, setOpen] = useState(false)

  const rangeLabel = useMemo(() => {
    if (startDate && endDate) return formatRangeLabel(startDate, endDate)
    if (startDate) return `From ${dayjs(startDate).format("MMM D, YYYY")}`
    if (endDate) return `Until ${dayjs(endDate).format("MMM D, YYYY")}`
    return undefined
  }, [startDate, endDate])

  const handleStartChange = (date: string) => {
    if (!date) {
      setStartDate("")
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
      setEndDate("")
      return
    }
    setEndDate(date)
    if (startDate) {
      const clamped = clampDate(startDate, minStartDate(date), date)
      if (clamped !== startDate) setStartDate(clamped)
    }
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          type="button"
          variant="outline"
          aria-expanded={open}
          className={cn(!rangeLabel && "text-muted-foreground")}
        >
          <Calendar data-icon="inline-start" />
          {rangeLabel ?? "Date range"}
        </Button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={6}
          className={cn(
            "z-[1000] rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          )}
        >
          <p className="mb-3 text-xs font-medium text-muted-foreground">Custom date range</p>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex flex-col gap-1 text-xs text-muted-foreground">
              From
              <input
                type="date"
                value={startDate ?? ""}
                min={endDate ? minStartDate(endDate) : undefined}
                max={endDate ?? undefined}
                onChange={(event) => handleStartChange(event.target.value)}
                className="rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground"
              />
            </label>
            <span className="mt-5 text-sm text-muted-foreground">to</span>
            <label className="flex flex-col gap-1 text-xs text-muted-foreground">
              To
              <input
                type="date"
                value={endDate ?? ""}
                min={startDate ?? undefined}
                max={startDate ? maxEndDate(startDate) : undefined}
                onChange={(event) => handleEndChange(event.target.value)}
                className="rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground"
              />
            </label>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

export default DateRangeFields

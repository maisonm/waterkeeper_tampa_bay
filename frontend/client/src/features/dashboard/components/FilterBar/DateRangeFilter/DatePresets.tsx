import { useMemo, useState } from "react"
import { CalendarRange } from "lucide-react"
import { Popover } from "radix-ui"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useFilter } from "../../../context/FilterContext"
import {
  findMatchingPresetValue,
  presetDates,
  PRESETS,
} from "./utils"

const DatePresets = () => {
  const { dateRangeFilter } = useFilter()
  const { startDate, endDate, setStartDate, setEndDate } = dateRangeFilter
  const [open, setOpen] = useState(false)

  const activePreset = useMemo(
    () => findMatchingPresetValue(startDate, endDate),
    [startDate, endDate],
  )

  const activeLabel = PRESETS.find((preset) => preset.value === activePreset)?.label

  const handlePreset = (value: string) => {
    if (value === "clear") {
      setStartDate("")
      setEndDate("")
      return
    }
    const preset = PRESETS.find((entry) => entry.value === value)
    if (!preset) return
    const { startDate: presetStart, endDate: presetEnd } = presetDates(preset.days)
    setStartDate(presetStart)
    setEndDate(presetEnd)
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          type="button"
          variant="outline"
          aria-expanded={open}
          className={cn(!activeLabel && "text-muted-foreground")}
        >
          <CalendarRange data-icon="inline-start" />
          {activeLabel ?? "Presets"}
        </Button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={6}
          className={cn(
            "z-[1000] w-52 rounded-md border border-border bg-popover p-3 text-popover-foreground shadow-md",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          )}
        >
          <p className="mb-2 text-xs font-medium text-muted-foreground">Date presets</p>
          <Select value={activePreset ?? ""} onValueChange={handlePreset}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a preset" />
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
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

export default DatePresets

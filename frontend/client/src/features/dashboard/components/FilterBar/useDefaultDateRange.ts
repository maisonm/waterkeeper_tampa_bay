import { useLayoutEffect, useRef } from "react"
import { useFilter } from "../../context/FilterContext"
import { DEFAULT_PRESET_DAYS, presetDates } from "./DateRangeFilter/utils"

export const useDefaultDateRange = () => {
  const { dateRangeFilter } = useFilter()
  const { setStartDate, setEndDate } = dateRangeFilter
  const hasAppliedDefault = useRef(false)

  useLayoutEffect(() => {
    if (hasAppliedDefault.current) return
    hasAppliedDefault.current = true

    const { startDate: defaultStart, endDate: defaultEnd } = presetDates(DEFAULT_PRESET_DAYS)
    setStartDate(defaultStart)
    setEndDate(defaultEnd)
  }, [setStartDate, setEndDate])
}

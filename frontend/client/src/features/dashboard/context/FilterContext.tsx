import { createContext, useContext, useState } from "react"
import { DEFAULT_DATE_RANGE } from "../components/FilterBar/DateRangeFilter/utils"

type FilterState = {
  dateRangeFilter: DateRangeFilter
}

type DateRangeFilter = {
    startDate: string | undefined
    endDate: string | undefined
    setStartDate: (date: string | undefined) => void
    setEndDate: (date: string | undefined) => void
}

const FilterContext = createContext<FilterState | null>(null)

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [startDate, setStartDate] = useState(
    () => DEFAULT_DATE_RANGE.startDate,
  )
  const [endDate, setEndDate] = useState(() => DEFAULT_DATE_RANGE.endDate)

  const dateRangeFilter: DateRangeFilter = {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
  }

  return (
    <FilterContext.Provider
      value={{
        dateRangeFilter,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export function useFilter(): FilterState {
  const ctx = useContext(FilterContext)
  if (!ctx) throw new Error("useFilter must be used within FilterProvider")
  return ctx
}

import { createContext, useContext, useState } from "react"

type FilterState = {
  startDate: string | undefined
  endDate: string | undefined
  setStartDate: (d: string | undefined) => void
  setEndDate: (d: string | undefined) => void
}

const FilterContext = createContext<FilterState | null>(null)

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [startDate, setStartDate] = useState<string | undefined>(undefined)
  const [endDate, setEndDate] = useState<string | undefined>(undefined)

  return (
    <FilterContext.Provider value={{ startDate, endDate, setStartDate, setEndDate }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilter(): FilterState {
  const ctx = useContext(FilterContext)
  if (!ctx) throw new Error("useFilter must be used within FilterProvider")
  return ctx
}

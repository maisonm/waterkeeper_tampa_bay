import { createContext, useContext, useMemo, useState } from "react"
import type { Dispatch, SetStateAction } from "react"
import { isSiteIncluded } from "../components/FilterBar/SiteFilter/utils"
import { DEFAULT_DATE_RANGE } from "../components/FilterBar/DateRangeFilter/utils"
import { useSitesQuery } from "../hooks/useSitesQuery"

type FilterState = {
  dateRangeFilter: DateRangeFilter
  sitesFilter: SitesFilter
  tableFocus: TableFocus
}

type DateRangeFilter = {
  startDate: string | undefined
  endDate: string | undefined
  setStartDate: (date: string) => void
  setEndDate: (date: string) => void
}

type SitesFilter = {
  /** Empty array means all sites are included. */
  selectedSiteIds: number[]
  setSelectedSiteIds: Dispatch<SetStateAction<number[]>>
}

type TableFocus = {
  focusedSiteId: number | null
  toggleTableFocus: (siteId: number) => void
  clearTableFocus: () => void
}

const FilterContext = createContext<FilterState | null>(null)

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [startDate, setStartDate] = useState(
    () => DEFAULT_DATE_RANGE.startDate,
  )
  const [endDate, setEndDate] = useState(() => DEFAULT_DATE_RANGE.endDate)
  const [selectedSiteIds, setSelectedSiteIds] = useState<number[]>([])
  const [focusedSiteId, setFocusedSiteId] = useState<number | null>(null)
  const { data: sites = [] } = useSitesQuery()

  const allSiteIds = useMemo(() => sites.map((site) => site.id), [sites])

  const activeFocusedSiteId =
    focusedSiteId !== null &&
    isSiteIncluded(focusedSiteId, selectedSiteIds, allSiteIds)
      ? focusedSiteId
      : null

  const dateRangeFilter: DateRangeFilter = {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
  }

  const sitesFilter: SitesFilter = {
    selectedSiteIds,
    setSelectedSiteIds,
  }

  const toggleTableFocus = (siteId: number) => {
    setFocusedSiteId((current) => (current === siteId ? null : siteId))
  }

  const clearTableFocus = () => {
    setFocusedSiteId(null)
  }

  const tableFocus: TableFocus = {
    focusedSiteId: activeFocusedSiteId,
    toggleTableFocus,
    clearTableFocus,
  }

  return (
    <FilterContext.Provider
      value={{
        dateRangeFilter,
        sitesFilter,
        tableFocus,
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

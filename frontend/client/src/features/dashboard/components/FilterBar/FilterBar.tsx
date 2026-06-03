import { useState } from "react"
import { ChevronDown, ChevronUp, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useFilter } from "../../context/FilterContext"
import { useSitesQuery } from "../../hooks/useSitesQuery"
import DatePresets from "./DateRangeFilter/DatePresets"
import DateRangeFields from "./DateRangeFilter/DateRangeFields"
import SiteFilterPanel from "./SiteFilter/SiteFilterPanel"
import { useDefaultDateRange } from "./useDefaultDateRange"

const FilterBar = () => {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const { sitesFilter } = useFilter()
  const { selectedSiteIds } = sitesFilter
  const { data: sites = [] } = useSitesQuery()

  useDefaultDateRange()

  const isFiltered =
    selectedSiteIds.length > 0 && selectedSiteIds.length < sites.length

  return (
    <div className="space-y-3 py-4 mt-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen((current) => !current)}
          className={cn(isFiltered && "border-sky-600/40 text-foreground dark:border-sky-500/40")}
        >
          <Filter data-icon="inline-start" />
          Filters
          {filtersOpen ? (
            <ChevronUp data-icon="inline-end" />
          ) : (
            <ChevronDown data-icon="inline-end" />
          )}
        </Button>

        <div className="flex flex-wrap items-center gap-2">
          <DatePresets />
          <DateRangeFields />
        </div>
      </div>

      {filtersOpen && (
        <div className="rounded-xl border border-border bg-card p-4">
          <SiteFilterPanel />
        </div>
      )}
    </div>
  )
}

export default FilterBar

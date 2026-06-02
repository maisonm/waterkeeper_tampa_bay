import DateRangeFilter from "./DateRangeFilter/DateRangeFilter"
import SiteFilter from "./SiteFilter/SiteFilter"

const FilterBar = () => (
  <div className="relative z-10 flex flex-wrap items-center gap-4 rounded-lg border border-border bg-card p-3">
    <SiteFilter />
    <DateRangeFilter />
  </div>
)

export default FilterBar

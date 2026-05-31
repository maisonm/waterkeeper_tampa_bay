import DateRangeFilter from "./DateRangeFilter/DateRangeFilter"

export default function FilterBar() {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-3">
      <DateRangeFilter />
    </div>
  )
}

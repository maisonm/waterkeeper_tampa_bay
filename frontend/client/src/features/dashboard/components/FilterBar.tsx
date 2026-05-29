import { useFilter } from "../context/FilterContext"

export default function FilterBar() {
  const { startDate, endDate, setStartDate, setEndDate } = useFilter()

  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-3">
      <span className="text-sm font-medium text-muted-foreground">Date range</span>
      <input
        type="date"
        value={startDate ?? ""}
        onChange={(e) => setStartDate(e.target.value || undefined)}
        className="rounded border border-border bg-background px-2 py-1 text-sm text-foreground"
      />
      <span className="text-sm text-muted-foreground">to</span>
      <input
        type="date"
        value={endDate ?? ""}
        onChange={(e) => setEndDate(e.target.value || undefined)}
        className="rounded border border-border bg-background px-2 py-1 text-sm text-foreground"
      />
    </div>
  )
}

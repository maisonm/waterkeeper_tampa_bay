import { useMemo } from "react"
import { AgGridReact } from "ag-grid-react"
import type { ColDef } from "ag-grid-community"
import { themeQuartz } from "ag-grid-community"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/context/ThemeContext"
import { useFilter } from "../../context/FilterContext"
import { useDashboardQuery } from "../../hooks/useDashboardQuery"
import { useSitesQuery } from "../../hooks/useSitesQuery"
import { COLUMN_DEFS } from "./utils"
import type { WaterQualitySample } from "@/api/types"

const DEFAULT_COL_DEF: ColDef<WaterQualitySample> = {
  resizable: true,
}

const SamplesTable = () => {
  const { theme } = useTheme()
  const { tableFocus } = useFilter()
  const { focusedSiteId, clearTableFocus } = tableFocus
  const { data: dashboard, isLoading } = useDashboardQuery()
  const { data: sites = [] } = useSitesQuery()

  const focusedSiteName = useMemo(() => {
    if (focusedSiteId === null) return null
    return sites.find((site) => site.id === focusedSiteId)?.name ?? null
  }, [focusedSiteId, sites])

  const rowData = useMemo(() => {
    const items = dashboard?.sample_sites.items ?? []
    if (focusedSiteId === null) return items
    return items.filter((sample) => sample.site_id === focusedSiteId)
  }, [dashboard?.sample_sites.items, focusedSiteId])

  const gridTheme = themeQuartz.withParams({
    browserColorScheme: theme === "dark" ? "dark" : "light",
  })

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border">
      {focusedSiteId !== null && (
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-3 py-2">
          <p className="truncate text-sm text-muted-foreground">
            Showing:{" "}
            <span className="font-medium text-foreground">
              {focusedSiteName ?? "Selected site"}
            </span>
          </p>
          <Button variant="outline" size="sm" onClick={clearTableFocus}>
            Restore table
          </Button>
        </div>
      )}

      <div className="min-h-0 flex-1 [&_.ag-root-wrapper]:h-full">
        <AgGridReact<WaterQualitySample>
          theme={gridTheme}
          rowData={rowData}
          columnDefs={COLUMN_DEFS}
          defaultColDef={DEFAULT_COL_DEF}
          loading={isLoading}
          rowBuffer={20}
        />
      </div>
    </div>
  )
}

export default SamplesTable

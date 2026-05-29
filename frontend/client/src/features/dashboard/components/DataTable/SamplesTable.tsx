import { AgGridReact } from "ag-grid-react"
import type { ColDef } from "ag-grid-community"
import { themeQuartz } from "ag-grid-community"
import { useQuery } from "@tanstack/react-query"
import { getAllSitesDashboard } from "@/api/dashboard"
import { useFilter } from "../../context/FilterContext"
import { useTheme } from "@/context/ThemeContext"
import { COLUMN_DEFS } from "./utils"
import type { WaterQualitySample } from "@/api/types"

const DEFAULT_COL_DEF: ColDef<WaterQualitySample> = {
  resizable: true,
}

export default function SamplesTable() {
  const { dateRangeFilter } = useFilter()
  const { startDate, endDate } = dateRangeFilter
  const { theme } = useTheme()

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ["dashboard", "sites", startDate, endDate],
    queryFn: () => getAllSitesDashboard({ start_date: startDate, end_date: endDate }),
  })

  const rowData = dashboard?.sample_sites.items ?? []
  const gridTheme = themeQuartz.withParams({
    browserColorScheme: theme === "dark" ? "dark" : "light",
  })

  return (
    <div style={{ height: 360 }}>
      <AgGridReact<WaterQualitySample>
        theme={gridTheme}
        rowData={rowData}
        columnDefs={COLUMN_DEFS}
        defaultColDef={DEFAULT_COL_DEF}
        loading={isLoading}
        rowBuffer={20}
      />
    </div>
  )
}

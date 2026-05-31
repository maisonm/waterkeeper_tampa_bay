import { AgGridReact } from "ag-grid-react"
import type { ColDef } from "ag-grid-community"
import { themeQuartz } from "ag-grid-community"
import { useTheme } from "@/context/ThemeContext"
import { useDashboardQuery } from "../../hooks/useDashboardQuery"
import { COLUMN_DEFS } from "./utils"
import type { WaterQualitySample } from "@/api/types"

const DEFAULT_COL_DEF: ColDef<WaterQualitySample> = {
  resizable: true,
}

const SamplesTable = () => {
  const { theme } = useTheme()
  const { data: dashboard, isLoading } = useDashboardQuery()

  const rowData = dashboard?.sample_sites.items ?? []
  const gridTheme = themeQuartz.withParams({
    browserColorScheme: theme === "dark" ? "dark" : "light",
  })

  return (
    <div className="h-full w-full [&_.ag-root-wrapper]:h-full">
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

export default SamplesTable

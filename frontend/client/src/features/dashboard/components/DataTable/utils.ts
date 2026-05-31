import type { ColDef } from "ag-grid-community"
import dayjs from "dayjs"
import type { WaterQualitySample } from "@/api/types"

export const QUALITY_CODES: Record<string, string> = {
  "good": "Good",
  "moderate": "Moderate",
  "poor": "Poor",
}

export const QUALITY_CODE_COLORS: Record<string, string> = {
  "good": "#8CEC70",
  "moderate": "#FBE95E",
  "poor": "#FD9352",
}

export const COLUMN_DEFS: ColDef<WaterQualitySample>[] = [
  {
    headerName: "Name",
    field: "site_name",
    sortable: true,
    flex: 2,
    minWidth: 150,
  },
  {
    headerName: "Sample Date",
    field: "sample_date",
    sortable: true,
    flex: 1,
    minWidth: 130,
    valueFormatter: (params) =>
      params.value ? dayjs(params.value as string).format("MMM D, YYYY") : "",
  },
  {
    headerName: "Enterococci Per 100ml",
    field: "enterococci_per_100ml",
    sortable: true,
    flex: 1,
    minWidth: 160,
    type: "numericColumn",
  },
  {
    headerName: "Quality",
    field: "quality_code",
    sortable: true,
    flex: 1,
    minWidth: 120,
    valueFormatter: (params) =>
      params.value ? (QUALITY_CODES[params.value as string] ?? params.value) : "",
    cellStyle: (params) => {
      const bg = QUALITY_CODE_COLORS[params.value as string]
      return bg ? { backgroundColor: bg, color: "#1a1a1a" } : null
    },
  },
]

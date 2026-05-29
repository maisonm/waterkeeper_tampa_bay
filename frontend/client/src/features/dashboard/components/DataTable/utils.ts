import type { ColDef } from "ag-grid-community"
import dayjs from "dayjs"
import type { WaterQualitySample } from "@/api/types"

export const QUALITY_CODES = {
  "good": "Good",
  "moderate": "Moderate",
  "poor": "Poor",
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
    headerName: "Quality Code",
    field: "quality_code",
    sortable: true,
    flex: 1,
    minWidth: 120,
    valueFormatter: (params) =>
      params.value ? (QUALITY_CODES[params.value as keyof typeof QUALITY_CODES] ?? params.value) : "",
  },
]

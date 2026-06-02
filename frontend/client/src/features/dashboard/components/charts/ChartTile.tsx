import { AgCharts } from "ag-charts-react"
import { useChartData } from "./hooks/useChartData"
import type { ChartKind } from "./types"

type ChartTileProps = {
  title: string
  chartKind: ChartKind
}

const ChartTile = ({ title, chartKind }: ChartTileProps) => {
  const { options, isLoading, isEmpty } = useChartData(chartKind)

  return (
    <div className="flex h-[500px] flex-col rounded-lg border border-border bg-card">
      <div className="shrink-0 border-b border-border px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </span>
      </div>
      <div className="relative min-h-0 flex-1 p-2">
        {isLoading && (
          <span className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Loading…
          </span>
        )}
        {!isLoading && isEmpty && (
          <span className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No data for selected range
          </span>
        )}
        {!isLoading && !isEmpty && options && (
          <AgCharts options={options} className="h-full w-full" />
        )}
      </div>
    </div>
  )
}

export default ChartTile

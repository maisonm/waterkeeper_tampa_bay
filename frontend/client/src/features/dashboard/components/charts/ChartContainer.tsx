import { SectionErrorBoundary } from "@/components/ErrorBoundary/SectionErrorBoundary"
import ChartTile from "./ChartTile"
import type { ChartKind } from "./types"

const CHART_TILES: { id: string; title: string; chartKind: ChartKind }[] = [
  { id: "enterococci-line", title: "Enterococci by site (line)", chartKind: "enterococci-by-site" },
  { id: "enterococci-bar", title: "Enterococci by site (bar)", chartKind: "enterococci-by-site-bar" },
  { id: "precip", title: "Precipitation", chartKind: "precipitation" },
]

const ChartContainer = () => (
  <div className="grid shrink-0 grid-cols-1 gap-4">
    {CHART_TILES.map((tile) => (
      <SectionErrorBoundary key={tile.id} sectionName={tile.title}>
        <ChartTile title={tile.title} chartKind={tile.chartKind} />
      </SectionErrorBoundary>
    ))}
  </div>
)

export default ChartContainer

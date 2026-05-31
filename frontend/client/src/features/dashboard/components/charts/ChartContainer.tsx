import { SectionErrorBoundary } from "@/components/ErrorBoundary/SectionErrorBoundary"
import ChartTile from "./ChartTile"

const CHART_TILES = [
  { id: "precip", title: "Precipitation" },
  { id: "temp", title: "Temperature" },
  { id: "flow", title: "Stream Flow" },
  { id: "bacteria", title: "Bacteria Levels" },
]

export default function ChartContainer() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {CHART_TILES.map((tile) => (
        <SectionErrorBoundary key={tile.id} sectionName={tile.title}>
          <ChartTile title={tile.title} />
        </SectionErrorBoundary>
      ))}
    </div>
  )
}

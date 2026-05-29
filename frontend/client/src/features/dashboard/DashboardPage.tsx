import { FilterProvider } from "./context/FilterContext"
import FilterBar from "./components/FilterBar/FilterBar"
import MapPanel from "./components/MapPanel"
import SamplesTable from "./components/SamplesTable"
import ChartContainer from "./components/charts/ChartContainer"

export default function DashboardPage() {
  return (
    <FilterProvider>
      <div className="flex h-full flex-col gap-4 p-6">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <div className="grid flex-1 grid-cols-[35%_65%] gap-4">
          {/* Left column — map */}
          <MapPanel />

          {/* Right column — filter + table + charts */}
          <div className="flex flex-col gap-4">
            <FilterBar />
            <SamplesTable />
            <ChartContainer />
          </div>
        </div>
      </div>
    </FilterProvider>
  )
}

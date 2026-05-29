import { SectionErrorBoundary } from "@/components/ErrorBoundary/SectionErrorBoundary"
import { FilterProvider } from "./context/FilterContext"
import FilterBar from "./components/FilterBar/FilterBar"
import MapPanel from "./components/MapPanel"
import SamplesTable from "./components/DataTable/SamplesTable"
import ChartContainer from "./components/charts/ChartContainer"

export default function DashboardPage() {
  return (
    <FilterProvider>
      <div className="flex h-full flex-col gap-4 p-6">
        <h3 className="text-2xl font-semibold text-foreground">Tampa Bay Water Quality Dashboard</h3>
        <div className="grid flex-1 grid-cols-[35%_65%] gap-4">
          <SectionErrorBoundary sectionName="Map" className="min-h-[16rem]">
            <MapPanel />
          </SectionErrorBoundary>

          <div className="flex flex-col gap-4">
            <SectionErrorBoundary sectionName="Filters">
              <FilterBar />
            </SectionErrorBoundary>
            <SectionErrorBoundary sectionName="Samples table">
              <SamplesTable />
            </SectionErrorBoundary>
            <SectionErrorBoundary sectionName="Charts">
              <ChartContainer />
            </SectionErrorBoundary>
          </div>
        </div>
      </div>
    </FilterProvider>
  )
}

import { SectionErrorBoundary } from "@/components/ErrorBoundary/SectionErrorBoundary"
import { FilterProvider } from "./context/FilterContext"
import FilterBar from "./components/FilterBar/FilterBar"
import MapPanel from "./components/MapPanel"
import SamplesTable from "./components/DataTable/SamplesTable"
import ChartContainer from "./components/charts/ChartContainer"

const DashboardPage = () => (
  <FilterProvider>
    <div className="flex h-full min-h-0 flex-col gap-4 p-6">
      <h3 className="shrink-0 text-2xl font-semibold text-foreground">
        Tampa Bay Water Quality Dashboard
      </h3>

      <SectionErrorBoundary sectionName="Filters">
        <FilterBar />
      </SectionErrorBoundary>

      <div className="grid h-[50vh] min-h-[16rem] shrink-0 grid-cols-[1fr_2fr] gap-4">
        <div className="h-full min-h-0">
          <SectionErrorBoundary sectionName="Map" className="h-full">
            <MapPanel />
          </SectionErrorBoundary>
        </div>
        <div className="h-full min-h-0">
          <SectionErrorBoundary sectionName="Samples table" className="h-full">
            <SamplesTable />
          </SectionErrorBoundary>
        </div>
      </div>

      <SectionErrorBoundary sectionName="Charts">
        <ChartContainer />
      </SectionErrorBoundary>
    </div>
  </FilterProvider>
)

export default DashboardPage

import { SectionErrorBoundary } from "@/components/ErrorBoundary/SectionErrorBoundary"
import { FilterProvider } from "./context/FilterContext"
import DashboardHeader from "./components/DashboardHeader/DashboardHeader"
import FilterBar from "./components/FilterBar/FilterBar"
import MapPanel from "./components/MapPanel"
import SamplesTable from "./components/DataTable/SamplesTable"
import ChartContainer from "./components/charts/ChartContainer"

const DashboardPage = () => (
  <FilterProvider>
    <div className="flex h-full min-h-0 flex-col">
      <section className="shrink-0 border-b border-border bg-card px-8 pt-8 pb-2">
        <SectionErrorBoundary sectionName="Summary">
          <DashboardHeader />
        </SectionErrorBoundary>
      </section>

      <section className="shrink-0 border-border px-8">
        <SectionErrorBoundary sectionName="Filters">
          <FilterBar />
        </SectionErrorBoundary>
      </section>

      <div className="flex min-h-0 flex-1 flex-col gap-4 p-8">
        <div className="grid shrink-0 grid-cols-1 gap-4 lg:h-[50vh] lg:min-h-[16rem] lg:grid-cols-[1fr_2fr]">
          <div className="h-[40vh] min-h-[16rem] lg:h-full lg:min-h-0">
            <SectionErrorBoundary sectionName="Map" className="h-full">
              <MapPanel />
            </SectionErrorBoundary>
          </div>
          <div className="h-[50vh] min-h-[16rem] lg:h-full lg:min-h-0">
            <SectionErrorBoundary sectionName="Samples table" className="h-full">
              <SamplesTable />
            </SectionErrorBoundary>
          </div>
        </div>

        <SectionErrorBoundary sectionName="Charts">
          <ChartContainer />
        </SectionErrorBoundary>
      </div>
    </div>
  </FilterProvider>
)

export default DashboardPage

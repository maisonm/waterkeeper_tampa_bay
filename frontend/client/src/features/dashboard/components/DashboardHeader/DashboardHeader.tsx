import SummaryKpiStrip from "../SummaryKpiStrip/SummaryKpiStrip"

const DashboardHeader = () => (
  <header className="space-y-4">
    <div className="space-y-1">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Tampa Bay <span className="text-sky-600 dark:text-sky-400">Water Quality</span> Dashboard
      </h1>
      <p className="text-sm text-muted-foreground">
        Water quality data via data collected by Tampa Bay Waterkeeper
      </p>
    </div>
    <SummaryKpiStrip />
  </header>
)

export default DashboardHeader

import { useQuery } from "@tanstack/react-query"
import { getAllSitesDashboard } from "@/api/dashboard"
import { useFilter } from "../context/FilterContext"

export const useDashboardQuery = () => {
  const { dateRangeFilter } = useFilter()
  const { startDate, endDate } = dateRangeFilter

  return useQuery({
    queryKey: ["dashboard", "sites", startDate, endDate],
    queryFn: () => getAllSitesDashboard({ start_date: startDate, end_date: endDate }),
    throwOnError: true,
  })
}

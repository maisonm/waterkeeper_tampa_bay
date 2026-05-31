import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { getAllSitesDashboard } from "@/api/dashboard"
import { useFilter } from "../context/FilterContext"
import { filterDashboardBySites } from "../utils/filterDashboardBySites"

export const useDashboardQuery = () => {
  const { dateRangeFilter, sitesFilter } = useFilter()
  const { startDate, endDate } = dateRangeFilter
  const { selectedSiteIds } = sitesFilter

  const query = useQuery({
    queryKey: ["dashboard", "sites", startDate, endDate],
    queryFn: () => getAllSitesDashboard({ start_date: startDate, end_date: endDate }),
    throwOnError: true,
  })

  const data = useMemo(() => {
    if (!query.data) return undefined
    return filterDashboardBySites(query.data, selectedSiteIds)
  }, [query.data, selectedSiteIds])

  return { ...query, data }
}

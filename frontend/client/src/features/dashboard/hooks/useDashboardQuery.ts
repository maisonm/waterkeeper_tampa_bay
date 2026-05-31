import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { getAllSitesDashboard } from "@/api/dashboard"
import type { DashboardResponse } from "@/api/types"
import { useFilter } from "../context/FilterContext"

const filterDashboardBySites = (
  dashboard: DashboardResponse,
  selectedSiteIds: number[],
): DashboardResponse => {
  if (selectedSiteIds.length === 0) {
    return dashboard
  }

  const selectedSet = new Set(selectedSiteIds)
  const items = dashboard.sample_sites.items.filter((sample) =>
    selectedSet.has(sample.site_id),
  )

  return {
    ...dashboard,
    sample_sites: {
      items,
      total: items.length,
    },
  }
}

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

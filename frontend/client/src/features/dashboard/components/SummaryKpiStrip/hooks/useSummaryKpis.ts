import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { getAllSitesDashboard } from "@/api/dashboard"
import { getLast30DaysDateRange, getMonthKey, computeSummaryKpis } from "../utils"

export const useSummaryKpis = () => {
  const monthKey = getMonthKey()

  const query = useQuery({
    queryKey: ["dashboard", "summary-kpis", monthKey],
    queryFn: () => {
      const { startDate, endDate } = getLast30DaysDateRange()
      return getAllSitesDashboard({ start_date: startDate, end_date: endDate })
    },
    staleTime: Number.POSITIVE_INFINITY,
    throwOnError: true,
  })

  const kpis = useMemo(() => {
    if (!query.data) return undefined
    return computeSummaryKpis(query.data.sample_sites.items)
  }, [query.data])

  return {
    kpis,
    isLoading: query.isLoading,
  }
}

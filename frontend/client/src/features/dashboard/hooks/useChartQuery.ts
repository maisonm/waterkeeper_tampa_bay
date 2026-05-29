import { useQuery } from "@tanstack/react-query"
import type { QueryKey } from "@tanstack/react-query"
import { useFilter } from "../context/FilterContext"

type Filters = { startDate?: string; endDate?: string }

export function useChartQuery<TData>(
  queryKey: QueryKey,
  fetcher: (filters: Filters) => Promise<TData>,
) {
  const { dateRangeFilter } = useFilter()
  const { startDate, endDate } = dateRangeFilter

  return useQuery({
    queryKey: [...(queryKey as unknown[]), startDate, endDate],
    queryFn: () => fetcher({ startDate, endDate }),
    throwOnError: true,
  })
}

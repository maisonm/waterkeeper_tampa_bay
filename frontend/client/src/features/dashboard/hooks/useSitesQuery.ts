import { useQuery } from "@tanstack/react-query"
import { getSites } from "@/api/sites"

export const useSitesQuery = () =>
  useQuery({
    queryKey: ["sites"],
    queryFn: getSites,
    throwOnError: true,
  })

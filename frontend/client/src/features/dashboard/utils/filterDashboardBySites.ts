import type { DashboardResponse } from "@/api/types"

export const filterDashboardBySites = (
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

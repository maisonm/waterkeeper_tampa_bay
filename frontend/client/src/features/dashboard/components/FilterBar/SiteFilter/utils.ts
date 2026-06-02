import type { Site } from "@/api/types"

export const getSiteFilterLabel = (
  selectedSiteIds: number[],
  sites: Site[],
): string => {
  if (selectedSiteIds.length === 0 || selectedSiteIds.length === sites.length) {
    return "All sites"
  }

  if (selectedSiteIds.length === 1) {
    const site = sites.find((entry) => entry.id === selectedSiteIds[0])
    return site?.name ?? "1 site"
  }

  return `${selectedSiteIds.length} sites`
}

export const isSiteIncluded = (
  siteId: number,
  selectedSiteIds: number[],
  allSiteIds: number[],
): boolean => {
  if (selectedSiteIds.length === 0 || selectedSiteIds.length === allSiteIds.length) {
    return true
  }

  return selectedSiteIds.includes(siteId)
}

export const toggleSiteSelection = (
  siteId: number,
  selectedSiteIds: number[],
  allSiteIds: number[],
): number[] => {
  if (selectedSiteIds.length === 0) {
    return allSiteIds.filter((id) => id !== siteId)
  }

  if (selectedSiteIds.includes(siteId)) {
    return selectedSiteIds.filter((id) => id !== siteId)
  }

  const next = [...selectedSiteIds, siteId]
  if (next.length === allSiteIds.length) {
    return []
  }

  return next
}

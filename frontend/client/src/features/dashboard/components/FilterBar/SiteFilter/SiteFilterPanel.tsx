import { useMemo } from "react"
import { Checkbox } from "radix-ui"
import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useFilter } from "../../../context/FilterContext"
import { useSitesQuery } from "../../../hooks/useSitesQuery"
import {
  getSiteFilterLabel,
  isSiteIncluded,
  toggleSiteSelection,
} from "./utils"

const SiteFilterPanel = () => {
  const { sitesFilter } = useFilter()
  const { selectedSiteIds, setSelectedSiteIds } = sitesFilter
  const { data: sites = [], isLoading } = useSitesQuery()

  const allSiteIds = useMemo(() => sites.map((site) => site.id), [sites])

  const label = useMemo(
    () => getSiteFilterLabel(selectedSiteIds, sites),
    [selectedSiteIds, sites],
  )

  const handleToggle = (siteId: number) => {
    setSelectedSiteIds((current) =>
      toggleSiteSelection(siteId, current, allSiteIds),
    )
  }

  const handleSelectAll = () => {
    setSelectedSiteIds([])
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading sites…</p>
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-foreground">Sites</p>
          <span className="rounded-full bg-sky-600 px-2.5 py-0.5 text-xs font-medium text-white dark:bg-sky-500">
              {label}
            </span>
        </div>
        {
          selectedSiteIds.length !== 0 && (
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-xs font-medium text-sky-600 hover:underline dark:text-sky-400"
            >
              Select all
            </button>
          )
        }
      </div>

      <div className="grid max-h-48 gap-1 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sites.map((site) => {
          const checked = isSiteIncluded(site.id, selectedSiteIds, allSiteIds)

          return (
            <label
              key={site.id}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-md border border-transparent px-2 py-1.5 text-sm",
                "hover:border-border hover:bg-muted/50",
              )}
            >
              <Checkbox.Root
                checked={checked}
                onCheckedChange={() => handleToggle(site.id)}
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center rounded-sm border border-input",
                  "data-[state=checked]:border-sky-600 data-[state=checked]:bg-sky-600 data-[state=checked]:text-white",
                  "dark:data-[state=checked]:border-sky-500 dark:data-[state=checked]:bg-sky-500",
                )}
              >
                <Checkbox.Indicator>
                  <CheckIcon className="size-3" />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <span className="truncate">{site.name}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

export default SiteFilterPanel

import { useMemo, useState } from "react"
import { Checkbox, Popover } from "radix-ui"
import { ChevronDownIcon, CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useFilter } from "../../../context/FilterContext"
import { useSitesQuery } from "../../../hooks/useSitesQuery"
import {
  getSiteFilterLabel,
  isSiteIncluded,
  toggleSiteSelection,
} from "./utils"

const SiteFilter = () => {
  const { sitesFilter } = useFilter()
  const { selectedSiteIds, setSelectedSiteIds } = sitesFilter
  const { data: sites = [], isLoading } = useSitesQuery()
  const [open, setOpen] = useState(false)

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

  const isFiltered =
    selectedSiteIds.length > 0 && selectedSiteIds.length < allSiteIds.length

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          disabled={isLoading}
          aria-expanded={open}
          className={cn(
            "flex h-9 w-48 items-center justify-between gap-1.5 rounded-md border border-input bg-transparent px-2.5 text-sm shadow-xs transition-[color,box-shadow] outline-none",
            "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "dark:bg-input/30 dark:hover:bg-input/50",
            isFiltered ? "text-foreground" : "text-muted-foreground",
          )}
        >
          <span className="truncate">{isLoading ? "Loading sites…" : label}</span>
          <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={4}
          className={cn(
            "z-[1000] w-64 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          )}
        >
          <div className="flex items-center justify-between border-b border-border px-2 py-1.5">
            <span className="text-xs font-medium text-muted-foreground">Sites</span>
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-xs text-primary hover:underline"
            >
              Select all
            </button>
          </div>

          <div className="max-h-60 overflow-y-auto p-1">
            {sites.map((site) => {
              const checked = isSiteIncluded(site.id, selectedSiteIds, allSiteIds)

              return (
                <label
                  key={site.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm",
                    "hover:bg-foreground/10",
                  )}
                >
                  <Checkbox.Root
                    checked={checked}
                    onCheckedChange={() => handleToggle(site.id)}
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded-sm border border-input",
                      "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
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
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

export default SiteFilter

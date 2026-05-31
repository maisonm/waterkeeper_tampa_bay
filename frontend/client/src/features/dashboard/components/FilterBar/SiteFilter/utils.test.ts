import { describe, expect, it } from "vitest"
import {
  getSiteFilterLabel,
  isSiteIncluded,
  toggleSiteSelection,
} from "./utils"
import { makeSite } from "@/test/fixtures"

const sites = [
  makeSite({ id: 1, name: "Alpha" }),
  makeSite({ id: 2, name: "Beta" }),
  makeSite({ id: 3, name: "Gamma" }),
]

const allSiteIds = sites.map((site) => site.id)

describe("getSiteFilterLabel", () => {
  it('returns "All sites" when nothing is selected', () => {
    expect(getSiteFilterLabel([], sites)).toBe("All sites")
  })

  it('returns "All sites" when every site is selected', () => {
    expect(getSiteFilterLabel(allSiteIds, sites)).toBe("All sites")
  })

  it("returns the site name for a single selection", () => {
    expect(getSiteFilterLabel([2], sites)).toBe("Beta")
  })

  it("returns a count for multiple selections", () => {
    expect(getSiteFilterLabel([1, 3], sites)).toBe("2 sites")
  })
})

describe("isSiteIncluded", () => {
  it("includes every site when selection is empty", () => {
    expect(isSiteIncluded(2, [], allSiteIds)).toBe(true)
  })

  it("includes every site when all sites are selected", () => {
    expect(isSiteIncluded(2, allSiteIds, allSiteIds)).toBe(true)
  })

  it("includes only selected sites for partial selection", () => {
    expect(isSiteIncluded(1, [1, 3], allSiteIds)).toBe(true)
    expect(isSiteIncluded(2, [1, 3], allSiteIds)).toBe(false)
  })
})

describe("toggleSiteSelection", () => {
  it("excludes a site when starting from all sites", () => {
    expect(toggleSiteSelection(2, [], allSiteIds)).toEqual([1, 3])
  })

  it("removes a site from a partial selection", () => {
    expect(toggleSiteSelection(2, [1, 2], allSiteIds)).toEqual([1])
  })

  it("adds a site to a partial selection", () => {
    expect(toggleSiteSelection(3, [1], allSiteIds)).toEqual([1, 3])
  })

  it("returns empty array when the last unselected site is added", () => {
    expect(toggleSiteSelection(3, [1, 2], allSiteIds)).toEqual([])
  })
})

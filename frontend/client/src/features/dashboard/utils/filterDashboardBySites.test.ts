import { describe, expect, it } from "vitest"
import { filterDashboardBySites } from "./filterDashboardBySites"
import { makeSample, makeWeatherRecord } from "@/test/fixtures"

describe("filterDashboardBySites", () => {
  const dashboard = {
    sample_sites: {
      items: [
        makeSample({ id: 1, site_id: 1 }),
        makeSample({ id: 2, site_id: 2, site_name: "Site B" }),
        makeSample({ id: 3, site_id: 3, site_name: "Site C" }),
      ],
      total: 3,
    },
    weather_records: [makeWeatherRecord()],
  }

  it("returns the dashboard unchanged when no sites are selected", () => {
    expect(filterDashboardBySites(dashboard, [])).toEqual(dashboard)
  })

  it("filters samples to the selected site ids", () => {
    const filtered = filterDashboardBySites(dashboard, [1, 3])

    expect(filtered.sample_sites.items).toEqual([
      makeSample({ id: 1, site_id: 1 }),
      makeSample({ id: 3, site_id: 3, site_name: "Site C" }),
    ])
    expect(filtered.sample_sites.total).toBe(2)
    expect(filtered.weather_records).toEqual(dashboard.weather_records)
  })
})

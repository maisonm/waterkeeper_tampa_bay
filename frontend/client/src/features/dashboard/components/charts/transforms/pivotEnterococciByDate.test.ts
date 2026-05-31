import { describe, expect, it } from "vitest"
import { pivotEnterococciByDate } from "./pivotEnterococciByDate"
import { makeSample } from "@/test/fixtures"

describe("pivotEnterococciByDate", () => {
  it("returns empty data for no samples", () => {
    expect(pivotEnterococciByDate([])).toEqual({ data: [], siteNames: [] })
  })

  it("pivots samples by date with site names ordered by site id", () => {
    const samples = [
      makeSample({
        id: 1,
        site_id: 2,
        site_name: "Beta",
        sample_date: "2024-02-01",
        enterococci_per_100ml: 20,
      }),
      makeSample({
        id: 2,
        site_id: 1,
        site_name: "Alpha",
        sample_date: "2024-01-01",
        enterococci_per_100ml: 10,
      }),
      makeSample({
        id: 3,
        site_id: 1,
        site_name: "Alpha",
        sample_date: "2024-02-01",
        enterococci_per_100ml: 15,
      }),
    ]

    const pivot = pivotEnterococciByDate(samples)

    expect(pivot.siteNames).toEqual(["Alpha", "Beta"])
    expect(pivot.data).toEqual([
      { date: "2024-01-01", Alpha: 10 },
      { date: "2024-02-01", Alpha: 15, Beta: 20 },
    ])
  })
})

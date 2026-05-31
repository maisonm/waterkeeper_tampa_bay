import { describe, expect, it } from "vitest"
import { computeSummaryKpis } from "./summaryKpis"
import { makeSample } from "@/test/fixtures"

describe("computeSummaryKpis", () => {
  it("returns zeroed metrics for empty input", () => {
    expect(computeSummaryKpis([])).toEqual({
      sitesSampled: 0,
      goodPercent: 0,
      moderatePercent: 0,
      poorPercent: 0,
      mostRecentSampleDate: null,
      sitesPoorOnLastSample: 0,
      sampledSiteNames: [],
      sitesByQuality: { good: [], moderate: [], poor: [] },
      poorSiteNames: [],
    })
  })

  it("uses the latest sample per site for quality breakdown", () => {
    const samples = [
      makeSample({
        id: 1,
        site_id: 1,
        site_name: "Alpha",
        sample_date: "2024-01-01",
        quality_code: "good",
      }),
      makeSample({
        id: 2,
        site_id: 1,
        site_name: "Alpha",
        sample_date: "2024-02-01",
        quality_code: "poor",
      }),
      makeSample({
        id: 3,
        site_id: 2,
        site_name: "Beta",
        sample_date: "2024-01-15",
        quality_code: "moderate",
      }),
    ]

    const kpis = computeSummaryKpis(samples)

    expect(kpis.sitesSampled).toBe(2)
    expect(kpis.goodPercent).toBe(0)
    expect(kpis.moderatePercent).toBe(50)
    expect(kpis.poorPercent).toBe(50)
    expect(kpis.sitesPoorOnLastSample).toBe(1)
    expect(kpis.sampledSiteNames).toEqual(["Alpha", "Beta"])
    expect(kpis.sitesByQuality.poor).toEqual(["Alpha"])
    expect(kpis.poorSiteNames).toEqual(["Alpha"])
  })

  it("breaks ties on the same date using the higher sample id", () => {
    const samples = [
      makeSample({
        id: 1,
        site_id: 1,
        sample_date: "2024-03-01",
        quality_code: "good",
      }),
      makeSample({
        id: 2,
        site_id: 1,
        sample_date: "2024-03-01",
        quality_code: "poor",
      }),
    ]

    const kpis = computeSummaryKpis(samples)

    expect(kpis.sitesPoorOnLastSample).toBe(1)
    expect(kpis.poorSiteNames).toEqual(["Site A"])
  })

  it("tracks the most recent sample date across all samples", () => {
    const samples = [
      makeSample({ id: 1, site_id: 1, sample_date: "2024-01-01" }),
      makeSample({ id: 2, site_id: 2, site_name: "Site B", sample_date: "2024-03-01" }),
    ]

    expect(computeSummaryKpis(samples).mostRecentSampleDate).toBe("2024-03-01")
  })
})

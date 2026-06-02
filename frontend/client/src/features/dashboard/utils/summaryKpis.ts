import type { WaterQualitySample } from "@/api/types"

export type QualityBucket = "good" | "moderate" | "poor"

const QUALITY_BUCKETS: QualityBucket[] = ["good", "moderate", "poor"]

const sortSiteNames = (names: string[]): string[] =>
  [...names].sort((left, right) => left.localeCompare(right))

export type SummaryKpis = {
  sitesSampled: number
  goodPercent: number
  moderatePercent: number
  poorPercent: number
  mostRecentSampleDate: string | null
  sitesPoorOnLastSample: number
  sampledSiteNames: string[]
  sitesByQuality: Record<QualityBucket, string[]>
  poorSiteNames: string[]
}

const pickLatestSample = (
  current: WaterQualitySample | undefined,
  candidate: WaterQualitySample,
): WaterQualitySample => {
  if (!current) return candidate
  if (candidate.sample_date > current.sample_date) return candidate
  if (candidate.sample_date < current.sample_date) return current
  return candidate.id > current.id ? candidate : current
}

export const computeSummaryKpis = (samples: WaterQualitySample[]): SummaryKpis => {
  const latestBySite = new Map<number, WaterQualitySample>()

  for (const sample of samples) {
    latestBySite.set(
      sample.site_id,
      pickLatestSample(latestBySite.get(sample.site_id), sample),
    )
  }

  const latestSamples = [...latestBySite.values()]
  const sitesSampled = latestSamples.length
  const sampledSiteNames = sortSiteNames(latestSamples.map((sample) => sample.site_name))

  const sitesByQuality: Record<QualityBucket, string[]> = {
    good: [],
    moderate: [],
    poor: [],
  }

  let goodCount = 0
  let moderateCount = 0
  let poorCount = 0

  for (const sample of latestSamples) {
    if (QUALITY_BUCKETS.includes(sample.quality_code as QualityBucket)) {
      const bucket = sample.quality_code as QualityBucket
      sitesByQuality[bucket].push(sample.site_name)
    }

    switch (sample.quality_code) {
      case "good":
        goodCount++
        break
      case "moderate":
        moderateCount++
        break
      case "poor":
        poorCount++
        break
    }
  }

  for (const bucket of QUALITY_BUCKETS) {
    sitesByQuality[bucket] = sortSiteNames(sitesByQuality[bucket])
  }

  const toPercent = (count: number) =>
    sitesSampled === 0 ? 0 : Math.round((count / sitesSampled) * 100)

  const mostRecentSampleDate =
    samples.length === 0
      ? null
      : samples.reduce(
          (latest, sample) => (sample.sample_date > latest ? sample.sample_date : latest),
          samples[0].sample_date,
        )

  return {
    sitesSampled,
    goodPercent: toPercent(goodCount),
    moderatePercent: toPercent(moderateCount),
    poorPercent: toPercent(poorCount),
    mostRecentSampleDate,
    sitesPoorOnLastSample: poorCount,
    sampledSiteNames,
    sitesByQuality,
    poorSiteNames: sitesByQuality.poor,
  }
}

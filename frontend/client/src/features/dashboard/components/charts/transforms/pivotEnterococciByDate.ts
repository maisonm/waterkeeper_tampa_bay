import type { WaterQualitySample } from "@/api/types"

export type EnterococciPivotRow = {
  date: string
  [siteName: string]: string | number | undefined
}

export type EnterococciPivot = {
  data: EnterococciPivotRow[]
  siteNames: string[]
}

export const pivotEnterococciByDate = (samples: WaterQualitySample[]): EnterococciPivot => {
  if (samples.length === 0) {
    return { data: [], siteNames: [] }
  }

  const siteById = new Map<number, string>()
  for (const sample of samples) {
    siteById.set(sample.site_id, sample.site_name)
  }

  const siteNames = [...siteById.entries()]
    .sort(([leftId], [rightId]) => leftId - rightId)
    .map(([, name]) => name)

  const byDate = new Map<string, EnterococciPivotRow>()

  for (const sample of samples) {
    let row = byDate.get(sample.sample_date)
    if (!row) {
      row = { date: sample.sample_date }
      byDate.set(sample.sample_date, row)
    }
    row[sample.site_name] = sample.enterococci_per_100ml
  }

  const data = [...byDate.values()].sort((left, right) => left.date.localeCompare(right.date))

  return { data, siteNames }
}

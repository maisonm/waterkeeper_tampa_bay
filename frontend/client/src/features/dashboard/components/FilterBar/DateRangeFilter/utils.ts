import dayjs from "dayjs"

export const MAX_DAYS = 364

export const toInputValue = (d: dayjs.Dayjs): string => d.format("YYYY-MM-DD")

export const clampDate = (
  date: string,
  lo: string | undefined,
  hi: string | undefined,
): string => {
  let parsed = dayjs(date)
  if (lo && parsed.isBefore(dayjs(lo))) parsed = dayjs(lo)
  if (hi && parsed.isAfter(dayjs(hi))) parsed = dayjs(hi)
  return toInputValue(parsed)
}

export const maxEndDate = (startDate: string): string =>
  toInputValue(dayjs(startDate).add(MAX_DAYS, "day"))

export const minStartDate = (endDate: string): string =>
  toInputValue(dayjs(endDate).subtract(MAX_DAYS, "day"))

export type Preset = {
  label: string
  value: string
  days: number
}

export const PRESETS: Preset[] = [
  { label: "Last 30 days", value: "30d", days: 30 },
  { label: "Last 60 days", value: "60d", days: 60 },
  { label: "Last 90 days", value: "90d", days: 90 },
  { label: "Last 6 months", value: "6m", days: 180 },
  { label: "Last 12 months", value: "12m", days: 365 },
]

export const presetDates = (days: number): { startDate: string; endDate: string } => {
  const end = dayjs()
  const start = end.subtract(days - 1, "day")
  return { startDate: toInputValue(start), endDate: toInputValue(end) }
}

import type { AgTooltipRendererResult } from "ag-charts-community"
import dayjs from "dayjs"
import type { EnterococciPivotRow } from "./pivotEnterococciByDate"

type EnterococciTooltipParams = {
  datum: EnterococciPivotRow
  xKey: string
  yKey: string
  title?: string
}

const formatSampleDate = (date: string): string => dayjs(date).format("MMM D, YYYY")

const formatEnterococciValue = (value: unknown): string => {
  if (value === undefined || value === null) return "—"
  return Number(value).toLocaleString()
}

export const renderEnterococciTooltip = (
  params: EnterococciTooltipParams,
): AgTooltipRendererResult => {
  const siteName = params.title ?? params.yKey
  const value = params.datum[params.yKey]
  const date = String(params.datum[params.xKey as keyof EnterococciPivotRow])

  return {
    title: `${siteName} - ${formatEnterococciValue(value)}`,
    data: [{ label: "Date", value: formatSampleDate(date) }],
  }
}

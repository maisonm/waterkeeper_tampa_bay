import type { AgBarSeriesOptions, AgLineSeriesOptions } from "ag-charts-community"
import type { EnterococciPivot } from "./pivotEnterococciByDate"
import { renderEnterococciTooltip } from "./enterococciTooltip"

const enterococciSeriesBase = (siteName: string) => ({
  xKey: "date" as const,
  yKey: siteName,
  title: siteName,
  tooltip: { renderer: renderEnterococciTooltip },
})

export const buildEnterococciBarSeries = (
  pivot: EnterococciPivot,
): AgBarSeriesOptions[] =>
  pivot.siteNames.map((siteName) => ({
    type: "bar",
    ...enterococciSeriesBase(siteName),
  }))

export const buildEnterococciLineSeries = (
  pivot: EnterococciPivot,
): AgLineSeriesOptions[] =>
  pivot.siteNames.map((siteName) => ({
    type: "line",
    ...enterococciSeriesBase(siteName),
  }))

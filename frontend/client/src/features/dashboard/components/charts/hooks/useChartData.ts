import { useMemo } from "react"
import type { AgCartesianChartOptions } from "ag-charts-community"
import { useTheme } from "@/context/ThemeContext"
import { useDashboardQuery } from "../../../hooks/useDashboardQuery"
import type { ChartKind } from "../types"
import { buildEnterococciBarOptions } from "../transforms/enterococciBar"
import { buildEnterococciLineOptions } from "../transforms/enterococciLine"
import { pivotEnterococciByDate } from "../transforms/pivotEnterococciByDate"
import { buildEnterococciPrecipBarAndLineOptions } from "../transforms/enterococciPrecipBarAndLine"
import { buildPrecipitationBarOptions } from "../transforms/precipitationBar"

const isChartEmpty = (chartKind: ChartKind, dashboard: NonNullable<ReturnType<typeof useDashboardQuery>["data"]>) => {
  const samples = dashboard.sample_sites.items

  switch (chartKind) {
    case "enterococci-by-site":
    case "enterococci-by-site-bar":
      return samples.length === 0
    case "enterococci-precip-bar-line":
      return samples.length === 0 && dashboard.weather_records.length === 0
    case "precipitation":
      return dashboard.weather_records.length === 0
  }
}

const buildOptions = (
  chartKind: ChartKind,
  dashboard: NonNullable<ReturnType<typeof useDashboardQuery>["data"]>,
  theme: "light" | "dark",
): AgCartesianChartOptions => {
  const samples = dashboard.sample_sites.items

  switch (chartKind) {
    case "enterococci-by-site": {
      const pivot = pivotEnterococciByDate(samples)
      return buildEnterococciLineOptions(pivot, theme)
    }
    case "enterococci-by-site-bar": {
      const pivot = pivotEnterococciByDate(samples)
      return buildEnterococciBarOptions(pivot, theme)
    }
    case "enterococci-precip-bar-line": {
      const pivot = pivotEnterococciByDate(samples)
      return buildEnterococciPrecipBarAndLineOptions(pivot, dashboard.weather_records, theme)
    }
    case "precipitation":
      return buildPrecipitationBarOptions(dashboard.weather_records, theme)
  }
}

export const useChartData = (chartKind: ChartKind) => {
  const { theme } = useTheme()
  const { data: dashboard, isLoading } = useDashboardQuery()

  const options = useMemo(() => {
    if (!dashboard) return null
    return buildOptions(chartKind, dashboard, theme)
  }, [chartKind, dashboard, theme])

  const isEmpty = useMemo(() => {
    if (!dashboard) return false
    return isChartEmpty(chartKind, dashboard)
  }, [chartKind, dashboard])

  return { options, isLoading, isEmpty }
}

import type { AgCartesianChartOptions } from "ag-charts-community"
import type { Theme } from "@/context/ThemeContext"
import { enterococciAxes, withChartTheme } from "./chartTheme"
import type { EnterococciPivot } from "./pivotEnterococciByDate"
import { buildEnterococciBarSeries } from "./enterococciSeries"

export const buildEnterococciBarOptions = (
  pivot: EnterococciPivot,
  theme: Theme,
): AgCartesianChartOptions =>
  withChartTheme(theme, {
    data: pivot.data,
    series: buildEnterococciBarSeries(pivot),
    axes: enterococciAxes(),
  })

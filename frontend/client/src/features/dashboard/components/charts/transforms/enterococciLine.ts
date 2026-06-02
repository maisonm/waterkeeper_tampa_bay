import type { AgCartesianChartOptions } from "ag-charts-community"
import type { Theme } from "@/context/ThemeContext"
import { enterococciAxes, withChartTheme } from "./chartTheme"
import type { EnterococciPivot } from "./pivotEnterococciByDate"
import { buildEnterococciLineSeries } from "./enterococciSeries"

export const buildEnterococciLineOptions = (
  pivot: EnterococciPivot,
  theme: Theme,
): AgCartesianChartOptions =>
  withChartTheme(theme, {
    data: pivot.data,
    series: buildEnterococciLineSeries(pivot),
    axes: enterococciAxes(),
  })

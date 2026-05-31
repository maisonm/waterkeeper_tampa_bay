import type { AgCartesianAxesOptions, AgCartesianChartOptions } from "ag-charts-community"
import type { Theme } from "@/context/ThemeContext"
import { enterococciLogYAxis } from "./enterococciScale"

export const withChartTheme = (
  theme: Theme,
  options: AgCartesianChartOptions,
): AgCartesianChartOptions => ({
  ...options,
  theme: theme === "dark" ? "ag-default-dark" : "ag-default",
  legend: {
    enabled: true,
    ...options.legend,
  },
})

export const enterococciAxes = (): AgCartesianAxesOptions => ({
  x: { type: "category" },
  y: enterococciLogYAxis(),
})

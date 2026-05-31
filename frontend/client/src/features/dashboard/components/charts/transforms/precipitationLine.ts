import type { AgCartesianChartOptions } from "ag-charts-community"
import type { WeatherDailyRecord } from "@/api/types"
import type { Theme } from "@/context/ThemeContext"
import { withChartTheme } from "./chartTheme"

export const buildPrecipitationLineOptions = (
  weatherRecords: WeatherDailyRecord[],
  theme: Theme,
): AgCartesianChartOptions => {
  const data = [...weatherRecords]
    .sort((left, right) => left.weather_date.localeCompare(right.weather_date))
    .map((record) => ({
      date: record.weather_date,
      precipitation: record.precipitation_inches,
    }))

  return withChartTheme(theme, {
    data,
    series: [
      {
        type: "line",
        xKey: "date",
        yKey: "precipitation",
        title: "Precipitation (in)",
      },
    ],
    axes: {
      x: { type: "category" },
      y: {
        type: "number",
        title: { text: "Precipitation (in)" },
      },
    },
    legend: { enabled: false },
  })
}

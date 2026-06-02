import type { AgCartesianChartOptions } from "ag-charts-community"
import type { WeatherDailyRecord } from "@/api/types"
import type { Theme } from "@/context/ThemeContext"
import { withChartTheme } from "./chartTheme"

export const buildPrecipitationBarOptions = (
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
        type: "bar",
        xKey: "date",
        yKey: "precipitation",
      },
    ],
    axes: {
      x: { type: "category" },
      y: {
        type: "number",
        title: { text: "Precipitation (in)" },
        min: 0,
      },
    },
    legend: { enabled: false },
  })
}

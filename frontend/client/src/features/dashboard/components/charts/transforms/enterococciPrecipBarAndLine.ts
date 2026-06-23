import type { AgCartesianChartOptions, AgLineSeriesOptions } from "ag-charts-community"
import dayjs from "dayjs"
import type { WeatherDailyRecord } from "@/api/types"
import type { Theme } from "@/context/ThemeContext"
import { withChartTheme } from "./chartTheme"
import { enterococciLogYAxis } from "./enterococciScale"
import type { EnterococciPivot } from "./pivotEnterococciByDate"
import { buildEnterococciBarSeries } from "./enterococciSeries"

type PrecipitationTimeRow = {
  date: Date
  precipitation: number
}

const PRECIPITATION_STROKE: Record<Theme, string> = {
  light: "#0ea5e9",
  dark: "#38bdf8",
}

const enterococciBarHighlight = {
  unhighlightedItem: { opacity: 0.6 },
  unhighlightedSeries: { opacity: 0.6 },
} as const

const precipitationLineHighlight = {
  unhighlightedSeries: { opacity: 1 },
  bringToFront: false,
} as const

const parseChartDate = (date: string): Date => new Date(`${date}T00:00:00`)

const buildEnterococciTimeData = (pivot: EnterococciPivot) =>
  pivot.data.map((row) => ({
    ...row,
    date: parseChartDate(row.date),
  }))

const buildPrecipitationTimeData = (
  weatherRecords: WeatherDailyRecord[],
): PrecipitationTimeRow[] =>
  [...weatherRecords]
    .sort((left, right) => left.weather_date.localeCompare(right.weather_date))
    .map((record) => ({
      date: parseChartDate(record.weather_date),
      precipitation: record.precipitation_inches ?? 0,
    }))

const buildPrecipitationLineSeries = (
  data: PrecipitationTimeRow[],
  theme: Theme,
): AgLineSeriesOptions => ({
  type: "line",
  data,
  xKey: "date",
  yKey: "precipitation",
  yKeyAxis: "precipitation",
  title: "Precipitation",
  stroke: PRECIPITATION_STROKE[theme],
  strokeWidth: 2.5,
  marker: { enabled: false },
  highlight: precipitationLineHighlight,
})

export const buildEnterococciPrecipBarAndLineOptions = (
  pivot: EnterococciPivot,
  weatherRecords: WeatherDailyRecord[],
  theme: Theme,
): AgCartesianChartOptions => {
  const enterococciData = buildEnterococciTimeData(pivot)
  const precipitationData = buildPrecipitationTimeData(weatherRecords)

  const enterococciBars = buildEnterococciBarSeries(pivot).map((series) => ({
    ...series,
    data: enterococciData,
    yKeyAxis: "enterococci",
    highlight: enterococciBarHighlight,
  }))

  return withChartTheme(theme, {
    series: [...enterococciBars, buildPrecipitationLineSeries(precipitationData, theme)],
    axes: {
      x: {
        type: "time",
        position: "bottom",
        label: {
          formatter: ({ value }) => dayjs(value).format("MMM D, YYYY"),
        },
      },
      enterococci: {
        ...enterococciLogYAxis(),
        position: "left",
      },
      precipitation: {
        type: "number",
        position: "right",
        title: { text: "Precipitation (in)" },
        min: 0,
      },
    },
  })
}

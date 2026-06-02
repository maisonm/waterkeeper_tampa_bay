import { describe, expect, it } from "vitest"
import { buildPrecipitationBarOptions } from "./precipitationBar"
import { makeWeatherRecord } from "@/test/fixtures"

describe("buildPrecipitationBarOptions", () => {
  it("sorts weather records by date ascending", () => {
    const options = buildPrecipitationBarOptions(
      [
        makeWeatherRecord({ weather_date: "2024-02-01", precipitation_inches: 1 }),
        makeWeatherRecord({ weather_date: "2024-01-01", precipitation_inches: 0.2 }),
      ],
      "light",
    )

    expect(options.data).toEqual([
      { date: "2024-01-01", precipitation: 0.2 },
      { date: "2024-02-01", precipitation: 1 },
    ])
  })

  it("applies light theme and hides the legend", () => {
    const options = buildPrecipitationBarOptions([], "light")

    expect(options.theme).toBe("ag-default")
    expect(options.legend).toEqual({ enabled: false })
  })

  it("applies dark theme", () => {
    const options = buildPrecipitationBarOptions([], "dark")

    expect(options.theme).toBe("ag-default-dark")
  })
})

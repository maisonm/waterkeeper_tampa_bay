import type { Site, WaterQualitySample, WeatherDailyRecord } from "@/api/types"

export const makeSite = (overrides: Partial<Site> = {}): Site => ({
  id: 1,
  name: "Site A",
  latitude: 27.9,
  longitude: -82.5,
  is_active: true,
  ...overrides,
})

export const makeSample = (overrides: Partial<WaterQualitySample> = {}): WaterQualitySample => ({
  id: 1,
  site_id: 1,
  site_name: "Site A",
  sample_date: "2024-01-01",
  enterococci_per_100ml: 10,
  quality_code: "good",
  source_hash: null,
  ...overrides,
})

export const makeWeatherRecord = (
  overrides: Partial<WeatherDailyRecord> = {},
): WeatherDailyRecord => ({
  id: 1,
  weather_date: "2024-01-01",
  precipitation_inches: 0.5,
  avg_temp_f: 72,
  min_temp_f: 65,
  max_temp_f: 80,
  source: "test",
  ...overrides,
})

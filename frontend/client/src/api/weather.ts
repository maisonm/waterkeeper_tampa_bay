import { request, type ApiParams } from "./client"
import type { WeatherDailyRecord } from "./types"

export interface GetWeatherParams extends ApiParams {
  start_date?: string
  end_date?: string
}

export function getWeather(params?: GetWeatherParams): Promise<WeatherDailyRecord[]> {
  return request<WeatherDailyRecord[], GetWeatherParams>("get", "/api/v1/weather/", params)
}

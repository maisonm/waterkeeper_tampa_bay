// unused for now 
export interface Site {
  id: number
  name: string
  latitude: number
  longitude: number
  is_active: boolean
}

export interface WaterQualitySample {
  id: number
  site_id: number
  site_name: string
  sample_date: string
  enterococci_per_100ml: number
  quality_code: string
  source_hash: string | null
}

export interface WeatherDailyRecord {
  id: number
  weather_date: string
  precipitation_inches: number | null
  avg_temp_f: number | null
  min_temp_f: number | null
  max_temp_f: number | null
  source: string | null
}

export interface PaginatedSamples {
  items: WaterQualitySample[]
  total: number
  limit: number
  offset: number
}

export interface DashboardResponse {
  sample_sites: PaginatedSamples
  weather_records: WeatherDailyRecord[]
}

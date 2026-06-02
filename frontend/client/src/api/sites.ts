import { request } from "./client"
import type { Site } from "./types"

export const getSites = (): Promise<Site[]> =>
  request<Site[]>("get", "/api/v1/sites/")

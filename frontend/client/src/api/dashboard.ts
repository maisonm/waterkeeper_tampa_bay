import { request, type ApiParams } from "./client"
import type { DashboardResponse } from "./types"

export interface DashboardParams extends ApiParams {
  start_date?: string
  end_date?: string
  quality_code?: string
}

export const getAllSitesDashboard = (params?: DashboardParams): Promise<DashboardResponse> =>
  request<DashboardResponse, DashboardParams>("get", "/api/v1/dashboard/sites/samples", params)

export const getSiteDashboard = (
  siteId: number,
  params?: DashboardParams,
): Promise<DashboardResponse> =>
  request<DashboardResponse, DashboardParams>("get", `/api/v1/dashboard/sites/${siteId}/samples`, params)

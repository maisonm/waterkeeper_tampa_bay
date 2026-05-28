import { request, type ApiParams } from "./client"
import type { DashboardResponse } from "./types"

export interface GetDashboardParams extends ApiParams {
  start_date?: string
  end_date?: string
  limit?: number
  offset?: number
}

export interface GetSiteDashboardParams extends GetDashboardParams {
  quality_code?: string
}

export function getDashboard(params?: GetDashboardParams): Promise<DashboardResponse> {
  return request<DashboardResponse, GetDashboardParams>("get", "/api/v1/dashboard/samples", params)
}

export function getSiteDashboard(
  siteId: number,
  params?: GetSiteDashboardParams,
): Promise<DashboardResponse> {
  return request<DashboardResponse, GetSiteDashboardParams>("get", `/api/v1/dashboard/sites/${siteId}/samples`, params)
}

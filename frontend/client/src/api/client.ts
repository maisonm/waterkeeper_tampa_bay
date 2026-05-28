import axios from "axios"

const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:8000"

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
})

export type ApiParams = Record<string, string | number | boolean | null | undefined>

export async function request<T, P extends ApiParams = ApiParams>(
  method: "get" | "post" | "put" | "delete" | "patch",
  url: string,
  params?: P,
): Promise<T> {
  const response = await apiClient.request<T>({ method, url, params })
  return response.data
}

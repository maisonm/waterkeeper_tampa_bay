export const navRoutes = [
  { path: "/", label: "Dashboard" },
  { path: "/docs", label: "Docs" },
  { path: "/about", label: "About" },
] as const

export type NavRoute = (typeof navRoutes)[number]

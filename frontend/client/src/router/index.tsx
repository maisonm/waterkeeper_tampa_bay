import { createBrowserRouter } from "react-router-dom"
import type { ComponentType, ReactNode } from "react"
import DashboardLayout from "@/layout/DashboardLayout"
import DocsLayout from "@/layout/DocsLayout"
import AboutLayout from "@/layout/AboutLayout"
import DashboardPage from "@/features/dashboard/DashboardPage"
import DocsPage from "@/features/docs/DocsPage"
import AboutPage from "@/features/about/AboutPage"

type AppRouteConfig = {
  path: string
  label: string
  Layout: ComponentType<{ children: ReactNode }>
  Page: ComponentType
}

export const routeConfig: AppRouteConfig[] = [
  {
    path: "/",
    label: "Dashboard",
    Layout: DashboardLayout,
    Page: DashboardPage,
  },
  // {
  //   path: "/docs",
  //   label: "Docs",
  //   Layout: DocsLayout,
  //   Page: DocsPage,
  // },
  {
    path: "/about",
    label: "About",
    Layout: AboutLayout,
    Page: AboutPage,
  },
]

export const navRoutes = routeConfig.map(({ path, label }) => ({ path, label }))

export type NavRoute = (typeof navRoutes)[number]

export const router = createBrowserRouter(
  routeConfig.map(({ path, Layout, Page }) => ({
    path,
    element: (
      <Layout>
        <Page />
      </Layout>
    ),
  })),
)

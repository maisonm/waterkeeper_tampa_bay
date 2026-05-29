import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { ThemeProvider } from "@/context/ThemeContext"

const queryClient = new QueryClient()
import DashboardLayout from "@/layout/DashboardLayout"
import DocsLayout from "@/layout/DocsLayout"
import AboutLayout from "@/layout/AboutLayout"
import DashboardPage from "@/features/dashboard/DashboardPage"
import DocsPage from "@/features/docs/DocsPage"
import AboutPage from "@/features/about/AboutPage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout><DashboardPage /></DashboardLayout>,
  },
  {
    path: "/docs",
    element: <DocsLayout><DocsPage /></DocsLayout>,
  },
  {
    path: "/about",
    element: <AboutLayout><AboutPage /></AboutLayout>,
  },
])

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  )
}

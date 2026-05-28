import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { ThemeProvider } from "@/context/ThemeContext"
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
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

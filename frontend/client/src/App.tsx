import { QueryClientProvider } from "@tanstack/react-query"
import { RouterProvider } from "react-router-dom"
import { ThemeProvider } from "@/context/ThemeContext"
import { AgGridProvider } from "ag-grid-react"
import { AllCommunityModule } from "ag-grid-community"
import { queryClient } from "@/lib/queryClient"
import { router } from "@/router"

export default function App() {
  return (
    <AgGridProvider modules={[AllCommunityModule]}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </AgGridProvider>
  )
}

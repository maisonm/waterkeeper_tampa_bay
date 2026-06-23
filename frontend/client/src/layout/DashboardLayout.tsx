import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex min-h-0 flex-1 flex-col bg-muted">
        {children}
        <Footer />
      </main>
    </div>
  )
}

import Navbar from "@/components/Navbar"

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-muted">{children}</main>
    </div>
  )
}

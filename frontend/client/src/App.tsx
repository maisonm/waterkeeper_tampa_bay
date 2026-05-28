import { Button } from "@/components/ui/button"

function App() {
  return (
    <div className="max-w-xl mx-auto px-6 py-10 space-y-10">
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">A Brief History of Gnomes</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Gnomes are small, mythical creatures said to dwell underground, guarding buried treasure
          and tending to the earth's hidden roots. Originating in European folklore, they were
          believed to possess great wisdom despite their tiny stature. Garden gnomes — their
          ceramic descendants — became popular in 19th-century Germany, eventually spreading
          across the world as cheerful lawn ornaments. Whether guarding your petunias or a
          mountain of gold, gnomes take their responsibilities very seriously.
        </p>
        <div className="flex gap-2">
          <Button variant="outline">Prev</Button>
          <Button variant="outline">Next</Button>
        </div>
      </div>
    </div>
  )
}

export default App

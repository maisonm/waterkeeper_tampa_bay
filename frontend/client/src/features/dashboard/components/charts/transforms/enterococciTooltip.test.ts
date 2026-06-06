import { describe, expect, it } from "vitest"
import { renderEnterococciTooltip } from "./enterococciTooltip"

describe("renderEnterococciTooltip", () => {
  it("formats title with site name and enterococci count", () => {
    const result = renderEnterococciTooltip({
      datum: { date: "2024-03-15", "Site A": 1200 },
      xKey: "date",
      yKey: "Site A",
      title: "Site A",
    })

    expect(result.title).toBe("Site A - 1,200")
    expect(result.data).toEqual([{ label: "Date", value: "Mar 15, 2024" }])
  })

  it("uses yKey as site name when title is omitted", () => {
    const result = renderEnterococciTooltip({
      datum: { date: "2024-01-01", Beta: 42 },
      xKey: "date",
      yKey: "Beta",
    })

    expect(result.title).toBe("Beta - 42")
  })

  it("shows an em dash for missing values", () => {
    const result = renderEnterococciTooltip({
      datum: { date: "2024-01-01", Alpha: undefined },
      xKey: "date",
      yKey: "Alpha",
      title: "Alpha",
    })

    expect(result.title).toBe("Alpha - —")
  })
})

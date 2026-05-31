import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import {
  clampDate,
  findMatchingPresetValue,
  maxEndDate,
  minStartDate,
  presetDates,
} from "./utils"

describe("clampDate", () => {
  it("clamps to lower bound", () => {
    expect(clampDate("2024-01-01", "2024-02-01", undefined)).toBe("2024-02-01")
  })

  it("clamps to upper bound", () => {
    expect(clampDate("2024-06-01", undefined, "2024-05-01")).toBe("2024-05-01")
  })

  it("returns the date when within bounds", () => {
    expect(clampDate("2024-03-15", "2024-01-01", "2024-06-01")).toBe("2024-03-15")
  })
})

describe("maxEndDate", () => {
  it("adds 364 days to the start date", () => {
    expect(maxEndDate("2024-01-01")).toBe("2024-12-30")
  })
})

describe("minStartDate", () => {
  it("subtracts 364 days from the end date", () => {
    expect(minStartDate("2024-12-31")).toBe("2024-01-02")
  })
})

describe("presetDates", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2024-06-15T12:00:00Z"))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("returns an inclusive range ending today", () => {
    expect(presetDates(30)).toEqual({
      startDate: "2024-05-17",
      endDate: "2024-06-15",
    })
  })
})

describe("findMatchingPresetValue", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2024-06-15T12:00:00Z"))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("returns undefined when dates are missing", () => {
    expect(findMatchingPresetValue(undefined, "2024-06-15")).toBeUndefined()
  })

  it("returns the preset value for a matching range", () => {
    const range = presetDates(60)
    expect(findMatchingPresetValue(range.startDate, range.endDate)).toBe("60d")
  })

  it("returns undefined for a non-preset range", () => {
    expect(findMatchingPresetValue("2024-01-01", "2024-01-31")).toBeUndefined()
  })
})

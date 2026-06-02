import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { getCurrentMonthDateRange, getCurrentMonthKey } from "./currentMonthRange"

describe("currentMonthRange", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2024-06-15T12:00:00Z"))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("returns the first day of the month through today", () => {
    expect(getCurrentMonthDateRange()).toEqual({
      startDate: "2024-06-01",
      endDate: "2024-06-15",
    })
  })

  it("returns the current year-month key", () => {
    expect(getCurrentMonthKey()).toBe("2024-06")
  })
})

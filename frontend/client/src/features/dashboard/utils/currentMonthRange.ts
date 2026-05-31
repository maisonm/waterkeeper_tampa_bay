import dayjs from "dayjs"

export const getCurrentMonthDateRange = (): { startDate: string; endDate: string } => {
  const now = dayjs()
  return {
    startDate: now.startOf("month").format("YYYY-MM-DD"),
    endDate: now.format("YYYY-MM-DD"),
  }
}

export const getCurrentMonthKey = (): string => dayjs().format("YYYY-MM")

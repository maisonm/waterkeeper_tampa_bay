/** Log axes cannot use zero; AG Charts clips non-positive domains to this minimum. */
export const ENTEROCOCCI_LOG_AXIS_MIN = 1

export const enterococciLogYAxis = () => ({
  type: "log" as const,
  min: ENTEROCOCCI_LOG_AXIS_MIN,
  nice: true,
  title: { text: "Enterococci / 100 mL (log scale)" },
})

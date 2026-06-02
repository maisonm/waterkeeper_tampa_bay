import { cn } from "@/lib/utils"
import type { ReactNode } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

type KpiCardProps = {
  label: string
  children: ReactNode
  className?: string
  tooltip?: ReactNode
}

const KpiCard = ({ label, children, className, tooltip }: KpiCardProps) => {
  const card = (
    <div
      className={cn(
        "flex min-h-[5.5rem] flex-col justify-between rounded-lg border border-border bg-card px-4 py-3",
        tooltip && "cursor-default outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </div>
  )

  if (!tooltip) {
    return card
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{card}</TooltipTrigger>
      <TooltipContent side="top">{tooltip}</TooltipContent>
    </Tooltip>
  )
}

export default KpiCard

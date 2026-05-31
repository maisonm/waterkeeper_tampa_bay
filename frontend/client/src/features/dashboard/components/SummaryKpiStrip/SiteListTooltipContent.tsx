type SiteListTooltipContentProps = {
  title: string
  siteNames: string[]
  emptyMessage?: string
}

const SiteListTooltipContent = ({
  title,
  siteNames,
  emptyMessage = "No sites",
}: SiteListTooltipContentProps) => (
  <div className="space-y-1.5">
    <p className="text-xs font-semibold text-popover-foreground">{title}</p>
    {siteNames.length === 0 ? (
      <p className="text-xs text-muted-foreground">{emptyMessage}</p>
    ) : (
      <ul className="max-h-48 list-inside list-disc space-y-0.5 overflow-y-auto text-xs text-popover-foreground">
        {siteNames.map((name, index) => (
          <li key={`${name}-${index}`}>{name}</li>
        ))}
      </ul>
    )}
  </div>
)

export default SiteListTooltipContent

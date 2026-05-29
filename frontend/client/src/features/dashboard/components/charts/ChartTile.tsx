type ChartTileProps = {
  title: string
}

export default function ChartTile({ title }: ChartTileProps) {
  return (
    <div className="flex min-h-40 flex-col rounded-lg border border-border bg-zinc-100 dark:bg-zinc-800">
      <div className="border-b border-border px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </span>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <span className="text-sm text-muted-foreground">Chart — coming soon</span>
      </div>
    </div>
  )
}

import dayjs from "dayjs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { QUALITY_CODE_COLORS, QUALITY_CODES } from "../DataTable/utils"
import { useSummaryKpis } from "../../hooks/useSummaryKpis"
import type { QualityBucket, SummaryKpis } from "../../utils/summaryKpis"
import KpiCard from "./KpiCard"
import SiteListTooltipContent from "./SiteListTooltipContent"

const PLACEHOLDER = "—"

const QUALITY_SEGMENTS: QualityBucket[] = ["good", "moderate", "poor"]

type QualityBreakdownProps = {
  kpis: SummaryKpis
}

const QualityBreakdown = ({ kpis }: QualityBreakdownProps) => {
  const segments = QUALITY_SEGMENTS.map((code) => ({
    code,
    percent:
      code === "good"
        ? kpis.goodPercent
        : code === "moderate"
          ? kpis.moderatePercent
          : kpis.poorPercent,
    siteNames: kpis.sitesByQuality[code],
  }))

  return (
    <div className="space-y-2">
      <div className="flex h-2 overflow-hidden rounded-full bg-muted">
        {segments.map(({ code, percent, siteNames }) =>
          percent > 0 ? (
            <Tooltip key={code}>
              <TooltipTrigger asChild>
                <div
                  className="h-full cursor-default outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: QUALITY_CODE_COLORS[code],
                  }}
                  aria-label={`${QUALITY_CODES[code]} ${percent}%`}
                />
              </TooltipTrigger>
              <TooltipContent side="top">
                <SiteListTooltipContent
                  title={`${QUALITY_CODES[code]} (${percent}%)`}
                  siteNames={siteNames}
                  emptyMessage={`No ${QUALITY_CODES[code].toLowerCase()} sites`}
                />
              </TooltipContent>
            </Tooltip>
          ) : null,
        )}
      </div>
      <ul className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-foreground">
        {segments.map(({ code, percent }) => (
          <li key={code} className="flex items-center gap-1.5">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: QUALITY_CODE_COLORS[code] }}
              aria-hidden
            />
            <span>
              {percent}% {QUALITY_CODES[code]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const SummaryKpiStrip = () => {
  const { kpis, isLoading } = useSummaryKpis()

  const sitesSampled = isLoading ? PLACEHOLDER : (kpis?.sitesSampled ?? 0)
  const mostRecentDate =
    isLoading || !kpis?.mostRecentSampleDate
      ? PLACEHOLDER
      : dayjs(kpis.mostRecentSampleDate).format("MMM D, YYYY")
  const sitesPoor = isLoading ? PLACEHOLDER : (kpis?.sitesPoorOnLastSample ?? 0)

  return (
    <TooltipProvider>
      <div className="grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Sites sampled this month"
          tooltip={
            kpis ? (
              <SiteListTooltipContent
                title="Sites with samples this month"
                siteNames={kpis.sampledSiteNames}
                emptyMessage="No sites sampled this month"
              />
            ) : undefined
          }
        >
          <p className="text-2xl font-semibold tabular-nums text-foreground">{sitesSampled}</p>
          <p className="text-xs text-muted-foreground">
            Unique sites with at least one sample in the current month
          </p>
        </KpiCard>

        <KpiCard label="Latest reading by site" className="sm:col-span-2 lg:col-span-1">
          {isLoading || !kpis ? (
            <p className="text-2xl font-semibold text-foreground">{PLACEHOLDER}</p>
          ) : kpis.sitesSampled === 0 ? (
            <p className="text-sm text-muted-foreground">No samples this month</p>
          ) : (
            <QualityBreakdown kpis={kpis} />
          )}
        </KpiCard>

        <KpiCard label="Most recent sample date">
          <p className="text-2xl font-semibold text-foreground">{mostRecentDate}</p>
          <p className="text-xs text-muted-foreground">Newest sample in the current month</p>
        </KpiCard>

        <KpiCard
          label="Poor on last sample"
          tooltip={
            kpis ? (
              <SiteListTooltipContent
                title="Sites with poor latest reading"
                siteNames={kpis.poorSiteNames}
                emptyMessage="No sites with poor latest reading"
              />
            ) : undefined
          }
        >
          <p className="text-2xl font-semibold tabular-nums text-foreground">{sitesPoor}</p>
          <p className="text-xs text-muted-foreground">
            Sites whose latest reading this month is poor
          </p>
        </KpiCard>
      </div>
    </TooltipProvider>
  )
}

export default SummaryKpiStrip

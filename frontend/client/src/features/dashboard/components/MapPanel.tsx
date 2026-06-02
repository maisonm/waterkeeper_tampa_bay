import { useMemo } from "react"
import { CircleMarker, MapContainer, TileLayer, Tooltip } from "react-leaflet"
import { useFilter } from "../context/FilterContext"
import { isSiteIncluded } from "./FilterBar/SiteFilter/utils"
import { useSitesQuery } from "../hooks/useSitesQuery"

const TAMPA_BAY: [number, number] = [27.875928, -82.566954]

const MARKER_COLORS = {
  default: {
    fill: "#5888f3",
    stroke: "#3d6fd9",
  },
  focused: {
    fill: "#2563eb",
    stroke: "#1d4ed8",
  },
} as const

const SiteMarkers = () => {
  const { sitesFilter, tableFocus } = useFilter()
  const { selectedSiteIds } = sitesFilter
  const { focusedSiteId, toggleTableFocus } = tableFocus
  const { data: sites = [] } = useSitesQuery()

  const allSiteIds = useMemo(() => sites.map((site) => site.id), [sites])

  const visibleSites = useMemo(
    () =>
      sites.filter((site) =>
        isSiteIncluded(site.id, selectedSiteIds, allSiteIds),
      ),
    [sites, selectedSiteIds, allSiteIds],
  )

  return (
    <>
      {visibleSites.map((site) => {
        const isFocused = focusedSiteId === site.id
        const colors = isFocused ? MARKER_COLORS.focused : MARKER_COLORS.default

        return (
          <CircleMarker
            key={site.id}
            center={[site.latitude, site.longitude]}
            radius={isFocused ? 10 : 7}
            pathOptions={{
              color: colors.stroke,
              fillColor: colors.fill,
              fillOpacity: isFocused ? 0.95 : 0.85,
              weight: isFocused ? 3 : 2,
            }}
            eventHandlers={{
              click: () => toggleTableFocus(site.id),
            }}
          >
            <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
              {site.name}
            </Tooltip>
          </CircleMarker>
        )
      })}
    </>
  )
}

const MapPanel = () => (
  <div className="dashboard-map h-full overflow-hidden rounded-lg border border-border">
    <MapContainer
      center={TAMPA_BAY}
      zoom={10}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <SiteMarkers />
    </MapContainer>
  </div>
)

export default MapPanel

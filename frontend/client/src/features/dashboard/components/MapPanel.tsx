import { MapContainer, TileLayer } from "react-leaflet"

const TAMPA_BAY: [number, number] = [27.875928, -82.566954]

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
      </MapContainer>
  </div>
)

export default MapPanel

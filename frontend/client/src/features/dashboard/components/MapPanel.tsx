import { MapContainer, TileLayer } from "react-leaflet"

const TAMPA_BAY: [number, number] = [27.875928 , -82.566954]

export default function MapPanel() {
  return (
    <div className="overflow-hidden rounded-lg border border-border" style={{ minHeight: "16rem" }}>
      <MapContainer
        center={TAMPA_BAY}
        zoom={10.5}
        style={{ height: "100%", width: "100%", minHeight: "16rem" }}
        scrollWheelZoom
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>
    </div>
  )
}

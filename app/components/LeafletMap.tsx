"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Toilet } from "../data/mockToilets";

// Leaflet 기본 아이콘 수정 (Next.js에서 아이콘 경로 문제 해결)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface LeafletMapProps {
  toilets: Toilet[];
}

export default function LeafletMap({ toilets }: LeafletMapProps) {
  return (
    <MapContainer
      center={[37.5665, 126.978]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {toilets.map((toilet) => (
        <Marker key={toilet.id} position={[toilet.lat, toilet.lng]}>
          <Popup>
            <div style={{ minWidth: "150px" }}>
              <h3 style={{ fontWeight: "bold", marginBottom: "5px" }}>
                {toilet.name}
              </h3>
              <p style={{ fontSize: "12px", color: "#666", marginBottom: "3px" }}>
                {toilet.address}
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: toilet.isOpen ? "#22c55e" : "#ef4444",
                }}
              >
                {toilet.isOpen ? "✓ 이용 가능" : "✗ 이용 불가"}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

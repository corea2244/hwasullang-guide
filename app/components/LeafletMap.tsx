"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Toilet } from "../data/toiletTypes";

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
            <div style={{ minWidth: "200px" }}>
              <h3 style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "14px" }}>
                {toilet.name}
              </h3>
              <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
                📍 {toilet.roadAddress || toilet.address}
              </p>
              {(toilet.maleToilets || toilet.femaleToilets) && (
                <div style={{ fontSize: "11px", color: "#444", marginBottom: "4px" }}>
                  🚻 남: {toilet.maleToilets || 0}칸 / 여: {toilet.femaleToilets || 0}칸
                </div>
              )}
              {(toilet.disabledMaleToilets || toilet.disabledFemaleToilets) && (
                <div style={{ fontSize: "11px", color: "#2563eb", marginBottom: "4px" }}>
                  ♿ 장애인용 시설 있음
                </div>
              )}
              {toilet.phone && (
                <div style={{ fontSize: "11px", color: "#666", marginTop: "6px" }}>
                  📞 {toilet.phone}
                </div>
              )}
              {toilet.manageOrg && (
                <div style={{ fontSize: "10px", color: "#999", marginTop: "4px" }}>
                  관리: {toilet.manageOrg}
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

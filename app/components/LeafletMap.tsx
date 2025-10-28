"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { UnifiedToilet } from "../data/toiletModel";

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
  toilets: UnifiedToilet[];
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
        <Marker key={toilet.id} position={[toilet.location.lat, toilet.location.lng]}>
          <Popup>
            <div style={{ minWidth: "220px" }}>
              <h3 style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "14px" }}>
                {toilet.name}
              </h3>
              <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
                📍 {toilet.location.roadAddress || toilet.location.lotAddress}
              </p>
              {(toilet.facilities.male.toilets || toilet.facilities.female.toilets) && (
                <div style={{ fontSize: "11px", color: "#444", marginBottom: "4px" }}>
                  🚻 남: {toilet.facilities.male.toilets}칸 / 여: {toilet.facilities.female.toilets}칸
                </div>
              )}
              {(toilet.facilities.male.disabledToilets || toilet.facilities.female.disabledToilets) && (
                <div style={{ fontSize: "11px", color: "#2563eb", marginBottom: "4px" }}>
                  ♿ 장애인용 시설 있음
                </div>
              )}
              {toilet.safety?.hasDiaperChangingStation && (
                <div style={{ fontSize: "11px", color: "#10b981", marginBottom: "4px" }}>
                  👶 기저귀 교환대 있음
                </div>
              )}
              {toilet.operation?.openingHoursDetail && (
                <div style={{ fontSize: "11px", color: "#f59e0b", marginBottom: "4px" }}>
                  🕐 {toilet.operation.openingHoursDetail}
                </div>
              )}
              {toilet.management.phone && (
                <div style={{ fontSize: "11px", color: "#666", marginTop: "6px" }}>
                  📞 {toilet.management.phone}
                </div>
              )}
              {toilet.management.organization && (
                <div style={{ fontSize: "10px", color: "#999", marginTop: "4px" }}>
                  관리: {toilet.management.organization}
                </div>
              )}
              <div style={{ fontSize: "9px", color: "#bbb", marginTop: "6px", borderTop: "1px solid #eee", paddingTop: "4px" }}>
                {toilet.metadata.dataSource === 'api' ? '🔄 실시간 (경기도)' : '📦 정적 데이터'}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

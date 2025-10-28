/**
 * 통합 화장실 모델
 * API 데이터와 JSON(엑셀) 데이터를 모두 수용하는 통합 타입
 */

// 데이터 소스 구분
export type DataSource = 'api' | 'json';

// 화장실 시설 정보
export interface ToiletFacilities {
  // 남성 화장실
  male: {
    toilets: number;               // 대변기
    urinals: number;               // 소변기
    disabledToilets: number;       // 장애인용 대변기
    disabledUrinals?: number;      // 장애인용 소변기
    childrenToilets?: number;      // 어린이용 대변기
    childrenUrinals?: number;      // 어린이용 소변기
  };

  // 여성 화장실
  female: {
    toilets: number;               // 대변기
    disabledToilets: number;       // 장애인용 대변기
    childrenToilets?: number;      // 어린이용 대변기
  };
}

// 편의/안전 시설
export interface SafetyFacilities {
  hasEmergencyBell?: boolean;           // 비상벨 설치 여부
  emergencyBellLocation?: string;       // 비상벨 설치 장소
  hasCCTV?: boolean;                    // CCTV 설치 여부
  hasDiaperChangingStation?: boolean;   // 기저귀 교환대 유무
  diaperChangingLocation?: string;      // 기저귀 교환대 장소
  isSafetyFacilityRequired?: boolean;   // 안전관리시설 설치 대상 여부
}

// 관리 정보
export interface ManagementInfo {
  organization: string;          // 관리기관명
  phone?: string;                // 전화번호
  ownership?: string;            // 화장실 소유 구분
  wasteDisposal?: string;        // 오물 처리 방식
}

// 운영 정보
export interface OperationInfo {
  openingHours?: string;         // 개방시간 (예: "정시")
  openingHoursDetail?: string;   // 개방시간 상세 (예: "6:30~22:00")
  installDate?: string;          // 설치연월
  remodelingDate?: string;       // 리모델링연월
}

// 통합 화장실 모델
export interface UnifiedToilet {
  // 기본 정보
  id: string;
  name: string;
  category?: string;             // 구분 (개방화장실 등)

  // 위치 정보
  location: {
    lat: number;
    lng: number;
    roadAddress?: string;        // 도로명 주소
    lotAddress: string;          // 지번 주소
    city?: string;               // 시/도 (예: 경기도, 서울특별시)
    district?: string;           // 시군구 (예: 수원시)
  };

  // 시설 정보
  facilities: ToiletFacilities;

  // 편의/안전 시설
  safety?: SafetyFacilities;

  // 관리 정보
  management: ManagementInfo;

  // 운영 정보
  operation?: OperationInfo;

  // 메타데이터
  metadata: {
    dataSource: DataSource;      // 데이터 소스 (api/json)
    dataDate?: string;           // 데이터 기준일자
    lastUpdated?: string;        // 마지막 업데이트
  };
}

// 경기도 지역 확인 함수
export function isGyeonggiDo(address: string): boolean {
  return address.includes('경기도') || address.includes('경기 ');
}

// 지역 추출 함수
export function extractRegion(address: string): { city?: string; district?: string } {
  // 예: "경기도 수원시 장안구" → { city: "경기도", district: "수원시" }
  const parts = address.split(' ').filter(p => p.length > 0);

  if (parts.length === 0) return {};

  const city = parts[0];
  const district = parts.length > 1 ? parts[1] : undefined;

  return { city, district };
}

// 엑셀 파일에서 가져온 공중화장실 원본 데이터 타입
export interface ToiletExcelData {
  번호: string;
  구분: string;
  근거?: string;
  화장실명: string;
  소재지도로명주소: string;
  소재지지번주소: string;
  "남성용-대변기수": string;
  "남성용-소변기수": string;
  "남성용-장애인용대변기수": string;
  "남성용-장애인용소변기수": string;
  "남성용-어린이용대변기수": string;
  "남성용-어린이용소변기수": string;
  "여성용-대변기수": string;
  "여성용-장애인용대변기수": string;
  "여성용-어린이용대변기수": string;
  관리기관명: string;
  전화번호: string;
  개방시간?: string;
  개방시간상세?: string;
  설치연월?: string;
  WGS84위도: string;
  WGS84경도: string;
  화장실소유구분?: string;
  오물처리방식?: string;
  안전관리시설설치대상여부?: string;
  비상벨설치여부?: string;
  비상벨설치장소?: string;
  화장실입구CCTV설치유무?: string;
  기저귀교환대유무?: string;
  기저귀교환대장소?: string;
  리모델링연월?: string;
  데이터기준일자?: string;
}

// 프론트엔드에서 사용할 화장실 상세 정보 타입
export interface ToiletDetailFromExcel {
  id: string;

  // 기본 정보
  name: string;
  category: string;                // 구분 (개방화장실 등)
  roadAddress: string;
  lotAddress: string;

  // 위치
  lat: number;
  lng: number;

  // 남성 화장실
  male: {
    toilets: number;               // 대변기
    urinals: number;               // 소변기
    disabledToilets: number;       // 장애인용 대변기
    disabledUrinals: number;       // 장애인용 소변기
    childrenToilets: number;       // 어린이용 대변기
    childrenUrinals: number;       // 어린이용 소변기
  };

  // 여성 화장실
  female: {
    toilets: number;               // 대변기
    disabledToilets: number;       // 장애인용 대변기
    childrenToilets: number;       // 어린이용 대변기
  };

  // 관리 정보
  management: {
    organization: string;          // 관리기관명
    phone: string;                 // 전화번호
    ownership?: string;            // 화장실소유구분
    wasteDisposal?: string;        // 오물처리방식
  };

  // 운영 정보
  operation: {
    openingHours?: string;         // 개방시간
    openingHoursDetail?: string;   // 개방시간상세
    installDate?: string;          // 설치연월
    remodelingDate?: string;       // 리모델링연월
  };

  // 편의/안전 시설
  facilities: {
    hasEmergencyBell: boolean;           // 비상벨설치여부
    emergencyBellLocation?: string;      // 비상벨설치장소
    hasCCTV: boolean;                    // CCTV설치유무
    hasDiaperChangingStation: boolean;   // 기저귀교환대유무
    diaperChangingLocation?: string;     // 기저귀교환대장소
    isSafetyFacilityRequired: boolean;   // 안전관리시설설치대상여부
  };

  // 메타데이터
  dataDate?: string;                     // 데이터기준일자
}

// 엑셀 데이터를 ToiletDetailFromExcel 타입으로 변환
export function transformExcelToToiletDetail(data: ToiletExcelData): ToiletDetailFromExcel | null {
  const lat = parseFloat(data.WGS84위도);
  const lng = parseFloat(data.WGS84경도);

  // 좌표가 유효하지 않으면 null 반환
  if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
    return null;
  }

  return {
    id: data.번호,

    // 기본 정보
    name: data.화장실명,
    category: data.구분,
    roadAddress: data.소재지도로명주소,
    lotAddress: data.소재지지번주소,

    // 위치
    lat,
    lng,

    // 남성 화장실
    male: {
      toilets: parseInt(data["남성용-대변기수"]) || 0,
      urinals: parseInt(data["남성용-소변기수"]) || 0,
      disabledToilets: parseInt(data["남성용-장애인용대변기수"]) || 0,
      disabledUrinals: parseInt(data["남성용-장애인용소변기수"]) || 0,
      childrenToilets: parseInt(data["남성용-어린이용대변기수"]) || 0,
      childrenUrinals: parseInt(data["남성용-어린이용소변기수"]) || 0,
    },

    // 여성 화장실
    female: {
      toilets: parseInt(data["여성용-대변기수"]) || 0,
      disabledToilets: parseInt(data["여성용-장애인용대변기수"]) || 0,
      childrenToilets: parseInt(data["여성용-어린이용대변기수"]) || 0,
    },

    // 관리 정보
    management: {
      organization: data.관리기관명,
      phone: data.전화번호,
      ownership: data.화장실소유구분,
      wasteDisposal: data.오물처리방식,
    },

    // 운영 정보
    operation: {
      openingHours: data.개방시간,
      openingHoursDetail: data.개방시간상세,
      installDate: data.설치연월,
      remodelingDate: data.리모델링연월,
    },

    // 편의/안전 시설
    facilities: {
      hasEmergencyBell: data.비상벨설치여부 === 'Y',
      emergencyBellLocation: data.비상벨설치장소,
      hasCCTV: data.화장실입구CCTV설치유무 === 'Y',
      hasDiaperChangingStation: data.기저귀교환대유무 === 'Y',
      diaperChangingLocation: data.기저귀교환대장소,
      isSafetyFacilityRequired: data.안전관리시설설치대상여부 === 'Y',
    },

    // 메타데이터
    dataDate: data.데이터기준일자,
  };
}

// JSON 파일에서 데이터 로드
export async function loadToiletsFromJson(): Promise<ToiletDetailFromExcel[]> {
  const toiletsData = await import('./toiletsData.json');

  return toiletsData.default
    .map((data: ToiletExcelData) => transformExcelToToiletDetail(data))
    .filter((toilet): toilet is ToiletDetailFromExcel => toilet !== null);
}

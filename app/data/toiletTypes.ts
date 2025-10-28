// 경기도 공중화장실 API 응답 타입
export interface ToiletApiResponse {
  Publtolt: [
    {
      head: [
        {
          list_total_count: number;
          RESULT: {
            CODE: string;
            MESSAGE: string;
          };
          api_version: string;
        }
      ];
    },
    {
      row: ToiletRawData[];
    }
  ];
}

// API 원본 데이터 타입
export interface ToiletRawData {
  SIGUN_NM?: string;
  SIGUN_CD?: string;
  PBCTLT_PLC_NM?: string;
  REFINE_LOTNO_ADDR?: string;
  REFINE_ROADNM_ADDR?: string;
  REFINE_ZIP_CD?: string;
  MALE_WTRCLS_CNT?: number;
  FEMALE_WTRCLS_CNT?: number;
  MALE_URINALS_CNT?: number;
  MALE_DSPSN_WTRCLS_CNT?: number;
  FEMALE_DSPSN_WTRCLS_CNT?: number;
  MALE_DSPSN_URINALS_CNT?: number;
  MALE_CHLDRN_WTRCLS_CNT?: number;
  MALE_CHLDRN_URINALS_CNT?: number;
  FEMALE_CHLDRN_WTRCLS_CNT?: number;
  REFINE_WGS84_LAT?: string;
  REFINE_WGS84_LOGT?: string;
  MANAGE_INST_NM?: string;
  MNGINST_TELNO?: string;
}

// 프론트엔드에서 사용할 간소화된 타입
export interface Toilet {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  roadAddress?: string;
  maleToilets?: number;
  femaleToilets?: number;
  maleUrinals?: number;
  disabledMaleToilets?: number;
  disabledFemaleToilets?: number;
  manageOrg?: string;
  phone?: string;
}

// API 데이터를 프론트엔드 타입으로 변환하는 함수
export function transformToiletData(rawData: ToiletRawData, index: number): Toilet | null {
  const lat = parseFloat(rawData.REFINE_WGS84_LAT || '0');
  const lng = parseFloat(rawData.REFINE_WGS84_LOGT || '0');

  // 좌표가 유효하지 않으면 null 반환
  if (!lat || !lng || lat === 0 || lng === 0) {
    return null;
  }

  return {
    id: `toilet-${index}`,
    name: rawData.PBCTLT_PLC_NM || '이름 없음',
    lat,
    lng,
    address: rawData.REFINE_LOTNO_ADDR || '주소 정보 없음',
    roadAddress: rawData.REFINE_ROADNM_ADDR,
    maleToilets: rawData.MALE_WTRCLS_CNT,
    femaleToilets: rawData.FEMALE_WTRCLS_CNT,
    maleUrinals: rawData.MALE_URINALS_CNT,
    disabledMaleToilets: rawData.MALE_DSPSN_WTRCLS_CNT,
    disabledFemaleToilets: rawData.FEMALE_DSPSN_WTRCLS_CNT,
    manageOrg: rawData.MANAGE_INST_NM,
    phone: rawData.MNGINST_TELNO,
  };
}

// Mock 데이터는 실제 API 사용으로 대체되었습니다

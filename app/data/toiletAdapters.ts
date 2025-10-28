/**
 * 다양한 데이터 소스를 통합 모델(UnifiedToilet)로 변환하는 어댑터 함수들
 */

import { UnifiedToilet, extractRegion } from './toiletModel';
import { ToiletRawData } from './toiletTypes';
import { ToiletExcelData } from './toiletTypesFromExcel';

/**
 * 경기도 API 데이터 → 통합 모델
 */
export function apiToUnifiedToilet(data: ToiletRawData, index: number): UnifiedToilet | null {
  const lat = parseFloat(data.REFINE_WGS84_LAT || '0');
  const lng = parseFloat(data.REFINE_WGS84_LOGT || '0');

  // 좌표가 유효하지 않으면 null 반환
  if (!lat || !lng || lat === 0 || lng === 0) {
    return null;
  }

  const lotAddress = data.REFINE_LOTNO_ADDR || '';
  const region = extractRegion(lotAddress);

  return {
    id: `api-${index}`,
    name: data.PBCTLT_PLC_NM || '이름 없음',
    category: '공중화장실',

    location: {
      lat,
      lng,
      roadAddress: data.REFINE_ROADNM_ADDR,
      lotAddress,
      city: region.city || '경기도',
      district: region.district || data.SIGUN_NM,
    },

    facilities: {
      male: {
        toilets: data.MALE_WTRCLS_CNT || 0,
        urinals: data.MALE_URINALS_CNT || 0,
        disabledToilets: data.MALE_DSPSN_WTRCLS_CNT || 0,
        disabledUrinals: data.MALE_DSPSN_URINALS_CNT,
        childrenToilets: data.MALE_CHLDRN_WTRCLS_CNT,
        childrenUrinals: data.MALE_CHLDRN_URINALS_CNT,
      },
      female: {
        toilets: data.FEMALE_WTRCLS_CNT || 0,
        disabledToilets: data.FEMALE_DSPSN_WTRCLS_CNT || 0,
        childrenToilets: data.FEMALE_CHLDRN_WTRCLS_CNT,
      },
    },

    management: {
      organization: data.MANAGE_INST_NM || '정보 없음',
      phone: data.MNGINST_TELNO,
    },

    metadata: {
      dataSource: 'api',
      lastUpdated: new Date().toISOString(),
    },
  };
}

/**
 * JSON(엑셀) 데이터 → 통합 모델
 */
export function jsonToUnifiedToilet(data: ToiletExcelData): UnifiedToilet | null {
  const lat = parseFloat(data.WGS84위도);
  const lng = parseFloat(data.WGS84경도);

  // 좌표가 유효하지 않으면 null 반환
  if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
    return null;
  }

  const lotAddress = data.소재지지번주소 || '';
  const region = extractRegion(lotAddress);

  return {
    id: `json-${data.번호}`,
    name: data.화장실명,
    category: data.구분,

    location: {
      lat,
      lng,
      roadAddress: data.소재지도로명주소,
      lotAddress,
      ...region,
    },

    facilities: {
      male: {
        toilets: parseInt(data["남성용-대변기수"]) || 0,
        urinals: parseInt(data["남성용-소변기수"]) || 0,
        disabledToilets: parseInt(data["남성용-장애인용대변기수"]) || 0,
        disabledUrinals: parseInt(data["남성용-장애인용소변기수"]) || 0,
        childrenToilets: parseInt(data["남성용-어린이용대변기수"]) || 0,
        childrenUrinals: parseInt(data["남성용-어린이용소변기수"]) || 0,
      },
      female: {
        toilets: parseInt(data["여성용-대변기수"]) || 0,
        disabledToilets: parseInt(data["여성용-장애인용대변기수"]) || 0,
        childrenToilets: parseInt(data["여성용-어린이용대변기수"]) || 0,
      },
    },

    safety: {
      hasEmergencyBell: data.비상벨설치여부 === 'Y',
      emergencyBellLocation: data.비상벨설치장소,
      hasCCTV: data.화장실입구CCTV설치유무 === 'Y',
      hasDiaperChangingStation: data.기저귀교환대유무 === 'Y',
      diaperChangingLocation: data.기저귀교환대장소,
      isSafetyFacilityRequired: data.안전관리시설설치대상여부 === 'Y',
    },

    management: {
      organization: data.관리기관명,
      phone: data.전화번호,
      ownership: data.화장실소유구분,
      wasteDisposal: data.오물처리방식,
    },

    operation: {
      openingHours: data.개방시간,
      openingHoursDetail: data.개방시간상세,
      installDate: data.설치연월,
      remodelingDate: data.리모델링연월,
    },

    metadata: {
      dataSource: 'json',
      dataDate: data.데이터기준일자,
    },
  };
}

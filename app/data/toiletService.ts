/**
 * 화장실 데이터 통합 서비스
 * API와 JSON 데이터를 병합하여 제공
 */

import { UnifiedToilet, isGyeonggiDo } from './toiletModel';
import { apiToUnifiedToilet, jsonToUnifiedToilet } from './toiletAdapters';
import { ToiletRawData, ToiletApiResponse } from './toiletTypes';
import { ToiletExcelData } from './toiletTypesFromExcel';

/**
 * 경기도 API에서 데이터 가져오기
 */
async function fetchGyeonggiDataFromAPI(): Promise<UnifiedToilet[]> {
  try {
    const API_KEY = process.env.NEXT_PUBLIC_GG_API_KEY || 'ce2811ac642b43328d0eaf910005f933';
    const API_URL = `https://openapi.gg.go.kr/Publtolt?KEY=${API_KEY}&Type=json&pIndex=1&pSize=15000`;

    const response = await fetch(API_URL);

    if (!response.ok) {
      console.error('경기도 API 요청 실패:', response.status);
      return [];
    }

    const data: ToiletApiResponse = await response.json();

    if (data.Publtolt && data.Publtolt[1] && data.Publtolt[1].row) {
      const rawToilets = data.Publtolt[1].row;

      return rawToilets
        .map((raw, index) => apiToUnifiedToilet(raw, index))
        .filter((toilet): toilet is UnifiedToilet => toilet !== null);
    }

    return [];
  } catch (error) {
    console.error('경기도 API 데이터 로드 에러:', error);
    return [];
  }
}

/**
 * JSON 파일에서 경기도 외 지역 데이터 가져오기
 */
async function fetchOtherRegionsFromJSON(): Promise<UnifiedToilet[]> {
  try {
    // 동적 import로 JSON 파일 로드 (서버에서만 실행)
    const toiletsData = await import('./toiletsData.json');
    const allData: ToiletExcelData[] = toiletsData.default;

    // 경기도 제외 필터링
    const nonGyeonggiData = allData.filter((data) => {
      const address = data.소재지지번주소 || data.소재지도로명주소 || '';
      return !isGyeonggiDo(address);
    });

    console.log(`JSON에서 경기도 외 지역: ${nonGyeonggiData.length}개 발견`);

    return nonGyeonggiData
      .map((data) => jsonToUnifiedToilet(data))
      .filter((toilet): toilet is UnifiedToilet => toilet !== null);
  } catch (error) {
    console.error('JSON 데이터 로드 에러:', error);
    return [];
  }
}

/**
 * 통합 화장실 데이터 가져오기 (하이브리드 방식)
 * - 경기도: API (실시간)
 * - 기타 지역: JSON (정적 데이터)
 */
export async function getUnifiedToilets(): Promise<UnifiedToilet[]> {
  console.log('📊 통합 화장실 데이터 로딩 시작...');

  const [gyeonggiToilets, otherToilets] = await Promise.all([
    fetchGyeonggiDataFromAPI(),
    fetchOtherRegionsFromJSON(),
  ]);

  console.log(`✅ 경기도 API: ${gyeonggiToilets.length}개`);
  console.log(`✅ 기타 지역 JSON: ${otherToilets.length}개`);

  const allToilets = [...gyeonggiToilets, ...otherToilets];

  console.log(`🎉 총 ${allToilets.length}개 화장실 데이터 로드 완료`);

  return allToilets;
}

/**
 * 특정 지역의 화장실 데이터만 가져오기
 */
export async function getToiletsByRegion(region: string): Promise<UnifiedToilet[]> {
  const allToilets = await getUnifiedToilets();

  return allToilets.filter((toilet) => {
    const city = toilet.location.city || '';
    const district = toilet.location.district || '';
    const roadAddress = toilet.location.roadAddress || '';
    const lotAddress = toilet.location.lotAddress || '';

    const fullAddress = `${city} ${district} ${roadAddress} ${lotAddress}`;

    return fullAddress.includes(region);
  });
}

/**
 * ID로 특정 화장실 찾기
 */
export async function getToiletById(id: string): Promise<UnifiedToilet | null> {
  const allToilets = await getUnifiedToilets();

  return allToilets.find((toilet) => toilet.id === id) || null;
}

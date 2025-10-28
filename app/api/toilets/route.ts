import { NextResponse } from 'next/server';
import { getUnifiedToilets, getToiletsByRegion, getToiletById } from '@/app/data/toiletService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get('region'); // 특정 지역 필터
  const id = searchParams.get('id'); // 특정 화장실 ID

  try {
    // ID로 특정 화장실 조회
    if (id) {
      const toilet = await getToiletById(id);
      if (!toilet) {
        return NextResponse.json(
          { error: '화장실을 찾을 수 없습니다.' },
          { status: 404 }
        );
      }
      return NextResponse.json(toilet);
    }

    // 지역별 조회
    if (region) {
      const toilets = await getToiletsByRegion(region);
      return NextResponse.json({
        total: toilets.length,
        region,
        toilets,
      });
    }

    // 전체 조회 (통합 데이터: 경기도=API, 기타=JSON)
    const toilets = await getUnifiedToilets();

    return NextResponse.json({
      total: toilets.length,
      toilets,
      sources: {
        api: toilets.filter(t => t.metadata.dataSource === 'api').length,
        json: toilets.filter(t => t.metadata.dataSource === 'json').length,
      }
    });
  } catch (error) {
    console.error('화장실 데이터 로드 에러:', error);
    return NextResponse.json(
      { error: '화장실 데이터를 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

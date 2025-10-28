import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';
  const size = searchParams.get('size') || '1000';

  const API_KEY = process.env.NEXT_PUBLIC_GG_API_KEY || 'ce2811ac642b43328d0eaf910005f933';
  const API_URL = `https://openapi.gg.go.kr/Publtolt?KEY=${API_KEY}&Type=json&pIndex=${page}&pSize=${size}`;

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('공중화장실 API 요청 에러:', error);
    return NextResponse.json(
      { error: '공중화장실 데이터를 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

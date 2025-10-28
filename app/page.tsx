"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import LoadingScreen from "./components/LoadingScreen";
import { UnifiedToilet } from "./data/toiletModel";

const LeafletMap = dynamic(() => import("./components/LeafletMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center">지도 로딩 중...</div>,
});

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [toilets, setToilets] = useState<UnifiedToilet[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dataSources, setDataSources] = useState<{ api: number; json: number }>({ api: 0, json: 0 });

  useEffect(() => {
    async function fetchToilets() {
      try {
        const response = await fetch('/api/toilets');

        if (!response.ok) {
          throw new Error('화장실 데이터를 불러오는데 실패했습니다.');
        }

        const data = await response.json();

        if (data.toilets && Array.isArray(data.toilets)) {
          setToilets(data.toilets);
          setDataSources(data.sources || { api: 0, json: 0 });
        } else {
          throw new Error('API 응답 형식이 올바르지 않습니다.');
        }
      } catch (err) {
        console.error('화장실 데이터 로드 에러:', err);
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchToilets();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">오류 발생</p>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* 헤더 */}
      <header className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4 shadow-lg">
        <div className="container mx-auto flex items-center gap-4">
          <Image src="/icon.png" alt="화슐랭 가이드" width={48} height={48} />
          <div>
            <h1 className="text-2xl font-bold">화슐랭 가이드</h1>
            <p className="text-sm text-blue-100">전국 공공 화장실을 찾아드립니다</p>
          </div>
        </div>
      </header>

      {/* 지도 영역 */}
      <main className="flex-1 w-full">
        <LeafletMap toilets={toilets} />
      </main>

      {/* 하단 정보 */}
      <footer className="bg-white border-t p-4 shadow-lg">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                총 <span className="font-bold text-blue-600">{toilets.length.toLocaleString()}</span>개의 공공 화장실
              </p>
              <p className="text-xs text-gray-400 mt-1">
                경기도 {dataSources.api.toLocaleString()}개 (실시간) · 기타 지역 {dataSources.json.toLocaleString()}개
              </p>
            </div>
            <p className="text-xs text-gray-500">
              마커를 클릭하여 상세 정보를 확인하세요
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

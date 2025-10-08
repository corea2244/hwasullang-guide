"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import LoadingScreen from "./components/LoadingScreen";
import { mockToilets } from "./data/mockToilets";

const LeafletMap = dynamic(() => import("./components/LeafletMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center">지도 로딩 중...</div>,
});

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 디버깅을 위해 2초로 단축

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-col h-screen">
      {/* 헤더 */}
      <header className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4 shadow-lg">
        <div className="container mx-auto flex items-center gap-4">
          <Image src="/icon.png" alt="화슐랭 가이드" width={48} height={48} />
          <div>
            <h1 className="text-2xl font-bold">화슐랭 가이드</h1>
            <p className="text-sm text-blue-100">주변의 공공 화장실을 찾아드립니다</p>
          </div>
        </div>
      </header>

      {/* 지도 영역 */}
      <main className="flex-1 w-full">
        <LeafletMap toilets={mockToilets} />
      </main>

      {/* 하단 정보 */}
      <footer className="bg-white border-t p-4 shadow-lg">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              총 <span className="font-bold text-blue-600">{mockToilets.length}</span>개의 공공 화장실
            </p>
            <p className="text-xs text-gray-500">
              마커를 클릭하여 상세 정보를 확인하세요
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

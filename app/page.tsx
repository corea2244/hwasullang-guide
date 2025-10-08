"use client";

import { useState, useEffect } from "react";
import LoadingScreen from "./components/LoadingScreen";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="font-sans min-h-screen p-8 flex items-center justify-center">
      <main className="text-center">
        <h1 className="text-4xl font-bold mb-4">화슐랭 가이드</h1>
        <p className="text-xl text-gray-600">주변의 공공 화장실을 찾아드립니다</p>
      </main>
    </div>
  );
}

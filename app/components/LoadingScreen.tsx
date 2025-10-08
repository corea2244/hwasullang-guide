export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700">
      <div className="text-center">
        {/* 로고/타이틀 */}
        <h1 className="text-5xl font-bold text-white mb-8 tracking-tight">
          화슐랭 가이드
        </h1>

        {/* 로딩 애니메이션 */}
        <div className="flex justify-center items-center space-x-2">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
        </div>

        {/* 서브 텍스트 */}
        <p className="mt-8 text-white/90 text-lg">
          주변의 공공 화장실을 찾아드립니다
        </p>
      </div>
    </div>
  );
}

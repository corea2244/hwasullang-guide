const fs = require('fs');
const path = require('path');

// JSON 파일 로드
const jsonPath = path.join(__dirname, '..', 'app', 'data', 'toiletsData.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

// 한국 좌표 범위 (여유있게)
const KOREA_BOUNDS = {
  lat: { min: 33, max: 39 },      // 제주도 ~ 북한 경계
  lng: { min: 124, max: 132 }     // 서쪽 끝 ~ 동쪽 끝
};

console.log('🧹 데이터 정제 시작...\n');
console.log(`📊 원본 데이터: ${data.length}개\n`);

// 유효한 데이터 필터링
const cleanedData = data.filter(item => {
  const lat = parseFloat(item.WGS84위도);
  const lng = parseFloat(item.WGS84경도);

  // 1. 좌표가 숫자가 아니거나 0인 경우 제외
  if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
    return false;
  }

  // 2. 한국 범위를 벗어난 경우 제외
  if (lat < KOREA_BOUNDS.lat.min || lat > KOREA_BOUNDS.lat.max ||
      lng < KOREA_BOUNDS.lng.min || lng > KOREA_BOUNDS.lng.max) {
    console.log(`❌ 범위 벗어남: ${item.화장실명} (${lat}, ${lng})`);
    return false;
  }

  return true;
});

console.log(`\n✅ 정제된 데이터: ${cleanedData.length}개`);
console.log(`🗑️  제거된 데이터: ${data.length - cleanedData.length}개\n`);

// 정제된 데이터의 통계
const latitudes = cleanedData.map(item => parseFloat(item.WGS84위도));
const longitudes = cleanedData.map(item => parseFloat(item.WGS84경도));

console.log('📊 정제 후 좌표 범위:');
console.log(`  위도: ${Math.min(...latitudes).toFixed(4)} ~ ${Math.max(...latitudes).toFixed(4)}`);
console.log(`  경도: ${Math.min(...longitudes).toFixed(4)} ~ ${Math.max(...longitudes).toFixed(4)}\n`);

// 지역별 분포
const regionCount = {};
cleanedData.forEach(item => {
  const address = item.소재지지번주소 || item.소재지도로명주소 || '';
  const region = address.split(' ')[0];
  regionCount[region] = (regionCount[region] || 0) + 1;
});

console.log('📊 정제 후 지역별 분포 (상위 10개):');
Object.entries(regionCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .forEach(([region, count]) => {
    console.log(`  ${region}: ${count}개`);
  });

// 정제된 데이터 저장
const outputPath = path.join(__dirname, '..', 'app', 'data', 'toiletsData.json');
const backupPath = path.join(__dirname, '..', 'app', 'data', 'toiletsData.backup.json');

// 백업 생성
fs.writeFileSync(backupPath, JSON.stringify(data, null, 2), 'utf-8');
console.log(`\n💾 원본 백업: toiletsData.backup.json`);

// 정제된 데이터 저장
fs.writeFileSync(outputPath, JSON.stringify(cleanedData, null, 2), 'utf-8');
console.log(`💾 정제된 데이터 저장: toiletsData.json`);

const originalSize = (fs.statSync(backupPath).size / 1024 / 1024).toFixed(2);
const cleanedSize = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(2);

console.log(`\n📦 파일 크기: ${originalSize} MB → ${cleanedSize} MB`);
console.log('\n✨ 데이터 정제 완료!');

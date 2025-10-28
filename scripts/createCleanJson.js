const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// 엑셀 파일 읽기
const excelPath = path.join(__dirname, '..', '12_04_01_E_공중화장실정보.xlsx');
const workbook = XLSX.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

// 한국 좌표 범위
const KOREA_BOUNDS = {
  lat: { min: 33, max: 39 },
  lng: { min: 124, max: 132 }
};

console.log('🔍 엑셀에서 유효한 데이터만 추출 중...\n');
console.log(`📊 전체 데이터: ${data.length}개\n`);

// 유효한 데이터만 필터링
const validData = data.filter(item => {
  const lat = parseFloat(item.WGS84위도);
  const lng = parseFloat(item.WGS84경도);

  // 좌표가 유효하지 않으면 제외
  if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
    return false;
  }

  // 한국 범위를 벗어나면 제외
  if (lat < KOREA_BOUNDS.lat.min || lat > KOREA_BOUNDS.lat.max ||
      lng < KOREA_BOUNDS.lng.min || lng > KOREA_BOUNDS.lng.max) {
    return false;
  }

  return true;
});

console.log(`✅ 유효한 데이터: ${validData.length}개`);
console.log(`🗑️  제거된 데이터: ${data.length - validData.length}개\n`);

// 통계
const validLats = validData.map(item => parseFloat(item.WGS84위도));
const validLngs = validData.map(item => parseFloat(item.WGS84경도));

console.log('📊 좌표 범위:');
console.log(`  위도: ${Math.min(...validLats).toFixed(4)} ~ ${Math.max(...validLats).toFixed(4)}`);
console.log(`  경도: ${Math.min(...validLngs).toFixed(4)} ~ ${Math.max(...validLngs).toFixed(4)}\n`);

// 지역별 분포
const regionCount = {};
validData.forEach(item => {
  const address = item.소재지지번주소 || item.소재지도로명주소 || '';
  const region = address.split(' ')[0];
  regionCount[region] = (regionCount[region] || 0) + 1;
});

console.log('📊 지역별 분포:');
Object.entries(regionCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .forEach(([region, count]) => {
    console.log(`  ${region}: ${count}개`);
  });

// 기존 파일 백업
const outputPath = path.join(__dirname, '..', 'app', 'data', 'toiletsData.json');
const backupPath = path.join(__dirname, '..', 'app', 'data', 'toiletsData.backup.json');

if (fs.existsSync(outputPath)) {
  fs.copyFileSync(outputPath, backupPath);
  console.log(`\n💾 기존 파일 백업: toiletsData.backup.json`);
}

// 새로운 정제된 데이터 저장
fs.writeFileSync(outputPath, JSON.stringify(validData, null, 2), 'utf-8');

const fileSize = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(2);

console.log(`💾 새로운 정제된 데이터 저장: toiletsData.json`);
console.log(`📦 파일 크기: ${fileSize} MB\n`);

console.log('✨ 완료!');
console.log('\n📝 이제 다음 데이터가 지도에 표시됩니다:');
console.log(`  - toiletsData.json: ${validData.length}개 (서울 중심)`);
console.log(`  - 경기도 API: 실시간 데이터`);

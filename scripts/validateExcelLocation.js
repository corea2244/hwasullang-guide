const XLSX = require('xlsx');
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

console.log('🔍 엑셀 파일 위치 데이터 검증 시작...\n');
console.log(`📊 전체 데이터: ${data.length}개\n`);

// 유효하지 않은 좌표
const invalidCoords = data.filter(item => {
  const lat = parseFloat(item.WGS84위도);
  const lng = parseFloat(item.WGS84경도);
  return isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0;
});

console.log(`❌ 좌표가 없거나 0인 데이터: ${invalidCoords.length}개`);

// 범위를 벗어난 데이터
const outOfBounds = data.filter(item => {
  const lat = parseFloat(item.WGS84위도);
  const lng = parseFloat(item.WGS84경도);

  if (isNaN(lat) || isNaN(lng)) return false;

  return lat < KOREA_BOUNDS.lat.min || lat > KOREA_BOUNDS.lat.max ||
         lng < KOREA_BOUNDS.lng.min || lng > KOREA_BOUNDS.lng.max;
});

console.log(`❌ 한국 범위를 벗어난 데이터: ${outOfBounds.length}개\n`);

if (outOfBounds.length > 0) {
  console.log('⚠️  범위를 벗어난 데이터 샘플 (최대 20개):');
  outOfBounds.slice(0, 20).forEach(item => {
    console.log(`  - ${item.화장실명}`);
    console.log(`    주소: ${item.소재지지번주소 || item.소재지도로명주소}`);
    console.log(`    좌표: (${item.WGS84위도}, ${item.WGS84경도})`);
    console.log('');
  });
}

// 유효한 데이터
const validData = data.filter(item => {
  const lat = parseFloat(item.WGS84위도);
  const lng = parseFloat(item.WGS84경도);

  if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) return false;

  return lat >= KOREA_BOUNDS.lat.min && lat <= KOREA_BOUNDS.lat.max &&
         lng >= KOREA_BOUNDS.lng.min && lng <= KOREA_BOUNDS.lng.max;
});

console.log(`\n✅ 유효한 데이터: ${validData.length}개`);
console.log(`📊 유효 데이터 비율: ${(validData.length / data.length * 100).toFixed(1)}%\n`);

// 유효한 데이터의 좌표 범위
const validLats = validData.map(item => parseFloat(item.WGS84위도));
const validLngs = validData.map(item => parseFloat(item.WGS84경도));

console.log('📊 유효 데이터 좌표 범위:');
console.log(`  위도: ${Math.min(...validLats).toFixed(4)} ~ ${Math.max(...validLats).toFixed(4)}`);
console.log(`  경도: ${Math.min(...validLngs).toFixed(4)} ~ ${Math.max(...validLngs).toFixed(4)}\n`);

// 지역별 분포
const regionCount = {};
validData.forEach(item => {
  const address = item.소재지지번주소 || item.소재지도로명주소 || '';
  const region = address.split(' ')[0];
  regionCount[region] = (regionCount[region] || 0) + 1;
});

console.log('📊 지역별 분포 (상위 15개):');
Object.entries(regionCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 15)
  .forEach(([region, count]) => {
    console.log(`  ${region}: ${count}개`);
  });

console.log('\n' + '='.repeat(60));
console.log('📝 요약');
console.log('='.repeat(60));
console.log(`전체: ${data.length}개`);
console.log(`유효: ${validData.length}개 (${(validData.length / data.length * 100).toFixed(1)}%)`);
console.log(`무효 좌표: ${invalidCoords.length}개`);
console.log(`범위 초과: ${outOfBounds.length}개`);
console.log('='.repeat(60));

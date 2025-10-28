const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// 엑셀 파일 읽기
const excelPath = path.join(__dirname, '..', '12_04_01_E_공중화장실정보.xlsx');
const workbook = XLSX.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

// 지역별 좌표 범위 (더 엄격하게)
const REGION_BOUNDS = {
  서울: {
    lat: { min: 37.4, max: 37.7 },
    lng: { min: 126.8, max: 127.2 }
  },
  경기: {
    lat: { min: 36.8, max: 38.0 },
    lng: { min: 126.4, max: 127.8 }
  },
  default: {
    lat: { min: 33, max: 39 },
    lng: { min: 124, max: 132 }
  }
};

console.log('🔍 엑셀에서 유효한 데이터만 추출 (엄격 모드)...\n');
console.log(`📊 전체 데이터: ${data.length}개\n`);

// 지역 판별 함수
function getRegion(address) {
  if (address.includes('서울')) return '서울';
  if (address.includes('경기')) return '경기';
  return 'default';
}

// 유효한 데이터만 필터링
const removedItems = [];

const validData = data.filter(item => {
  const lat = parseFloat(item.WGS84위도);
  const lng = parseFloat(item.WGS84경도);

  // 좌표가 유효하지 않으면 제외
  if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
    return false;
  }

  // 주소 기반 지역 판별
  const address = item.소재지지번주소 || item.소재지도로명주소 || '';
  const region = getRegion(address);
  const bounds = REGION_BOUNDS[region];

  // 지역별 범위 체크
  if (lat < bounds.lat.min || lat > bounds.lat.max ||
      lng < bounds.lng.min || lng > bounds.lng.max) {
    removedItems.push({
      name: item.화장실명,
      address,
      region,
      coords: { lat, lng }
    });
    return false;
  }

  return true;
});

console.log(`✅ 유효한 데이터: ${validData.length}개`);
console.log(`🗑️  제거된 데이터: ${data.length - validData.length}개\n`);

// 제거된 데이터 상세
if (removedItems.length > 0) {
  console.log('🗑️  제거된 데이터 상세:');
  removedItems.forEach(item => {
    console.log(`  ❌ ${item.name}`);
    console.log(`     주소: ${item.address}`);
    console.log(`     좌표: (${item.coords.lat}, ${item.coords.lng})`);
    console.log(`     지역: ${item.region}`);
    console.log('');
  });
}

// 통계
const validLats = validData.map(item => parseFloat(item.WGS84위도));
const validLngs = validData.map(item => parseFloat(item.WGS84경도));

console.log('📊 정제 후 좌표 범위:');
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

// 정제된 데이터 저장
const outputPath = path.join(__dirname, '..', 'app', 'data', 'toiletsData.json');
fs.writeFileSync(outputPath, JSON.stringify(validData, null, 2), 'utf-8');

const fileSize = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(2);

console.log(`\n💾 정제된 데이터 저장: toiletsData.json`);
console.log(`📦 파일 크기: ${fileSize} MB\n`);
console.log('✨ 완료!');

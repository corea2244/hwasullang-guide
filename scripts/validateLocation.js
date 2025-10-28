const fs = require('fs');
const path = require('path');

// JSON 파일 로드
const jsonPath = path.join(__dirname, '..', 'app', 'data', 'toiletsData.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

// 서울 좌표 범위 (대략적)
const SEOUL_BOUNDS = {
  lat: { min: 37.4, max: 37.7 },
  lng: { min: 126.8, max: 127.2 }
};

// 경기도 좌표 범위 (대략적)
const GYEONGGI_BOUNDS = {
  lat: { min: 36.8, max: 38.3 },
  lng: { min: 126.4, max: 127.8 }
};

console.log('🔍 위치 데이터 검증 시작...\n');

// 서울 데이터 검증
const seoulData = data.filter(item => {
  const address = item.소재지지번주소 || item.소재지도로명주소 || '';
  return address.includes('서울');
});

console.log(`📍 서울로 표시된 데이터: ${seoulData.length}개\n`);

const invalidSeoul = seoulData.filter(item => {
  const lat = parseFloat(item.WGS84위도);
  const lng = parseFloat(item.WGS84경도);

  return lat < SEOUL_BOUNDS.lat.min || lat > SEOUL_BOUNDS.lat.max ||
         lng < SEOUL_BOUNDS.lng.min || lng > SEOUL_BOUNDS.lng.max;
});

console.log(`❌ 서울 범위를 벗어난 데이터: ${invalidSeoul.length}개\n`);

if (invalidSeoul.length > 0) {
  console.log('⚠️  문제 데이터 샘플 (최대 10개):');
  invalidSeoul.slice(0, 10).forEach(item => {
    console.log(`  - ${item.화장실명}`);
    console.log(`    주소: ${item.소재지지번주소 || item.소재지도로명주소}`);
    console.log(`    좌표: (${item.WGS84위도}, ${item.WGS84경도})`);
    console.log('');
  });
}

// 경기도 데이터 검증
const gyeonggiData = data.filter(item => {
  const address = item.소재지지번주소 || item.소재지도로명주소 || '';
  return address.includes('경기');
});

console.log(`\n📍 경기도로 표시된 데이터: ${gyeonggiData.length}개\n`);

const invalidGyeonggi = gyeonggiData.filter(item => {
  const lat = parseFloat(item.WGS84위도);
  const lng = parseFloat(item.WGS84경도);

  return lat < GYEONGGI_BOUNDS.lat.min || lat > GYEONGGI_BOUNDS.lat.max ||
         lng < GYEONGGI_BOUNDS.lng.min || lng > GYEONGGI_BOUNDS.lng.max;
});

console.log(`❌ 경기도 범위를 벗어난 데이터: ${invalidGyeonggi.length}개\n`);

// 좌표가 0이거나 없는 데이터
const invalidCoords = data.filter(item => {
  const lat = parseFloat(item.WGS84위도);
  const lng = parseFloat(item.WGS84경도);

  return isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0;
});

console.log(`\n❌ 유효하지 않은 좌표 데이터: ${invalidCoords.length}개\n`);

// 좌표 범위 통계
const allValidCoords = data.filter(item => {
  const lat = parseFloat(item.WGS84위도);
  const lng = parseFloat(item.WGS84경도);
  return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
});

const latitudes = allValidCoords.map(item => parseFloat(item.WGS84위도));
const longitudes = allValidCoords.map(item => parseFloat(item.WGS84경도));

console.log('\n📊 전체 좌표 범위:');
console.log(`  위도: ${Math.min(...latitudes).toFixed(4)} ~ ${Math.max(...latitudes).toFixed(4)}`);
console.log(`  경도: ${Math.min(...longitudes).toFixed(4)} ~ ${Math.max(...longitudes).toFixed(4)}`);

// 지역별 분포
const regionCount = {};
data.forEach(item => {
  const address = item.소재지지번주소 || item.소재지도로명주소 || '';
  const region = address.split(' ')[0];
  regionCount[region] = (regionCount[region] || 0) + 1;
});

console.log('\n📊 지역별 분포 (상위 10개):');
Object.entries(regionCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .forEach(([region, count]) => {
    console.log(`  ${region}: ${count}개`);
  });

const fs = require('fs');
const path = require('path');

// JSON 파일 로드
const jsonPath = path.join(__dirname, '..', 'app', 'data', 'toiletsData.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

// 확인할 화장실 이름들
const targetNames = [
  '잠원동',
  '대림정보문화도서관',
  '중랑천환경센터',
  '양천리누리터',
  '양천누리터'
];

console.log('🔍 특정 화장실 좌표 확인...\n');

targetNames.forEach(keyword => {
  console.log(`\n검색어: "${keyword}"`);
  console.log('='.repeat(60));

  const matches = data.filter(item => {
    const name = item.화장실명 || '';
    const address = (item.소재지지번주소 || '') + (item.소재지도로명주소 || '');
    return name.includes(keyword) || address.includes(keyword);
  });

  if (matches.length === 0) {
    console.log('❌ 해당 화장실을 찾을 수 없습니다.\n');
    return;
  }

  matches.forEach(item => {
    const lat = parseFloat(item.WGS84위도);
    const lng = parseFloat(item.WGS84경도);

    console.log(`\n📍 ${item.화장실명}`);
    console.log(`   주소: ${item.소재지지번주소 || item.소재지도로명주소}`);
    console.log(`   좌표: 위도 ${lat}, 경도 ${lng}`);

    // 서울 범위 체크 (37.4~37.7, 126.8~127.2)
    const isValidSeoul = lat >= 37.4 && lat <= 37.7 && lng >= 126.8 && lng <= 127.2;

    if (!isValidSeoul) {
      console.log(`   ⚠️  서울 범위를 벗어남!`);

      // 위도/경도가 바뀐 경우 체크
      if (lng >= 37.4 && lng <= 37.7 && lat >= 126.8 && lat <= 127.2) {
        console.log(`   💡 위도와 경도가 바뀐 것 같습니다!`);
        console.log(`   → 수정 제안: 위도 ${lng}, 경도 ${lat}`);
      }
    } else {
      console.log(`   ✅ 정상 범위`);
    }
  });
});

console.log('\n' + '='.repeat(60));

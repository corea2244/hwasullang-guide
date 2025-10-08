export interface Toilet {
  id: number;
  name: string;
  lat: number;
  lng: number;
  address: string;
  isOpen: boolean;
}

export const mockToilets: Toilet[] = [
  {
    id: 1,
    name: "서울역 공중화장실",
    lat: 37.5547,
    lng: 126.9707,
    address: "서울특별시 용산구 한강대로 405",
    isOpen: true,
  },
  {
    id: 2,
    name: "광화문 공중화장실",
    lat: 37.5720,
    lng: 126.9769,
    address: "서울특별시 종로구 세종대로 172",
    isOpen: true,
  },
  {
    id: 3,
    name: "남대문시장 공중화장실",
    lat: 37.5597,
    lng: 126.9770,
    address: "서울특별시 중구 남대문시장4길 21",
    isOpen: true,
  },
  {
    id: 4,
    name: "명동역 공중화장실",
    lat: 37.5614,
    lng: 126.9859,
    address: "서울특별시 중구 명동8가길 28",
    isOpen: false,
  },
  {
    id: 5,
    name: "시청역 공중화장실",
    lat: 37.5663,
    lng: 126.9779,
    address: "서울특별시 중구 세종대로 110",
    isOpen: true,
  },
  {
    id: 6,
    name: "종로3가역 공중화장실",
    lat: 37.5713,
    lng: 126.9910,
    address: "서울특별시 종로구 돈화문로 26",
    isOpen: true,
  },
];

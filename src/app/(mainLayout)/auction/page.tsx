import { AuctionProductGrid } from '@/components/auction';
import { LikeButton } from '@/components/auction/LikeButton';

// 더미 데이터는 서버에서 관리
const mockAuctionProducts = [
  // 경매 시작 전 (waiting)
  {
    auctionUuid: '1a1a1a1a-1111-1111-1111-111111111111',
    title: '에어팟 프로 2 블루투스 이어폰',
    minimumBid: 45000,
    startAt: '2025-06-12T16:00:00.000Z', // 오늘 오후 4시 시작
    endAt: '2025-06-13T16:00:00.000Z',
    status: 'waiting',
    viewCount: 156,
    thumbnailUrl: '/images/dummy/airpods.png',
    likes: 28,
    bidderCount: 0,
  },
  {
    auctionUuid: '2b2b2b2b-2222-2222-2222-222222222222',
    title: '아이폰 15 프로 맥스 (미개봉)',
    minimumBid: 1200000,
    startAt: '2025-06-13T09:00:00.000Z', // 내일 오전 9시 시작
    endAt: '2025-06-15T18:00:00.000Z',
    status: 'waiting',
    viewCount: 892,
    thumbnailUrl: '/images/dummy/airpods.png',
    likes: 124,
    bidderCount: 0,
  },
  {
    auctionUuid: '3c3c3c3c-3333-3333-3333-333333333333',
    title: '맥북 프로 M3 14인치',
    minimumBid: 1800000,
    startAt: '2025-06-14T10:30:00.000Z', // 모레 오전 10시 30분 시작
    endAt: '2025-06-16T20:00:00.000Z',
    status: 'waiting',
    viewCount: 445,
    thumbnailUrl: '/images/dummy/airpods.png',
    likes: 89,
    bidderCount: 0,
  },

  // 경매 진행 중 (active) - 24시간 미만
  {
    auctionUuid: '4d4d4d4d-4444-4444-4444-444444444444',
    title: '에스파 무선 이어폰',
    minimumBid: 215000,
    startAt: '2025-06-12T08:00:00.000Z',
    endAt: '2025-06-12T20:30:00.000Z', // 오늘 밤 8시 30분 종료
    status: 'active',
    viewCount: 298,
    thumbnailUrl: '/images/dummy/airpods.png',
    likes: 42,
    bidderCount: 25,
    bidAmount: 285000,
  },
  {
    auctionUuid: '5e5e5e5e-5555-5555-5555-555555555555',
    title: 'BTS 앨범 컬렉션',
    minimumBid: 180000,
    startAt: '2025-06-12T06:00:00.000Z',
    endAt: '2025-06-12T18:45:00.000Z', // 오늘 저녁 6시 45분 종료
    status: 'active',
    viewCount: 567,
    thumbnailUrl: '/images/dummy/airpods.png',
    likes: 89,
    bidderCount: 35,
    bidAmount: 320000,
  },
  {
    auctionUuid: '6f6f6f6f-6666-6666-6666-666666666666',
    title: '닌텐도 스위치 OLED',
    minimumBid: 280000,
    startAt: '2025-06-11T20:00:00.000Z',
    endAt: '2025-06-12T22:15:00.000Z', // 오늘 밤 10시 15분 종료
    status: 'active',
    viewCount: 334,
    thumbnailUrl: '/images/dummy/airpods.png',
    likes: 67,
    bidderCount: 18,
    bidAmount: 295000,
  },

  // 경매 진행 중 (active) - 24시간 이상
  {
    auctionUuid: '7g7g7g7g-7777-7777-7777-777777777777',
    title: '블랙핑크 사인 포스터 (진품)',
    minimumBid: 320000,
    startAt: '2025-06-12T09:00:00.000Z',
    endAt: '2025-06-15T18:20:00.000Z', // 3일 후 종료
    status: 'active',
    viewCount: 423,
    thumbnailUrl: '/images/dummy/airpods.png',
    likes: 56,
    bidderCount: 18,
    bidAmount: 450000,
  },
  {
    auctionUuid: '8h8h8h8h-8888-8888-8888-888888888888',
    title: '삼성 갤럭시 S24 울트라',
    minimumBid: 950000,
    startAt: '2025-06-12T07:00:00.000Z',
    endAt: '2025-06-14T15:30:00.000Z', // 2일 후 종료
    status: 'active',
    viewCount: 678,
    thumbnailUrl: '/images/dummy/airpods.png',
    likes: 134,
    bidderCount: 42,
    bidAmount: 1150000,
  },
  {
    auctionUuid: '9i9i9i9i-9999-9999-9999-999999999999',
    title: '로지텍 MX Master 3S 마우스',
    minimumBid: 85000,
    startAt: '2025-06-11T14:00:00.000Z',
    endAt: '2025-06-16T12:00:00.000Z', // 4일 후 종료
    status: 'active',
    viewCount: 234,
    thumbnailUrl: '/images/dummy/airpods.png',
    likes: 45,
    bidderCount: 12,
  },
  {
    auctionUuid: '10j10j10j-1010-1010-1010-101010101010',
    title: '아이패드 프로 12.9인치 M2',
    minimumBid: 1100000,
    startAt: '2025-06-12T11:00:00.000Z',
    endAt: '2025-06-17T20:00:00.000Z', // 5일 후 종료
    status: 'active',
    viewCount: 512,
    thumbnailUrl: '/images/dummy/airpods.png',
    likes: 98,
    bidderCount: 28,
    bidAmount: 1250000,
  },

  // 경매 종료 (ended)
  {
    auctionUuid: '11k11k11k-1111-1111-1111-111111111111',
    title: '소니 WH-1000XM5 헤드폰',
    minimumBid: 250000,
    startAt: '2025-06-10T10:00:00.000Z',
    endAt: '2025-06-12T10:00:00.000Z', // 오늘 오전 10시 종료
    status: 'ended',
    viewCount: 445,
    thumbnailUrl: '/images/dummy/airpods.png',
    likes: 78,
    bidderCount: 23,
    bidAmount: 340000,
  },
  {
    auctionUuid: '12l12l12l-1212-1212-1212-121212121212',
    title: '다이슨 V15 무선청소기',
    minimumBid: 450000,
    startAt: '2025-06-09T15:00:00.000Z',
    endAt: '2025-06-12T08:30:00.000Z', // 오늘 오전 8시 30분 종료
    status: 'ended',
    viewCount: 623,
    thumbnailUrl: '/images/dummy/airpods.png',
    likes: 112,
    bidderCount: 34,
    bidAmount: 520000,
  },
  {
    auctionUuid: '13m13m13m-1313-1313-1313-131313131313',
    title: '캐논 EOS R6 Mark II',
    minimumBid: 2200000,
    startAt: '2025-06-08T12:00:00.000Z',
    endAt: '2025-06-11T23:59:00.000Z', // 어제 밤 종료
    status: 'ended',
    viewCount: 789,
    thumbnailUrl: '/images/dummy/airpods.png',
    likes: 156,
    bidderCount: 45,
    bidAmount: 2650000,
  },

  // 추가 다양한 상품들
  {
    auctionUuid: '14n14n14n-1414-1414-1414-141414141414',
    title: '테슬라 모델 Y 휠캡 세트',
    minimumBid: 180000,
    startAt: '2025-06-12T13:00:00.000Z',
    endAt: '2025-06-13T19:00:00.000Z', // 내일 저녁 7시 종료
    status: 'active',
    viewCount: 267,
    thumbnailUrl: '/images/dummy/airpods.png',
    likes: 34,
    bidderCount: 8,
    bidAmount: 195000,
  },
  {
    auctionUuid: '15o15o15o-1515-1515-1515-151515151515',
    title: '루이비통 네버풀 MM',
    minimumBid: 850000,
    startAt: '2025-06-13T14:30:00.000Z', // 내일 오후 2시 30분 시작
    endAt: '2025-06-18T16:00:00.000Z',
    status: 'waiting',
    viewCount: 934,
    thumbnailUrl: '/images/dummy/airpods.png',
    likes: 203,
    bidderCount: 0,
  },
  {
    auctionUuid: '16p16p16p-1616-1616-1616-161616161616',
    title: '플레이스테이션 5 디지털 에디션',
    minimumBid: 420000,
    startAt: '2025-06-12T05:00:00.000Z',
    endAt: '2025-06-12T17:30:00.000Z', // 오늘 오후 5시 30분 종료
    status: 'active',
    viewCount: 1234,
    thumbnailUrl: '/images/dummy/airpods.png',
    likes: 287,
    bidderCount: 67,
    bidAmount: 580000,
  },
  {
    auctionUuid: '17q17q17q-1717-1717-1717-171717171717',
    title: '애플 워치 울트라 2',
    minimumBid: 650000,
    startAt: '2025-06-12T12:00:00.000Z',
    endAt: '2025-06-19T14:00:00.000Z', // 일주일 후 종료
    status: 'active',
    viewCount: 456,
    thumbnailUrl: '/images/dummy/airpods.png',
    likes: 89,
    bidderCount: 21,
    bidAmount: 720000,
  },
  {
    auctionUuid: '18r18r18r-1818-1818-1818-181818181818',
    title: '보스 QuietComfort 45',
    minimumBid: 180000,
    startAt: '2025-06-11T16:00:00.000Z',
    endAt: '2025-06-12T11:45:00.000Z', // 오늘 오전 11시 45분 종료
    status: 'ended',
    viewCount: 345,
    thumbnailUrl: '/images/dummy/airpods.png',
    likes: 67,
    bidderCount: 19,
    bidAmount: 210000,
  },
  {
    auctionUuid: '19s19s19s-1919-1919-1919-191919191919',
    title: '마이크로소프트 서피스 프로 9',
    minimumBid: 890000,
    startAt: '2025-06-15T11:00:00.000Z', // 3일 후 시작
    endAt: '2025-06-20T15:00:00.000Z',
    status: 'waiting',
    viewCount: 234,
    thumbnailUrl: '/images/dummy/airpods.png',
    likes: 45,
    bidderCount: 0,
  },
  {
    auctionUuid: '20t20t20t-2020-2020-2020-202020202020',
    title: '샤넬 클래식 플랩백 미디움',
    minimumBid: 3500000,
    startAt: '2025-06-12T10:00:00.000Z',
    endAt: '2025-06-22T18:00:00.000Z', // 10일 후 종료
    status: 'active',
    viewCount: 1567,
    thumbnailUrl: '/images/dummy/airpods.png',
    likes: 456,
    bidderCount: 89,
    bidAmount: 4200000,
  },
];

export default async function AuctionPage() {
  return (
    <div className='container mx-auto px-4 py-6'>
      {/* 필터링 영역 추가 예정 */}
      <AuctionProductGrid
        products={mockAuctionProducts}
        LikeButtonComponent={LikeButton}
      />
    </div>
  );
}

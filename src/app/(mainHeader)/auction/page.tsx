'use client';
import { AuctionProductGrid } from '@/components/auction';

const mockAuctionProducts = [
  {
    id: '1',
    title: '에어팟 프로 2 블루투스 이어폰',
    currentPrice: 45000,
    imageUrl: '/images/dummy/airpods.png',
    timeLeft: {
      days: 2,
      hours: 3,
      minutes: 12,
      seconds: 36,
    },
    participants: 12,
    likes: 28,
    views: 156,
    tags: ['NCT', '굿즈'],
  },
  {
    id: '2',
    title: '에스파 무선 이어폰',
    currentPrice: 215000,
    imageUrl: '/images/dummy/airpods.png',
    timeLeft: {
      days: 1,
      hours: 5,
      minutes: 30,
      seconds: 15,
    },
    participants: 25,
    likes: 42,
    views: 298,
    tags: ['에스파', '도쿄'],
  },
  {
    id: '3',
    title: 'BTS 앨범 컬렉션 ',
    currentPrice: 180000,
    imageUrl: '/images/dummy/airpods.png',
    timeLeft: {
      days: 0,
      hours: 23,
      minutes: 45,
      seconds: 22,
    },
    participants: 35,
    likes: 89,
    views: 567,
    tags: ['BTS', '앨범'],
  },
  {
    id: '4',
    title: '블랙핑크 사인 포스터 (진품)',
    currentPrice: 320000,
    imageUrl: '/images/dummy/airpods.png',
    timeLeft: {
      days: 3,
      hours: 8,
      minutes: 20,
      seconds: 5,
    },
    participants: 18,
    likes: 56,
    views: 423,
    tags: ['블핑', '사인'],
  },
];

export default function AuctionPage() {
  const handleLike = (id: string) => {
    console.log('좋아요:', id);
  };

  const handleBid = (id: string) => {
    console.log('입찰:', id);
  };

  return (
    <div className='container mx-auto px-4 py-6'>
      {/* 필터링 영역 추가 예정 */}

      <AuctionProductGrid
        products={mockAuctionProducts}
        onLike={handleLike}
        onBid={handleBid}
      />
    </div>
  );
}

import { AuctionProductCard } from './AuctionProductCard';
import { cn } from '@/libs/cn';

interface AuctionProduct {
  auctionUuid: string;
  title: string;
  minimumBid: number;
  startAt: string;
  endAt: string;
  status: string;
  viewCount: number;
  thumbnailUrl: string;
  likes: number;
  bidderCount: number;
  bidAmount?: number; // 현재 입찰가 (없으면 minimumBid와 동일)
}

interface AuctionProductGridProps {
  products: AuctionProduct[];
  LikeButtonComponent: React.ComponentType<{
    auctionUuid: string;
    onLike?: (auctionUuid: string) => void;
  }>;
  onLike?: (auctionUuid: string) => void;
  className?: string;
}

export function AuctionProductGrid({
  products,
  LikeButtonComponent,
  onLike,
  className,
}: AuctionProductGridProps) {
  if (products.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
          경매 상품이 없습니다
        </h3>
        <p className='text-sm text-gray-500'>
          새로운 경매 상품이 등록되면 여기에 표시됩니다.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-2 gap-3', className)}>
      {products.map((product) => (
        <AuctionProductCard
          key={product.auctionUuid}
          {...product}
          LikeButtonComponent={LikeButtonComponent}
          onLike={onLike}
        />
      ))}
    </div>
  );
}

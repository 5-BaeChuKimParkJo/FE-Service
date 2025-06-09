import { AuctionProductCard } from './AuctionProductCard';
import { cn } from '@/libs/cn';

interface AuctionProduct {
  id: string;
  title: string;
  currentPrice: number;
  imageUrl: string;
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
  };
  participants: number;
  likes: number;
  views: number;
}

interface AuctionProductGridProps {
  products: AuctionProduct[];
  onLike?: (id: string) => void;
  onBid?: (id: string) => void;
  className?: string;
}

export function AuctionProductGrid({
  products,
  onLike,
  onBid,
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
    <div
      className={cn(
        'grid grid-cols-2 gap-3',
        'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
        className,
      )}
    >
      {products.map((product) => (
        <AuctionProductCard
          key={product.id}
          {...product}
          onLike={onLike}
          onBid={onBid}
        />
      ))}
    </div>
  );
}

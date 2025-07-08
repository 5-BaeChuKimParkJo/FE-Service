import { Suspense } from 'react';
import { MySalesContent, MySalesContentSkeleton } from '@/components/mypage';
import { getMyAuctions } from '@/actions/auction-service';
import { AuctionHistory } from '@/types/auction';

export default async function MySalesPage() {
  const auctions = await getMyAuctions();
  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold text-gray-700 mb-4 ml-3'>
        판매한 상품 : {auctions.length}개
      </h1>

      <Suspense fallback={<MySalesContentSkeleton />}>
        <MySalesContentWrapper auctions={auctions} />
      </Suspense>
    </div>
  );
}

async function MySalesContentWrapper({
  auctions,
}: {
  auctions: AuctionHistory[];
}) {
  return <MySalesContent auctions={auctions} />;
}

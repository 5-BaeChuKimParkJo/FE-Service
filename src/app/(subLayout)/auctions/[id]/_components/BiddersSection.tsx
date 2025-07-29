import { AuctionBidders } from '@/types/auction';
import { BidderList } from './_bidder-section/BidderList';

export function BiddersSection({ bidders }: { bidders: AuctionBidders[] }) {
  return (
    <section className='px-2 py-5 mx-4 my-5 bg-white rounded-lg '>
      <h2 className='border-b border-primary-200 pb-2 text-xl font-semibold text-center text-primary-100 mb-4'>
        입찰 현황
      </h2>
      <p className='text-sm text-gray-500 mb-5 text-center'>
        상위 10명의 입찰자까지 확인 가능합니다.
      </p>
      <p className='text-2xl text-primary-100 pl-3 font-semibold mb-4'>
        상위 입찰자
      </p>
      {bidders.length > 0 ? (
        <BidderList bidders={bidders} />
      ) : (
        <p className='text-sm text-gray-500 mb-5  pl-5'>
          현재 입찰자가 없습니다.
        </p>
      )}
    </section>
  );
}

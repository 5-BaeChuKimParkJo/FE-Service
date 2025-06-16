import { AuctionBidders } from '@/types/auction';
import Image from 'next/image';
import { formatNumber } from '@/utils/format';
import { formatDate } from '@/utils/date';
import { getMemberInfo } from '@/actions/member-service';
import { isErrorResponse } from '@/utils/type-guards';

export async function BidderCard({ bidder }: { bidder: AuctionBidders }) {
  const memberInfo = await getMemberInfo(bidder.bidderUuid);

  if (isErrorResponse(memberInfo)) {
    return <div>Error</div>;
  }

  return (
    <div className='flex items-center gap-4 p-4 '>
      <div className='relative w-12 h-12 overflow-hidden rounded-full'>
        <Image
          src={memberInfo.profileImageUrl || '/images/default-profile.png'}
          alt={memberInfo.nickname}
          fill
          className='object-cover'
        />
      </div>
      <div className='flex-1'>
        <div className='flex items-center justify-between'>
          <span className='text-lg font-semibold'>{memberInfo.nickname}</span>
          <span className='text-lg font-bold text-primary'>
            {formatNumber(bidder.bidAmount)}원
          </span>
        </div>
        <div className='text-sm text-gray-500'>
          {formatDate(bidder.createdAt)}
        </div>
      </div>
    </div>
  );
}

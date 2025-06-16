import { AuctionBidders } from '@/types/auction';
import { BidderCard } from './BidderCard';

export function BidderList({ bidders }: { bidders: AuctionBidders[] }) {
  console.log(bidders);

  return (
    <ul>
      {bidders.map((bidder) => (
        <li key={bidder.bidderUuid + bidder.bidAmount}>
          <BidderCard bidder={bidder} />
        </li>
      ))}
    </ul>
  );
}

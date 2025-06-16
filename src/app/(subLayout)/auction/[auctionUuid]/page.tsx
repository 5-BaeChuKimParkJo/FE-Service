import { getAuctionBidders, getAuctionDetail } from '@/actions/auction-service';
import { BiddersSection } from '@/components/auction/detail';
import { BidderForm } from '@/components/auction/detail/BidderForm';
import { ItemImages } from '@/components/images';
import { ItemDescriptionSection, ItemInfoSection } from '@/components/items';
import { isErrorResponse } from '@/utils/type-guards';

export default async function AuctionPage({
  params,
}: {
  params: Promise<{ auctionUuid: string }>;
}) {
  const { auctionUuid } = await params;

  const auction = await getAuctionDetail(auctionUuid);
  const bidders = await getAuctionBidders(auctionUuid);

  if (isErrorResponse(auction) || isErrorResponse(bidders)) {
    return <div>Auction not found</div>;
  }

  return (
    <main className='min-h-screen flex flex-col'>
      <ItemImages images={auction.images} />
      <ItemInfoSection auction={auction} />
      <ItemDescriptionSection description={auction.description} />
      <BiddersSection bidders={bidders.items} />
      <BidderForm
        auctionUuid={auctionUuid}
        bidAmount={auction.bidAmount || auction.minimumBid}
        status={auction.status}
      />
    </main>
  );
}

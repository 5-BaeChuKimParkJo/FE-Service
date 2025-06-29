import { getAuctionBidders, getAuctionDetail } from '@/actions/auction-service';
import { getMemberInfo } from '@/actions/member-service';
import { BiddersSection } from '@/components/auction/detail';
import { BidderForm } from '@/components/auction/detail/BidderForm';
import { ItemImages } from '@/components/images';
import { ItemDescriptionSection, ItemInfoSection } from '@/components/items';
import { isErrorResponse } from '@/utils/type-guards';

export default async function AuctionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const auction = await getAuctionDetail(id);
  const bidders = await getAuctionBidders(id);
  console.log(auction);

  if (isErrorResponse(auction) || isErrorResponse(bidders)) {
    return <div>Auction not found</div>;
  }
  if (isErrorResponse(bidders)) {
    return <div>Bidders not found</div>;
  }

  const memberInfo = await getMemberInfo(auction.seller.memberUuid);
  if (isErrorResponse(memberInfo)) {
    return <div>Member not found</div>;
  }

  return (
    <main className='min-h-screen flex flex-col'>
      <ItemImages images={auction.images} />
      <ItemInfoSection auction={auction} />
      <ItemDescriptionSection description={auction.description} />
      <BiddersSection bidders={bidders.items} />
      <BidderForm
        auctionUuid={id}
        bidAmount={
          bidders.items.length > 0
            ? bidders.items[0].bidAmount
            : auction.minimumBid
        }
        status={auction.status}
      />
    </main>
  );
}

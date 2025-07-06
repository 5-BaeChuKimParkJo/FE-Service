import { getAuctionBidders, getAuctionDetail } from '@/actions/auction-service';
import { getMemberInfo } from '@/actions/member-service';
import { BiddersSection, AuctionTags } from '@/components/auction/detail';
import { BidderForm } from '@/components/auction/detail/BidderForm';
import { ItemImages } from '@/components/images';
import {
  AuctionTimer,
  ItemDescriptionSection,
  ItemInfoSection,
} from '@/components/items';
import ErrorText from '@/components/ui/error-text';
import { isErrorResponse } from '@/utils/type-guards';

export default async function AuctionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const auction = await getAuctionDetail(id);
  const bidders = await getAuctionBidders(id);

  if (isErrorResponse(auction) || isErrorResponse(bidders)) {
    return <ErrorText>Auction not found</ErrorText>;
  }
  if (isErrorResponse(bidders)) {
    return <div>Bidders not found</div>;
  }

  const memberInfo = await getMemberInfo(auction.seller.memberUuid);
  if (isErrorResponse(memberInfo)) {
    return <div>Member not found</div>;
  }

  const images = auction.images.map((image) => ({
    imageId: image.auctionImageId,
    url: image.url,
    order: image.order,
  }));

  return (
    <>
      <main className='min-h-screen flex flex-col'>
        <ItemImages images={images} />
        <ItemInfoSection auction={auction} />
        <div className=' px-4'>
          <AuctionTimer startAt={auction.startAt} endAt={auction.endAt} />
        </div>
        <ItemDescriptionSection description={auction.description} />
        <AuctionTags tags={auction.tags} />
        <BiddersSection bidders={bidders.items} />
      </main>
      <BidderForm
        auctionUuid={id}
        bidAmount={
          bidders.items.length > 0
            ? bidders.items[0].bidAmount
            : auction.minimumBid
        }
        status={auction.status}
      />
    </>
  );
}

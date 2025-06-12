import { getAuctionBidders, getAuctionDetail } from '@/actions/auction-service';
import { ItemImages } from '@/components/images';
import { ItemInfoSection } from '@/components/items';
import { isErrorResponse } from '@/utils/type-guards';
import React from 'react';

export default async function AuctionPage({
  params,
}: {
  params: Promise<{ auctionUuid: string }>;
}) {
  const { auctionUuid } = await params;

  const auction = await getAuctionDetail(auctionUuid);
  const bidders = await getAuctionBidders(auctionUuid);

  console.log('bidders : ', bidders);
  if (isErrorResponse(auction)) {
    return <div>Auction not found</div>;
  }

  return (
    <main className='min-h-screen flex flex-col'>
      <ItemImages images={auction.images} />
      <ItemInfoSection />
    </main>
  );
}

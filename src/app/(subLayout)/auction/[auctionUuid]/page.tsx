import { getAuctionDetail } from '@/actions/auction-service/get-auction-detail';
import { ItemImages } from '@/components/images';
import React from 'react';

export default async function AuctionPage({
  params,
}: {
  params: Promise<{ auctionUuid: string }>;
}) {
  const { auctionUuid } = await params;
  console.log(auctionUuid);
  const auction = await getAuctionDetail(auctionUuid);
  console.log(auction.images);

  return (
    <main className='min-h-screen flex'>
      <ItemImages images={auction.images} />
    </main>
  );
}

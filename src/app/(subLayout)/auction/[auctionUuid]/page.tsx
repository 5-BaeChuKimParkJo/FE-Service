// import { getAuctionDetail } from '@/actions/auction-service/get-auction-detail';
import React from 'react';

export default async function AuctionPage({
  params,
}: {
  params: Promise<{ auctionUuid: string }>;
}) {
  const { auctionUuid } = await params;
  console.log(auctionUuid);
  // const auction = await getAuctionDetail(auctionUuid);

  return <main className='min-h-screen bg-gray-50'></main>;
}

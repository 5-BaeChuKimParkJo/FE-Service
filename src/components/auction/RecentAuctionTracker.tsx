'use client';
import { useEffect } from 'react';
import { storeRecentlyViewedAuction } from '@/utils/recently-viewed-auctions';

interface RecentAuctionTrackerProps {
  auctionUuid: string;
  title: string;
  minimumBid: number;
  thumbnailUrl?: string;
}

export default function RecentAuctionTracker({
  auctionUuid,
  title,
  minimumBid,
  thumbnailUrl,
}: RecentAuctionTrackerProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      storeRecentlyViewedAuction(auctionUuid, title, minimumBid, thumbnailUrl);
    }, 1500);

    return () => clearTimeout(timer);
  }, [auctionUuid, title, minimumBid, thumbnailUrl]);

  return null;
}

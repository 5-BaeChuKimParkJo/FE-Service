'use client';

import { useEffect } from 'react';
import { trackAuctionView } from '@/actions/auction-service/track-auction-view';

export default function AuctionViewTracker({
  auctionUuid,
}: {
  auctionUuid: string;
}) {
  useEffect(() => {
    // Cleanup cancels the first Strict Mode effect without suppressing revisits.
    const timer = setTimeout(() => {
      void trackAuctionView(auctionUuid).catch(() => undefined);
    }, 0);
    return () => clearTimeout(timer);
  }, [auctionUuid]);

  return null;
}

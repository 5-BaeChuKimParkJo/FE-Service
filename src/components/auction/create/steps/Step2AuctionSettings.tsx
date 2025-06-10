'use client';

import {
  MinimumBidInput,
  AuctionStartTimeSelector,
  AuctionDurationSelector,
  DirectDealSettings,
} from '../form';

export function Step2AuctionSettings() {
  return (
    <main className='flex-1 overflow-y-auto p-4 pb-20'>
      <div className='max-w-2xl mx-auto space-y-6'>
        <MinimumBidInput animationDelay={0.1} />
        <AuctionStartTimeSelector animationDelay={0.2} />
        <AuctionDurationSelector animationDelay={0.3} />
        <DirectDealSettings animationDelay={0.4} />
      </div>
    </main>
  );
}

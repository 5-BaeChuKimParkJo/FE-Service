'use client';
import { BidderForm } from '@/components/auction/detail/BidderForm';

export default function BidderFormTestPage() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-50'>
      <h1 className='text-2xl font-bold mb-8'>BidderForm 테스트</h1>
      <div className='w-full max-w-md'>
        <BidderForm
          auctionUuid='test-auction'
          bidAmount={100000}
          status='active'
        />
      </div>
    </div>
  );
}

export function AuctionProductCardSkeleton() {
  return (
    <div className='bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse'>
      <div className='relative aspect-square bg-gray-300'>
        <div className='absolute inset-0 bg-gray-300'></div>
        <div className='absolute top-2 right-2 w-8 h-8 bg-gray-300 rounded-full'></div>
      </div>

      <div className='p-3 space-y-2'>
        <div className='h-4 bg-gray-300 rounded w-3/4'></div>

        <div className='space-y-1'>
          <div className='h-3 bg-gray-300 rounded w-1/2'></div>
          <div className='h-5 bg-gray-300 rounded w-2/3'></div>
        </div>

        <div className='h-3 bg-gray-300 rounded w-1/3'></div>

        <div className='flex justify-between pt-1'>
          <div className='flex gap-2'>
            <div className='h-3 bg-gray-300 rounded w-12'></div>
            <div className='h-3 bg-gray-300 rounded w-12'></div>
          </div>
          <div className='h-3 bg-gray-300 rounded w-8'></div>
        </div>
      </div>
    </div>
  );
}

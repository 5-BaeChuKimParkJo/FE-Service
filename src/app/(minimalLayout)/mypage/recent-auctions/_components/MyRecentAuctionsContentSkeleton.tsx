export function MyRecentAuctionsContentSkeleton() {
  return (
    <div className='space-y-4'>
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className='bg-white border border-gray-200 rounded-lg p-4 animate-pulse'
        >
          <div className='flex gap-4'>
            <div className='w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0'></div>

            <div className='flex-1 space-y-2'>
              <div className='flex items-start justify-between'>
                <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                <div className='h-6 bg-gray-200 rounded-full w-16'></div>
              </div>

              <div className='space-y-1'>
                <div className='flex justify-between'>
                  <div className='h-3 bg-gray-200 rounded w-12'></div>
                  <div className='h-3 bg-gray-200 rounded w-20'></div>
                </div>
                <div className='flex justify-between'>
                  <div className='h-3 bg-gray-200 rounded w-12'></div>
                  <div className='h-3 bg-gray-200 rounded w-16'></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

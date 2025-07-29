export const DealInfo = ({
  isDirectDeal,
  location,
}: {
  isDirectDeal: boolean;
  location?: string | null;
}) => (
  <div className='flex items-center text-sm text-gray-700'>
    <span className='text-gray-500'>거래방식</span>
    <span className='ml-4 font-semibold'>
      {isDirectDeal && location ? `택배, 직거래 (${location})` : '택배'}
    </span>
  </div>
);

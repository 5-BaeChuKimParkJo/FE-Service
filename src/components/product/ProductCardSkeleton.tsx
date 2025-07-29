export default function ProductCardSkeleton() {
  return (
    <div className='bg-white rounded-lg shadow-sm animate-pulse'>
      {/* 이미지 스켈레톤 */}
      <div className='relative aspect-square bg-gray-200 rounded-t-lg'></div>

      {/* 내용 스켈레톤 */}
      <div className='p-3'>
        {/* 제목 스켈레톤 */}
        <div className='space-y-2 mb-2'>
          <div className='h-3 bg-gray-200 rounded w-3/4'></div>
          <div className='h-3 bg-gray-200 rounded w-1/2'></div>
        </div>

        {/* 가격 스켈레톤 */}
        <div className='h-5 bg-gray-200 rounded w-1/2 mb-2'></div>

        {/* 조회수/좋아요 스켈레톤 */}
        <div className='flex justify-between'>
          <div className='h-3 bg-gray-200 rounded w-12'></div>
          <div className='h-3 bg-gray-200 rounded w-8'></div>
        </div>
      </div>
    </div>
  );
}

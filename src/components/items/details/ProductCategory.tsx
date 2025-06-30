export const ProductCategory = ({ category }: { category: string }) => (
  <div className='flex items-center text-sm text-gray-700'>
    <span className='text-gray-500'>카테고리</span>
    <div className='ml-4 flex items-center font-semibold'>
      <span>{category}</span>
    </div>
  </div>
);

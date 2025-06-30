export type ProductConditionType = 'unopened' | 'new' | 'used';

export const ProductCondition = ({
  condition,
}: {
  condition: ProductConditionType;
}) => {
  const conditionText = {
    unopened: '미개봉 새상품',
    new: '새상품',
    used: '중고상품',
  };

  return (
    <div className='flex items-center text-sm text-gray-700'>
      <span className='text-gray-500'>상품상태</span>
      <span className='ml-4 font-semibold'>{conditionText[condition]}</span>
    </div>
  );
};

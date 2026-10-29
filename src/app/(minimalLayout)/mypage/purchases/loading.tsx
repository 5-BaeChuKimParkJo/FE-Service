import { MyPurchasesContentSkeleton } from './_components/MyPurchasesContentSkeleton';

export default function MyPurchasesLoading() {
  return (
    <div className='p-4' aria-label='거래 내역 불러오는 중'>
      <MyPurchasesContentSkeleton />
    </div>
  );
}

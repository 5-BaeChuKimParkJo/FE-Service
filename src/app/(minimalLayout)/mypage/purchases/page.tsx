import { getMyBidHistory } from '@/actions/auction-service';
import { MyPurchasesContent } from './_components/MyPurchasesContent';

export default async function MyPurchasesPage() {
  const bidHistory = await getMyBidHistory();

  return (
    <div className='p-4'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>참여한 거래</h1>
        <p className='text-sm leading-6 text-gray-500'>
          참여한 경매와 내 입찰 기록을 한곳에서 확인하세요.
        </p>
      </div>

      <MyPurchasesContent bidHistory={bidHistory} />
    </div>
  );
}

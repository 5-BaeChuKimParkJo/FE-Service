import { getSellerDemoAvailability } from '@/actions/auction-service/seller-demo';
import { defaultMySalesQuery, mySalesUrl } from '@/libs/mySales';
import { PrepareSellerDemoButton } from './PrepareSellerDemoButton';
export async function SellerDemoPreparation() {
  const result = await getSellerDemoAvailability();
  if (!result.ok)
    return (
      <section
        role='alert'
        aria-label='판매자 데모 준비 상태'
        className='rounded-xl border border-gray-200 bg-white p-4'
      >
        <h2 className='font-semibold'>데모 준비 상태를 확인하지 못했습니다</h2>
        <p className='mt-2 text-sm leading-6 text-gray-500'>
          {result.error.message}
        </p>
        <a
          href={mySalesUrl(defaultMySalesQuery)}
          className='mt-2 inline-flex min-h-11 items-center text-sm font-medium underline'
        >
          다시 확인
        </a>
      </section>
    );
  if (!result.available) return null;
  return (
    <section
      aria-labelledby='seller-demo-heading'
      className='rounded-xl border border-primary-100 bg-white p-4 sm:p-5'
    >
      <h2 id='seller-demo-heading' className='font-semibold text-gray-900'>
        판매자 데모 체험
      </h2>
      <p className='mt-2 text-sm leading-6 text-gray-600'>
        대기 데모를 준비하고 수정·취소를 체험하세요. 사용할 수 있는 데모가
        있으면 그대로 이어집니다.
      </p>
      <PrepareSellerDemoButton />
      <p className='mt-3 text-xs leading-5 text-gray-500'>
        새 데모 생성은 1분 간격입니다. 기존 경매와 거래 기록은 유지됩니다.
      </p>
    </section>
  );
}

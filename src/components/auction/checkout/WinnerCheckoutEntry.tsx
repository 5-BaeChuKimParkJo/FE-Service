import Link from 'next/link';
import { CreditCard } from 'lucide-react';
import { getCheckout } from '@/actions/auction-service/checkout';
import { Button } from '@/components/ui/button';
import { checkoutPhase, showCheckoutEntry } from '@/libs/checkout';

export async function WinnerCheckoutEntry({
  auctionUuid,
  status,
}: {
  auctionUuid: string;
  status: string;
}) {
  if (status !== 'ended') return null;
  const result = await getCheckout(auctionUuid);
  if (!result.ok || !showCheckoutEntry(status, result.view)) return null;
  const phase = checkoutPhase(result.view);
  const label =
    phase === 'pending'
      ? '결제 상태 확인'
      : result.view.purchase
        ? '결제 내역 보기'
        : '낙찰 상품 테스트 결제';
  return (
    <section className='border-t bg-white px-4 py-5' aria-label='낙찰자 결제'>
      <Button asChild className='w-full rounded-lg' size='xl'>
        <Link
          href={`/auctions/${encodeURIComponent(auctionUuid)}/checkout`}
          prefetch={false}
        >
          <CreditCard aria-hidden='true' />
          {label}
        </Link>
      </Button>
    </section>
  );
}

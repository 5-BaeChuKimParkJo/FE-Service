import { getCheckout } from '@/actions/auction-service/checkout';
import { CheckoutClient } from '@/components/auction/checkout/CheckoutClient';
import { parseCheckoutReturn } from '@/libs/checkout';
import type { CheckoutReturnQuery } from '@/types/auction/checkout';

export default async function CheckoutSuccessPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<CheckoutReturnQuery> }) {
  const { id } = await params;
  const confirmation = parseCheckoutReturn(await searchParams);
  return <CheckoutClient key={`${id}-success`} auctionUuid={id} initial={await getCheckout(id)} mode='success' confirmation={confirmation} />;
}

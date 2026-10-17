import { getCheckout } from '@/actions/auction-service/checkout';
import { CheckoutClient } from '@/components/auction/checkout/CheckoutClient';

export default async function CheckoutFailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CheckoutClient key={`${id}-fail`} auctionUuid={id} initial={await getCheckout(id)} mode='fail' />;
}

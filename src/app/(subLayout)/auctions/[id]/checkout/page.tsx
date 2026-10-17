import { getCheckout } from '@/actions/auction-service/checkout';
import { CheckoutClient } from '@/components/auction/checkout/CheckoutClient';

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CheckoutClient key={id} auctionUuid={id} initial={await getCheckout(id)} />;
}

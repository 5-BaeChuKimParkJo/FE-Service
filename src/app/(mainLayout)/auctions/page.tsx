import { getCategories } from '@/actions/category-service/get-categories';
import AuctionContent from './AuctionContent';

export default async function AuctionPage() {
  const categories = await getCategories();

  return <AuctionContent categories={categories} />;
}

import { getCategories } from '@/actions/category-service/get-categories';
import ProductContent from './ProductContent';

export default async function ProductsPage() {
  const categories = await getCategories();

  return <ProductContent categories={categories} />;
}

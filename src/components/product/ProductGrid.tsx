import { SearchProductItemType } from '@/types/product/search-product-type';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Array<{
    product: SearchProductItemType;
  }>;
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className={`grid grid-cols-2 gap-2`}>
      {products.map((product) => (
        <ProductCard
          key={product.product.productUuid}
          product={product.product}
        />
      ))}
    </div>
  );
}

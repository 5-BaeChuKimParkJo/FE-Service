import { getProductDetail } from '@/actions/product-service/get-product-detail';
import { ItemImages } from '@/components/images';
import { ItemDescriptionSection, ProductInfoSection } from '@/components/items';
import { ChatButtonSection } from '@/components/product/ChatButtonSection';
import ErrorText from '@/components/ui/error-text';
import { isErrorResponse } from '@/utils/type-guards';

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const product = await getProductDetail(id);
  console.log(product);
  if (isErrorResponse(product)) {
    return <ErrorText>Product not found</ErrorText>;
  }
  const images = product.imageUrlList.map((image) => ({
    imageId: image.productImageId,
    url: image.url,
    order: image.order,
  }));
  return (
    <>
      <main className='min-h-screen flex flex-col pb-20'>
        <ItemImages images={images} />
        <ProductInfoSection product={product} />
        <ItemDescriptionSection description={product.description} />
      </main>
      <ChatButtonSection
        productUuid={product.productUuid}
        sellerUuid={product.seller.memberUuid}
      />
    </>
  );
}

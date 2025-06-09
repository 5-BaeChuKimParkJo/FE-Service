import { ProductImageUploader } from '@/components/images';
import {
  ProductTitleInput,
  ProductCategorySelector,
  ProductDescriptionInput,
} from '../form';

export function Step1ProductDetails() {
  return (
    <article className='flex-1 overflow-y-auto p-4 pb-20'>
      <div className='max-w-2xl mx-auto space-y-6'>
        <ProductTitleInput />

        <ProductCategorySelector />

        <ProductImageUploader />

        <ProductDescriptionInput />
      </div>
    </article>
  );
}

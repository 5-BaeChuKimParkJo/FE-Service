import { ProductImageUploader } from '@/components/images';
import {
  ProductTitleInput,
  ProductCategorySelector,
  ProductDescriptionInput,
  ProductConditionSelector,
} from '../form';
import { useCreateAuctionStore } from '@/stores/use-create-auction-store';
import { TagInput } from '@/components/auction/create';

export function Step1ProductDetails() {
  const { title, setTitle } = useCreateAuctionStore();
  const { productCondition, setProductCondition } = useCreateAuctionStore();
  const { categoryId, setCategoryId } = useCreateAuctionStore();
  const { description, setDescription } = useCreateAuctionStore();
  const { tags, setTags, tagIds, setTagIds } = useCreateAuctionStore();

  // tagIds가 undefined/null이면 항상 빈 배열로 세팅
  if (!Array.isArray(tagIds)) {
    setTagIds([]);
  }

  return (
    <article className='flex-1 overflow-y-auto p-4 '>
      <div className='max-w-2xl mx-auto space-y-6'>
        <ProductTitleInput value={title} onChange={setTitle} />
        <ProductConditionSelector
          productCondition={productCondition}
          setProductCondition={setProductCondition}
        />
        <ProductCategorySelector
          categoryId={categoryId}
          setCategoryId={setCategoryId}
        />
        <ProductImageUploader />
        <ProductDescriptionInput
          value={description}
          onChange={setDescription}
        />
        <TagInput
          tags={tags}
          setTags={setTags}
          tagIds={tagIds}
          setTagIds={setTagIds}
        />
      </div>
    </article>
  );
}

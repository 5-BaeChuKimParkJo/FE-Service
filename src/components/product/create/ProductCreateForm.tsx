'use client';
import { useReducer, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  ProductCategorySelector,
  ProductConditionSelector,
  ProductDescriptionInput,
  ProductTitleInput,
} from '@/components/auction/create/form/';
import { TagInput } from '@/components/auction/create/TagInput';
import { ProductPriceInput } from '@/components/product/ProductPriceInput';
import { ProductImageUploaderForProduct } from '@/components/images/ProductImageUploaderForProduct';
import { DirectDealSettings } from './DirectDealSettings';
import { createProduct } from '@/actions/product-service/create-product';
import { CreateProductRequest } from '@/types/product';
import { ProductLoading, ProductSuccessDialog } from '@/components/common/';
import { uploadProductImages } from '@/actions/image-service/upload-product-images';
import { initialState, productFormReducer } from './reducer';
import { convertProductCondition, validateProductForm } from './utils';

export function ProductCreateForm() {
  const [state, dispatch] = useReducer(productFormReducer, initialState);
  const [tagIds, setTagIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdProductTitle, setCreatedProductTitle] = useState<string>('');
  const [createdProductUuid, setCreatedProductUuid] = useState<string>('');
  const router = useRouter();

  const isValid = validateProductForm(state);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsLoading(true);
    try {
      const files = state.images.map((img: { file: File }) => img.file);
      const uploadedImages = await uploadProductImages(files);

      const request: CreateProductRequest = {
        title: state.title,
        productCondition: convertProductCondition(state.productCondition),
        categoryId: String(state.categoryId!),
        description: state.description,
        price: Number(state.price.replace(/,/g, '')),
        imageList: uploadedImages,
        tagIdList: tagIds,
        isDirectDeal: state.isDirectDeal,
        directDealLocation: state.directDealLocation,
      };

      const result = await createProduct(request);

      if ('productUuid' in result) {
        setCreatedProductTitle(state.title);
        setCreatedProductUuid(result.productUuid);
        setIsSuccess(true);
      } else {
        throw new Error('상품 등록에 실패했습니다.');
      }
    } catch (error) {
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToDetail = () => {
    router.replace(`/products/${createdProductUuid}`);
  };

  const handleCloseSuccess = () => {
    setIsSuccess(false);
    router.push('/');
  };

  return (
    <>
      <form onSubmit={handleSubmit} className='min-h-screen flex flex-col '>
        <div className='max-w-2xl mx-auto w-full flex-1 overflow-y-auto p-4 space-y-6'>
          <ProductTitleInput
            value={state.title}
            onChange={(v) =>
              dispatch({ type: 'SET_FIELD', field: 'title', value: v })
            }
          />
          <ProductConditionSelector
            productCondition={state.productCondition}
            setProductCondition={(v) =>
              dispatch({
                type: 'SET_FIELD',
                field: 'productCondition',
                value: v,
              })
            }
          />
          <ProductCategorySelector
            categoryId={state.categoryId}
            setCategoryId={(v) =>
              dispatch({ type: 'SET_FIELD', field: 'categoryId', value: v })
            }
          />
          <ProductDescriptionInput
            value={state.description}
            onChange={(v) =>
              dispatch({ type: 'SET_FIELD', field: 'description', value: v })
            }
          />
          <TagInput
            tags={state.tags}
            setTags={(tags) =>
              dispatch({ type: 'SET_FIELD', field: 'tags', value: tags })
            }
            tagIds={tagIds}
            setTagIds={setTagIds}
          />
          <ProductPriceInput
            value={state.price}
            onChange={(v) =>
              dispatch({ type: 'SET_FIELD', field: 'price', value: v })
            }
          />

          <ProductImageUploaderForProduct
            images={state.images}
            setImages={(imgs) => dispatch({ type: 'SET_IMAGES', images: imgs })}
            addImage={(image) => dispatch({ type: 'ADD_IMAGE', image })}
            removeImage={(idx) => dispatch({ type: 'REMOVE_IMAGE', idx })}
          />

          <DirectDealSettings
            isDirectDeal={state.isDirectDeal}
            directDealLocation={state.directDealLocation}
            onDirectDealChange={(v: boolean) =>
              dispatch({ type: 'SET_FIELD', field: 'isDirectDeal', value: v })
            }
            onLocationChange={(v: string) =>
              dispatch({
                type: 'SET_FIELD',
                field: 'directDealLocation',
                value: v,
              })
            }
          />
        </div>
        <div className='max-w-2xl mx-auto w-full px-4 pb-6'>
          <button
            type='submit'
            className='w-full py-3 rounded-xl bg-primary-100 text-white font-bold text-lg disabled:opacity-50 transition'
            disabled={!isValid || isLoading}
          >
            {isLoading ? '등록 중...' : '등록하기'}
          </button>
        </div>
      </form>

      {isLoading && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-2xl p-8 max-w-sm w-full mx-4'>
            <ProductLoading />
          </div>
        </div>
      )}

      <ProductSuccessDialog
        isOpen={isSuccess}
        onClose={handleCloseSuccess}
        onGoToDetail={handleGoToDetail}
        productTitle={createdProductTitle}
      />
    </>
  );
}

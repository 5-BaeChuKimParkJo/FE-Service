'use client';
import { useReducer, useState } from 'react';
import { ProductTitleInput } from '@/components/auction/create/form/ProductTitleInput';
import { ProductConditionSelector } from '@/components/auction/create/form/ProductConditionSelector';
import { ProductCategorySelector } from '@/components/auction/create/form/ProductCategorySelector';
import { ProductDescriptionInput } from '@/components/auction/create/form/ProductDescriptionInput';
import { TagInput } from '@/components/auction/create/TagInput';
import { ProductPriceInput } from '@/components/product/ProductPriceInput';
import { ProductImageUploaderForProduct } from '@/components/images/ProductImageUploaderForProduct';
import { uploadImages } from '@/actions/image-service/upload-images';
import { createProduct } from '@/actions/product-service/create-product';
import { CreateProductRequest } from '@/types/product';

// 폼 상태 타입
interface ProductImage {
  key: string;
  file: File;
  url: string;
}

type ProductFormState = {
  title: string;
  productCondition: 'unopened' | 'new' | 'used';
  categoryId: number | null;
  images: ProductImage[];
  description: string;
  tags: string[];
  price: string;
};

const initialState: ProductFormState = {
  title: '',
  productCondition: 'unopened',
  categoryId: null,
  images: [],
  description: '',
  tags: [],
  price: '',
};

type Action =
  | {
      type: 'SET_FIELD';
      field: keyof ProductFormState;
      value: string | string[] | number;
    }
  | { type: 'ADD_TAG'; tag: string }
  | { type: 'REMOVE_TAG'; idx: number }
  | { type: 'ADD_IMAGE'; image: ProductImage }
  | { type: 'SET_IMAGES'; images: ProductImage[] }
  | { type: 'REMOVE_IMAGE'; idx: number };

function reducer(state: ProductFormState, action: Action): ProductFormState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'ADD_TAG':
      if (
        !action.tag.trim() ||
        state.tags.includes(action.tag) ||
        state.tags.length >= 3
      )
        return state;
      return { ...state, tags: [...state.tags, action.tag] };
    case 'REMOVE_TAG':
      return { ...state, tags: state.tags.filter((_, i) => i !== action.idx) };
    case 'ADD_IMAGE':
      return {
        ...state,
        images: [...state.images, action.image],
      };
    case 'SET_IMAGES':
      return { ...state, images: action.images };
    case 'REMOVE_IMAGE':
      return {
        ...state,
        images: state.images.filter((_, i) => i !== action.idx),
      };
    default:
      return state;
  }
}

export default function CreateProductPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  // tagIds는 TagInput에서 관리
  const [tagIds, setTagIds] = useState<number[]>([]);

  // 유효성 검사 예시 (실제 구현 시 모든 필수값 체크 필요)
  const isValid =
    state.title.trim().length > 0 &&
    state.price.replace(/,/g, '').length > 0 &&
    state.tags.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      // 1. 이미지 병렬 업로드
      const files = state.images.map((img) => img.file);
      const uploadedKeys = await uploadImages(files);

      // 2. CreateProductRequest 객체 생성
      const request: CreateProductRequest = {
        title: state.title,
        productCondition: state.productCondition,
        categoryId: state.categoryId!,
        description: state.description,
        price: Number(state.price.replace(/,/g, '')),
        productImageKeyList: uploadedKeys,
        tagIds: tagIds,
      };

      // 3. 상품 등록 API 호출
      const result = await createProduct(request);

      if (result) {
        alert('상품이 성공적으로 등록되었습니다!');
        // TODO: 상품 상세 페이지로 이동 또는 목록 페이지로 이동
      }
    } catch (error) {
      console.error('상품 등록 실패:', error);
      alert('상품 등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
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
            dispatch({ type: 'SET_FIELD', field: 'productCondition', value: v })
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
      </div>
      <div className='max-w-2xl mx-auto w-full px-4 pb-6'>
        <button
          type='submit'
          className='w-full py-3 rounded-xl bg-primary-100 text-white font-bold text-lg disabled:opacity-50 transition'
          disabled={!isValid}
        >
          등록하기
        </button>
      </div>
    </form>
  );
}

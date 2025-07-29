import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { AuctionImage, ProductCondition } from './types';

export type ProductDetailsState = {
  title: string;
  description: string;
  categoryId: number | null;
  images: AuctionImage[];
  thumbnailKey: string;
  productCondition: ProductCondition;
  tags: string[];
  tagIds: number[];
  errors: Record<string, string>;
};

export type ProductDetailsActions = {
  // Setters
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setCategoryId: (categoryId: number | null) => void;
  setImages: (images: AuctionImage[]) => void;
  addImage: (image: AuctionImage) => void;
  removeImage: (index: number) => void;
  reorderImages: (dragIndex: number, hoverIndex: number) => void;
  setThumbnailKey: (key: string) => void;
  setProductCondition: (condition: ProductCondition) => void;
  setTags: (tags: string[]) => void;
  setTagIds: (tagIds: number[]) => void;

  // Error handling
  setError: (field: string, error: string) => void;
  clearError: (field: string) => void;
  clearErrors: () => void;

  // Validation
  validate: () => boolean;
  isValid: () => boolean;

  // Reset
  reset: () => void;
};

const initialState: ProductDetailsState = {
  title: '',
  description: '',
  categoryId: null,
  images: [],
  thumbnailKey: '',
  productCondition: '',
  tags: [],
  tagIds: [],
  errors: {},
};

export const useProductDetailsStore = create<
  ProductDetailsState & ProductDetailsActions
>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setTitle: (title) => {
        set({ title });
        get().clearError('title');
      },

      setDescription: (description) => {
        set({ description });
        get().clearError('description');
      },

      setCategoryId: (categoryId) => {
        set({ categoryId });
        get().clearError('categoryId');
      },

      setImages: (images) => {
        const sortedImages = images.map((img, index) => ({
          ...img,
          order: index,
        }));
        set({ images: sortedImages });

        // 첫 번째 이미지를 썸네일로 설정
        if (sortedImages.length > 0) {
          set({ thumbnailKey: sortedImages[0].key });
        }
        get().clearError('images');
      },

      addImage: (image) => {
        const { images } = get();
        const newImages = [...images, { ...image, order: images.length }];
        get().setImages(newImages);
      },

      removeImage: (index) => {
        const { images } = get();
        const newImages = images.filter((_, i) => i !== index);
        get().setImages(newImages);
      },

      reorderImages: (dragIndex, hoverIndex) => {
        const { images } = get();
        const newImages = [...images];
        const draggedImage = newImages[dragIndex];

        newImages.splice(dragIndex, 1);
        newImages.splice(hoverIndex, 0, draggedImage);

        get().setImages(newImages);
      },

      setThumbnailKey: (key) => set({ thumbnailKey: key }),

      setProductCondition: (condition) => {
        set({ productCondition: condition });
        get().clearError('productCondition');
      },

      setTags: (tags) => set({ tags }),

      setTagIds: (tagIds) => set({ tagIds }),

      setError: (field, error) => {
        const { errors } = get();
        set({ errors: { ...errors, [field]: error } });
      },

      clearError: (field) => {
        const { errors } = get();
        const newErrors = { ...errors };
        delete newErrors[field];
        set({ errors: newErrors });
      },

      clearErrors: () => set({ errors: {} }),

      isValid: () => {
        const state = get();
        return (
          state.title.trim().length >= 5 &&
          state.description.trim().length > 0 &&
          state.images.length > 0 &&
          state.categoryId !== null &&
          state.productCondition !== ''
        );
      },

      validate: () => {
        const state = get();
        state.clearErrors();

        if (!state.title.trim()) {
          state.setError('title', '제목을 입력해주세요.');
          return false;
        }
        if (state.title.trim().length < 5) {
          state.setError('title', '제목은 최소 5자 이상 입력해주세요.');
          return false;
        }
        if (!state.description.trim()) {
          state.setError('description', '상품 설명을 입력해주세요.');
          return false;
        }
        if (state.images.length === 0) {
          state.setError('images', '최소 1장의 이미지를 업로드해주세요.');
          return false;
        }
        if (!state.categoryId) {
          state.setError('categoryId', '카테고리를 선택해주세요.');
          return false;
        }
        if (state.productCondition === '') {
          state.setError('productCondition', '상품 상태를 선택해주세요.');
          return false;
        }
        return true;
      },

      reset: () => set(initialState),
    }),
    {
      name: 'product-details-store',
    },
  ),
);

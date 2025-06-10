import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type ProductCondition = 'unopened' | 'new' | 'used' | '';

export type AuctionImage = {
  key: string;
  order: number;
  file?: File;
  url?: string;
};

export type CreateAuctionState = {
  // Step 1: 설명+이미지
  title: string;
  description: string;
  categoryId: number | null;
  images: AuctionImage[];
  thumbnailKey: string;

  // Step 2: 경매 조건+거래 방식
  minimumBid: string; // bigint는 form에서 string으로 처리
  startAt: Date | null;
  duration: number; // 시간 단위 (1-168시간)
  endAt: Date | null;
  productCondition: ProductCondition;
  isDirectDeal: boolean;
  directDealLocation: string;

  // UI State
  currentStep: number;
  isSubmitting: boolean;
  errors: Record<string, string>;
};

export type CreateAuctionActions = {
  // Step navigation
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Step 1 actions
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setCategoryId: (categoryId: number | null) => void;
  setImages: (images: AuctionImage[]) => void;
  addImage: (image: AuctionImage) => void;
  removeImage: (index: number) => void;
  reorderImages: (dragIndex: number, hoverIndex: number) => void;
  setThumbnailKey: (key: string) => void;

  // Step 2 actions
  setMinimumBid: (bid: string) => void;
  setStartAt: (date: Date | null) => void;
  setDuration: (hours: number) => void;
  setEndAt: (date: Date | null) => void;
  setProductCondition: (condition: ProductCondition) => void;
  setIsDirectDeal: (isDirect: boolean) => void;
  setDirectDealLocation: (location: string) => void;

  // Utility actions
  setError: (field: string, error: string) => void;
  clearError: (field: string) => void;
  clearErrors: () => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  validateStep: (step: number) => boolean;
  reset: () => void;

  // Final data preparation
  getCreateAuctionCommand: () => {
    categoryId?: number | null;
    directDealLocation?: string | null;
    description: string;
    startAt: Date;
    endAt: Date;
    isDirectDeal: boolean;
    productCondition: ProductCondition;
    thumbnailKey: string;
    title: string;
    minimumBid: bigint;
    images: {
      key: string;
      order: number;
    }[];
  } | null;
};

const initialState: CreateAuctionState = {
  title: '',
  description: '',
  categoryId: null,
  images: [],
  thumbnailKey: '',
  minimumBid: '',
  startAt: null,
  duration: 24, // 기본 24시간
  endAt: null,
  productCondition: '',
  isDirectDeal: false,
  directDealLocation: '',
  currentStep: 1,
  isSubmitting: false,
  errors: {},
};

export const useCreateAuctionStore = create<
  CreateAuctionState & CreateAuctionActions
>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Step navigation
      setCurrentStep: (step) => set({ currentStep: step }),

      nextStep: () => {
        const { currentStep, validateStep } = get();
        if (validateStep(currentStep) && currentStep < 3) {
          set({ currentStep: currentStep + 1 });
        }
      },

      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 });
        }
      },

      // Step 1 actions
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

      // Step 2 actions
      setMinimumBid: (bid) => {
        set({ minimumBid: bid });
        get().clearError('minimumBid');
      },

      setStartAt: (date) => {
        set({ startAt: date });
        if (date) {
          const { duration } = get();
          const endAt = new Date(date.getTime() + duration * 60 * 60 * 1000);
          set({ endAt });
        }
        get().clearError('startAt');
      },

      setDuration: (hours) => {
        set({ duration: hours });
        const { startAt } = get();
        if (startAt) {
          const endAt = new Date(startAt.getTime() + hours * 60 * 60 * 1000);
          set({ endAt });
        }
        get().clearError('duration');
      },

      setEndAt: (date) => set({ endAt: date }),

      setProductCondition: (condition) => {
        set({ productCondition: condition });
        get().clearError('productCondition');
      },

      setIsDirectDeal: (isDirect) => {
        set({ isDirectDeal: isDirect });
        if (!isDirect) {
          set({ directDealLocation: '' });
        }
      },

      setDirectDealLocation: (location) => {
        set({ directDealLocation: location });
        get().clearError('directDealLocation');
      },

      // Utility actions
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

      setIsSubmitting: (isSubmitting) => set({ isSubmitting }),

      validateStep: (step) => {
        const state = get();
        state.clearErrors();

        switch (step) {
          case 1:
            if (!state.title.trim()) {
              state.setError('title', '제목을 입력해주세요.');
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

          case 2:
            if (!state.minimumBid || parseFloat(state.minimumBid) <= 0) {
              state.setError('minimumBid', '최소 입찰가를 입력해주세요.');
              return false;
            }
            if (!state.startAt) {
              state.setError('startAt', '경매 시작 시간을 선택해주세요.');
              return false;
            }
            if (state.startAt <= new Date()) {
              state.setError(
                'startAt',
                '경매 시작 시간은 현재 시간 이후여야 합니다.',
              );
              return false;
            }
            if (state.isDirectDeal && !state.directDealLocation.trim()) {
              state.setError(
                'directDealLocation',
                '직거래 위치를 입력해주세요.',
              );
              return false;
            }
            return true;

          default:
            return true;
        }
      },

      reset: () => set(initialState),

      getCreateAuctionCommand: () => {
        const state = get();

        if (!state.validateStep(1) || !state.validateStep(2)) {
          return null;
        }

        try {
          return {
            categoryId: state.categoryId,
            directDealLocation: state.isDirectDeal
              ? state.directDealLocation
              : null,
            description: state.description,
            startAt: state.startAt!,
            endAt: state.endAt!,
            isDirectDeal: state.isDirectDeal,
            productCondition: state.productCondition,
            thumbnailKey: state.thumbnailKey,
            title: state.title,
            minimumBid: BigInt(Math.floor(parseFloat(state.minimumBid))),
            images: state.images.map((img) => ({
              key: img.key,
              order: img.order,
            })),
          };
        } catch (error) {
          console.error('Failed to create auction command:', error);
          return null;
        }
      },
    }),
    {
      name: 'create-auction-store',
    },
  ),
);

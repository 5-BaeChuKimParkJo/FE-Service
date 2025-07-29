import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { AuctionImage, CreateAuctionCommand, ProductCondition } from './types';
import { useProductDetailsStore } from './product-details.store';
import { useAuctionSettingsStore } from './auction-settings.store';
import { useStepperStore } from './stepper.store';

export const useCreateAuctionStore = create(
  devtools(
    (_set, _get) => ({
      get productDetails() {
        return useProductDetailsStore.getState();
      },
      get auctionSettings() {
        return useAuctionSettingsStore.getState();
      },
      get stepper() {
        return useStepperStore.getState();
      },

      setCurrentStep: (step: number) => {
        useStepperStore.getState().setCurrentStep(step);
      },
      nextStep: () => {
        const { currentStep } = useStepperStore.getState();
        const productDetailsValid = useProductDetailsStore
          .getState()
          .validate();
        const auctionSettingsValid = useAuctionSettingsStore
          .getState()
          .validate();

        if (currentStep === 1 && productDetailsValid) {
          useStepperStore.getState().nextStep();
        } else if (currentStep === 2 && auctionSettingsValid) {
          useStepperStore.getState().nextStep();
        }
      },
      prevStep: () => {
        useStepperStore.getState().prevStep();
      },

      setTitle: (title: string) => {
        useProductDetailsStore.getState().setTitle(title);
      },
      setDescription: (description: string) => {
        useProductDetailsStore.getState().setDescription(description);
      },
      setCategoryId: (categoryId: number | null) => {
        useProductDetailsStore.getState().setCategoryId(categoryId);
      },
      setImages: (images: AuctionImage[]) => {
        useProductDetailsStore.getState().setImages(images);
      },
      addImage: (image: AuctionImage) => {
        useProductDetailsStore.getState().addImage(image);
      },
      removeImage: (index: number) => {
        useProductDetailsStore.getState().removeImage(index);
      },
      reorderImages: (dragIndex: number, hoverIndex: number) => {
        useProductDetailsStore.getState().reorderImages(dragIndex, hoverIndex);
      },
      setThumbnailKey: (key: string) => {
        useProductDetailsStore.getState().setThumbnailKey(key);
      },
      setProductCondition: (condition: ProductCondition) => {
        useProductDetailsStore.getState().setProductCondition(condition);
      },
      setTags: (tags: string[]) => {
        useProductDetailsStore.getState().setTags(tags);
      },
      setTagIds: (tagIds: number[]) => {
        useProductDetailsStore.getState().setTagIds(tagIds);
      },

      // Step 2 actions (기존 API 호환)
      setMinimumBid: (bid: string) => {
        useAuctionSettingsStore.getState().setMinimumBid(bid);
      },
      setStartAt: (date: Date | null) => {
        useAuctionSettingsStore.getState().setStartAt(date);
      },
      setDuration: (hours: number) => {
        useAuctionSettingsStore.getState().setDuration(hours);
      },
      setEndAt: (date: Date | null) => {
        useAuctionSettingsStore.getState().setEndAt(date);
      },
      setIsDirectDeal: (isDirect: boolean) => {
        useAuctionSettingsStore.getState().setIsDirectDeal(isDirect);
      },
      setDirectDealLocation: (location: string) => {
        useAuctionSettingsStore.getState().setDirectDealLocation(location);
      },

      setError: (field: string, error: string) => {
        if (field in useProductDetailsStore.getState()) {
          useProductDetailsStore.getState().setError(field, error);
        } else if (field in useAuctionSettingsStore.getState()) {
          useAuctionSettingsStore.getState().setError(field, error);
        }
      },
      clearError: (field: string) => {
        useProductDetailsStore.getState().clearError(field);
        useAuctionSettingsStore.getState().clearError(field);
      },
      clearErrors: () => {
        useProductDetailsStore.getState().clearErrors();
        useAuctionSettingsStore.getState().clearErrors();
      },
      setIsSubmitting: (isSubmitting: boolean) => {
        useStepperStore.getState().setIsSubmitting(isSubmitting);
      },

      // Validation (기존 API 호환)
      validateStep: (step: number) => {
        if (step === 1) {
          return useProductDetailsStore.getState().validate();
        } else if (step === 2) {
          return useAuctionSettingsStore.getState().validate();
        }
        return true;
      },
      isStepValid: (step: number) => {
        if (step === 1) {
          return useProductDetailsStore.getState().isValid();
        } else if (step === 2) {
          return useAuctionSettingsStore.getState().isValid();
        } else if (step === 3) {
          return (
            useProductDetailsStore.getState().isValid() &&
            useAuctionSettingsStore.getState().isValid()
          );
        }
        return true;
      },

      reset: () => {
        useProductDetailsStore.getState().reset();
        useAuctionSettingsStore.getState().reset();
        useStepperStore.getState().reset();
      },

      getCreateAuctionCommand: (): CreateAuctionCommand | null => {
        const productDetails = useProductDetailsStore.getState();
        const auctionSettings = useAuctionSettingsStore.getState();

        if (!productDetails.validate() || !auctionSettings.validate()) {
          return null;
        }

        try {
          return {
            categoryId: productDetails.categoryId,
            directDealLocation: auctionSettings.isDirectDeal
              ? auctionSettings.directDealLocation
              : null,
            description: productDetails.description,
            startAt: auctionSettings.startAt!,
            endAt: auctionSettings.endAt!,
            isDirectDeal: auctionSettings.isDirectDeal,
            productCondition: productDetails.productCondition,
            thumbnailKey: productDetails.thumbnailKey,
            title: productDetails.title,
            minimumBid: BigInt(
              Math.floor(parseFloat(auctionSettings.minimumBid)),
            ),
            images: productDetails.images.map((img) => ({
              key: img.key,
              order: img.order,
            })),
            tags: productDetails.tags,
            tagIds: productDetails.tagIds,
          };
        } catch (error) {
          console.error('Failed to create auction command:', error);
          return null;
        }
      },

      // Computed properties for backward compatibility
      get currentStep() {
        return useStepperStore.getState().currentStep;
      },
      get isSubmitting() {
        return useStepperStore.getState().isSubmitting;
      },
      get title() {
        return useProductDetailsStore.getState().title;
      },
      get description() {
        return useProductDetailsStore.getState().description;
      },
      get categoryId() {
        return useProductDetailsStore.getState().categoryId;
      },
      get images() {
        return useProductDetailsStore.getState().images;
      },
      get thumbnailKey() {
        return useProductDetailsStore.getState().thumbnailKey;
      },
      get productCondition() {
        return useProductDetailsStore.getState().productCondition;
      },
      get tags() {
        return useProductDetailsStore.getState().tags;
      },
      get tagIds() {
        return useProductDetailsStore.getState().tagIds;
      },
      get minimumBid() {
        return useAuctionSettingsStore.getState().minimumBid;
      },
      get startAt() {
        return useAuctionSettingsStore.getState().startAt;
      },
      get duration() {
        return useAuctionSettingsStore.getState().duration;
      },
      get endAt() {
        return useAuctionSettingsStore.getState().endAt;
      },
      get isDirectDeal() {
        return useAuctionSettingsStore.getState().isDirectDeal;
      },
      get directDealLocation() {
        return useAuctionSettingsStore.getState().directDealLocation;
      },
      get errors() {
        return {
          ...useProductDetailsStore.getState().errors,
          ...useAuctionSettingsStore.getState().errors,
        };
      },
    }),
    {
      name: 'create-auction-store',
    },
  ),
);

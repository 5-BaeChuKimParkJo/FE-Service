export * from './types';
export * from './product-details.store';
export * from './auction-settings.store';
export * from './stepper.store';
export * from './create-auction.store';

// 통합된 경매 생성 스토어 (기존 API 호환성 유지)
export { useProductDetailsStore as useCreateAuctionProductDetails } from './product-details.store';
export { useAuctionSettingsStore as useCreateAuctionSettings } from './auction-settings.store';
export { useStepperStore as useCreateAuctionStepper } from './stepper.store';

import { ProductCondition } from '@/stores/use-create-auction-store';

export const productConditionLabels: Record<ProductCondition, string> = {
  unopened: '미개봉 상품',
  new: '새상품',
  used: '중고 상품',
  '': '선택 안됨',
};

export const koreanDateFormatOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
};

export const exposeHandleSubmit = (handleSubmit: () => void) => {
  const element = document.querySelector('[data-step="3"]') as HTMLElement & {
    handleSubmit?: () => void;
  };
  if (element) {
    element.handleSubmit = handleSubmit;
  }
};

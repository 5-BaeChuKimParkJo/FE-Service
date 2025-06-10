/**
 * 미리보기 관련 유틸리티 함수들
 */

import { ProductCondition } from '@/stores/use-create-auction-store';

/**
 * 상품 상태 라벨 매핑
 */
export const productConditionLabels: Record<ProductCondition, string> = {
  unopened: '미개봉 상품',
  new: '새상품',
  used: '중고 상품',
  '': '선택 안됨',
};

/**
 * 한국어 날짜 포맷팅 옵션
 */
export const koreanDateFormatOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
};

/**
 * Step3 컴포넌트에 handleSubmit 함수를 노출하는 함수
 */
export const exposeHandleSubmit = (handleSubmit: () => void) => {
  const element = document.querySelector('[data-step="3"]') as HTMLElement & {
    handleSubmit?: () => void;
  };
  if (element) {
    element.handleSubmit = handleSubmit;
  }
};

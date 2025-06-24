import { ProductCondition } from '@/types/auction';
import { ProductFormState } from '@/types/product';

export const convertProductCondition = (
  condition: ProductCondition,
): 'UNOPENED' | 'NEW' | 'USED' => {
  switch (condition) {
    case 'unopened':
      return 'UNOPENED';
    case 'new':
      return 'NEW';
    case 'used':
      return 'USED';
    default:
      return 'UNOPENED';
  }
};

export const validateProductForm = (state: ProductFormState): boolean => {
  return (
    state.title.trim().length > 0 &&
    state.price.replace(/,/g, '').length > 0 &&
    state.images.length > 0 &&
    state.categoryId !== null &&
    state.productCondition !== '' &&
    state.description.trim().length > 0
  );
};

import { ProductFormAction, ProductFormState } from '@/types/product';

export const initialState: ProductFormState = {
  title: '',
  productCondition: '',
  categoryId: null,
  images: [],
  description: '',
  tags: [],
  price: '',
  isDirectDeal: false,
  directDealLocation: '',
};

export function productFormReducer(
  state: ProductFormState,
  action: ProductFormAction,
): ProductFormState {
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

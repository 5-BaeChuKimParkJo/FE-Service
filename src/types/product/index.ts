export interface CreateProductRequest {
  title: string;
  productCondition: 'UNOPENED' | 'NEW' | 'USED';
  categoryId: string;
  description: string;
  price: number;
  imageKeyList: string[];
  tagIdList: number[];
  isDirectDeal: boolean;
  directDealLocation: string;
  ticketUuid: string;
}

import { ProductCondition } from '@/types/auction';

export interface ProductImage {
  key: string;
  file: File;
  url: string;
}

export type ProductFormState = {
  title: string;
  productCondition: ProductCondition;
  categoryId: number | null;
  images: ProductImage[];
  description: string;
  tags: string[];
  price: string;
  isDirectDeal: boolean;
  directDealLocation: string;
};

export type ProductFormAction =
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

export type ProductDetailResponse = {
  productUuid: string;
  saleMemberUuid: string;
  title: string;
  categoryId: number;
  productCondition: ProductCondition;
  description: string;
  isDirectDeal: boolean;
  directDealLocation?: string;
  isHide: boolean;
  status: 'ACTIVE' | 'ENDED';
  thumbnailUrl: string;
  viewCount: number;
  price: number;
  ticketUuid?: string;
  createdAt: string;
  imageUrlList: string[];
};

import { ProductImage as UploadedProductImage } from '@/types/image';

export interface CreateProductRequest {
  title: string;
  productCondition: 'UNOPENED' | 'NEW' | 'USED';
  categoryId: string;
  description: string;
  price: number;
  imageList: UploadedProductImage[];
  tagIdList: number[];
  isDirectDeal: boolean;
  directDealLocation?: string;
  ticketUuid?: string;
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
      value: string | string[] | number | boolean;
    }
  | { type: 'ADD_TAG'; tag: string }
  | { type: 'REMOVE_TAG'; idx: number }
  | { type: 'ADD_IMAGE'; image: ProductImage }
  | { type: 'SET_IMAGES'; images: ProductImage[] }
  | { type: 'REMOVE_IMAGE'; idx: number };

interface ProductCategory {
  categoryId: number;
  name: string;
  description: string;
  imageUrl: string;
}

interface ProductTag {
  tagId: number;
  name: string;
}

interface ProductSeller {
  memberUuid: string;
  nickname: string;
  gradeUuid: string;
  honor: 'NICE_GUY' | string;
  state: 'ACTIVE' | string;
  profileImageUrl: string;
  point: number;
}

interface ProductImageUrl {
  productImageId: number;
  url: string;
  order: number;
}

export type ProductDetailResponse = {
  type: 'product';
  id: number;
  productUuid: string;
  saleMemberUuid: string;
  title: string;
  categoryId: string;
  description: string;
  productCondition: 'UNOPENED' | 'NEW' | 'USED';
  isDirectDeal: boolean;
  directDealLocation: string;
  isHide: boolean;
  status: 'ACTIVE' | 'ENDED' | 'DEALING';
  thumbnailKey: string;
  viewCount: number;
  price: number;
  ticketUuid: string;
  tagIdList: number[];
  isDeleted: boolean;
  createdAt: string;
  category: ProductCategory;
  tags: ProductTag[];
  seller: ProductSeller;
  imageUrlList: ProductImageUrl[];
};

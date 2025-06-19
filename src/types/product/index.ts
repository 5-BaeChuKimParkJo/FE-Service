export interface CreateProductRequest {
  title: string;
  productCondition: string;
  categoryId: number;
  description: string;
  price: number;
  productImageKeyList: string[];
  tagIds: number[];
}

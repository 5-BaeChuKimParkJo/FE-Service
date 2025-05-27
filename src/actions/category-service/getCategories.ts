import { instance } from '../instance';

export type CategoryType = {
  categoryId: number;
  name: string;
  description: string;
  imageUrl?: string;
};

export async function getCategories(): Promise<CategoryType[]> {
  return instance.get<CategoryType[]>('/category/list', {
    cache: 'force-cache',
  });
}

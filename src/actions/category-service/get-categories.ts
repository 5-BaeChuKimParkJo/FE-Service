'use server';

import { instance } from '@/actions/instance';

export type CategoryType = {
  categoryId: number;
  name: string;
  description: string;
  imageUrl: string;
};

export async function getCategories(): Promise<CategoryType[]> {
  return instance.get<CategoryType[]>(
    '/category-service/api/v1/category/list',
    {
      cache: 'force-cache',
      next: {
        revalidate: false,
      },
    },
  );
}

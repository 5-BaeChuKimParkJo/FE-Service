'use server';

import { instance } from '@/actions/instance';
import { API_PATHS } from '@/config/api';

export type CategoryType = {
  categoryId: number;
  name: string;
  description: string;
  imageUrl: string;
};

export async function getCategories(): Promise<CategoryType[]> {
  return instance.get<CategoryType[]>(
    API_PATHS.categories,
    {
      cache: 'force-cache',
      next: {
        revalidate: false,
      },
    },
  );
}

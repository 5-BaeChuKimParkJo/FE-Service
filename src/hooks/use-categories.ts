import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/actions/category-service/getCategories';
import { CategoryType } from '@/actions/category-service/getCategories';

export function useCategories() {
  return useQuery<CategoryType[]>({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

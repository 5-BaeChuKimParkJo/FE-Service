import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/actions/category-service/get-categories';
import { CategoryType } from '@/actions/category-service/get-categories';

export function useCategories() {
  return useQuery<CategoryType[]>({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

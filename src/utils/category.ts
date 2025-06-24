import { CategoryType } from '@/actions/category-service/get-categories';

export function findCategoryById(
  categories: CategoryType[],
  categoryId: number | null,
): CategoryType | undefined {
  if (!categoryId) return undefined;
  return categories.find((cat) => cat.categoryId === categoryId);
}

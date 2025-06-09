// import { instance } from '../instance';

export type CategoryType = {
  categoryId: number;
  name: string;
  description: string;
  imageUrl?: string;
};

// export async function getCategories(): Promise<CategoryType[]> {
//   return instance.get<CategoryType[]>(
//     '/category-service/api/v1/category/list',
//     {
//       cache: 'force-cache',
//       next: {
//         revalidate: false,
//       },
//     },
//   );
// }

export async function getCategories(): Promise<CategoryType[]> {
  const categories = await fetch('http://localhost:8080/api/v1/category/list', {
    cache: 'force-cache',
    next: {
      revalidate: false,
    },
  });
  return categories.json();
}

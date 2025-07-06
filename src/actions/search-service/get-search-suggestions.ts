'use server';

import { instance } from '@/actions/instance';

interface SearchSuggestionItem {
  keyword: string;
  weight: number;
}

type SearchSuggestionResponse = SearchSuggestionItem[];

export async function getSearchSuggestions(query: string): Promise<string[]> {
  try {
    const response = await instance.get<SearchSuggestionResponse>(
      `/search-service/search-service/api/v1/auction/search/suggest?keyword=${encodeURIComponent(query)}`,
    );

    return response.map((item) => item.keyword);
  } catch (error) {
    console.error('검색어 추천 API 호출 실패:', error);
    return [];
  }
}

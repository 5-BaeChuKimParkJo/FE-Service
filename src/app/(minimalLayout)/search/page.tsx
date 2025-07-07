'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import useSearchSuggestions from '@/hooks/use-search-suggestions';
import { SearchHeader } from '@/components/layouts';
import Search from '@/assets/icons/common/search.svg';

export default function SearchPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    query,
    suggestions,
    isLoading,
    showDropdown,
    handleQueryChange,
    handleSuggestionSelect,
    hideDropdown,
  } = useSearchSuggestions();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      hideDropdown();
      router.push(`/search/result?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSuggestionSelect(suggestion);
    setTimeout(() => {
      router.push(`/search/result?q=${encodeURIComponent(suggestion)}`);
    }, 100);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <SearchHeader title='상품 검색' />

      <div className='px-4 py-6 pt-20'>
        <div className='relative'>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
            <input
              ref={inputRef}
              type='text'
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder='어떤 상품을 찾고 계세요?'
              className='w-full h-12 px-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent'
            />
            <button
              type='submit'
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
            >
              <Search className='w-6 h-6' />
            </button>
          </form>

          {isLoading && (
            <div className='absolute right-12 top-1/2 transform -translate-y-1/2'>
              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-primary-100'></div>
            </div>
          )}

          {showDropdown && suggestions.length > 0 && (
            <div className='absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto'>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className='w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0'
                >
                  <span className='text-gray-700'>{suggestion}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className='mt-8'>
          <h2 className='text-lg font-semibold text-gray-800 mb-4'>
            인기 검색어
          </h2>
          <div className='flex flex-wrap gap-2'>
            {['아이폰', '갤럭시', '노트북', '에어팟', '키보드', '마우스'].map(
              (keyword) => (
                <button
                  key={keyword}
                  onClick={() => handleSuggestionClick(keyword)}
                  className='px-4 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50 hover:border-primary-100 transition-colors'
                >
                  {keyword}
                </button>
              ),
            )}
          </div>
        </div>

        {/* TODO: 최근 검색어 공간 (추후 구현 예정) */}
        <div className='mt-8'>
          <h2 className='text-lg font-semibold text-gray-800 mb-4'>
            최근 검색어
          </h2>
          <div className='text-gray-500 text-sm'>
            최근 검색한 키워드가 없습니다.
          </div>
        </div>
      </div>
    </div>
  );
}

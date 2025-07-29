'use client';

import { useState, useEffect, useRef } from 'react';
import { getSearchSuggestions } from '@/actions/search-service';

export default function useSearchSuggestions() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 이전 타이머 클리어
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // 빈 문자열 처리
    if (!query || query.trim().length === 0) {
      setSuggestions([]);
      setShowDropdown(false);
      setIsLoading(false);
      return;
    }

    // 새로운 타이머 설정
    debounceTimer.current = setTimeout(async () => {
      try {
        setIsLoading(true);
        const results = await getSearchSuggestions(query.trim());
        setSuggestions(results);
        setShowDropdown(results.length > 0);
      } catch (error) {
        console.error('검색어 추천 에러:', error);
        setSuggestions([]);
        setShowDropdown(false);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    // 클린업 함수
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query]);

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    if (newQuery.trim().length > 0) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setQuery(suggestion);
    setShowDropdown(false);
    setSuggestions([]);
  };

  const hideDropdown = () => {
    setShowDropdown(false);
  };

  return {
    query,
    suggestions,
    isLoading,
    showDropdown,
    handleQueryChange,
    handleSuggestionSelect,
    hideDropdown,
  };
}

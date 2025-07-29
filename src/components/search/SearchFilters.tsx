import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui';

interface SearchFiltersProps {
  onFiltersChange: (filters: {
    productCondition?: string;
    tagNames?: string[];
    sortBy?: string;
  }) => void;
  initialFilters?: {
    productCondition?: string;
    tagNames?: string[];
    sortBy?: string;
    categoryName?: string;
  };
}

export function SearchFilters({
  onFiltersChange,
  initialFilters,
}: SearchFiltersProps) {
  const [productCondition, setProductCondition] = useState(
    initialFilters?.productCondition || '',
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialFilters?.tagNames || [],
  );
  const [sortBy, setSortBy] = useState(initialFilters?.sortBy || 'latest');
  const [tagInput, setTagInput] = useState('');
  const [showConditionDropdown, setShowConditionDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // 상품 상태 옵션들
  const conditionOptions = [
    { value: '', label: '모든 상태' },
    { value: 'new', label: '새 상품' },
    { value: 'used', label: '중고 상품' },
    { value: 'unopened', label: '미개봉 상품' },
  ];

  // 정렬 옵션들
  const sortOptions = [
    { value: 'latest', label: '최신순' },
    { value: 'priceHigh', label: '높은 가격순' },
    { value: 'priceLow', label: '낮은 가격순' },
    { value: 'recommended', label: '추천순' },
  ];

  // 상품 상태 선택
  const handleConditionSelect = (value: string) => {
    setProductCondition(value);
    setShowConditionDropdown(false);
    // 즉시 필터 적용 (categoryName 유지)
    onFiltersChange({
      productCondition: value || undefined,
      tagNames: selectedTags.length > 0 ? selectedTags : undefined,
      sortBy: sortBy || 'latest',
    });
  };

  // 정렬 선택
  const handleSortSelect = (value: string) => {
    setSortBy(value);
    setShowSortDropdown(false);
    // 즉시 필터 적용
    onFiltersChange({
      productCondition: productCondition || undefined,
      tagNames: selectedTags.length > 0 ? selectedTags : undefined,
      sortBy: value || 'latest',
    });
  };

  // 태그 추가
  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag) && selectedTags.length < 5) {
      const newTags = [...selectedTags, tag];
      setSelectedTags(newTags);
      onFiltersChange({
        productCondition: productCondition || undefined,
        tagNames: newTags.length > 0 ? newTags : undefined,
        sortBy: sortBy || 'latest',
      });
    }
    setTagInput('');
  };

  // 태그 제거
  const removeTag = (tagToRemove: string) => {
    const newTags = selectedTags.filter((tag) => tag !== tagToRemove);
    setSelectedTags(newTags);
    onFiltersChange({
      productCondition: productCondition || undefined,
      tagNames: newTags.length > 0 ? newTags : undefined,
      sortBy: sortBy || 'latest',
    });
  };

  // 엔터키로 태그 추가
  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      addTag(tagInput.trim());
    }
  };

  // 모든 필터 초기화
  const clearAllFilters = () => {
    setProductCondition('');
    setSelectedTags([]);
    setSortBy('latest');
    onFiltersChange({
      sortBy: 'latest',
    });
  };

  const hasActiveFilters =
    productCondition || selectedTags.length > 0 || sortBy !== 'latest';

  return (
    <div className='bg-white border-b border-gray-200 px-4 py-3'>
      <div className='space-y-3'>
        {/* 정렬과 상품상태 한 줄 배치 */}
        <div className='flex gap-4'>
          {/* 정렬 옵션 */}
          <div className='flex-1'>
            <div className='relative'>
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className='w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg bg-white hover:border-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-100'
              >
                <span className='text-sm'>
                  {sortOptions.find((opt) => opt.value === sortBy)?.label ||
                    '최신순'}
                </span>
                <ChevronDown className='w-4 h-4 text-gray-500' />
              </button>

              {showSortDropdown && (
                <div className='absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10'>
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSortSelect(option.value)}
                      className='w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg'
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 상품 상태 필터 */}
          <div className='flex-1'>
            <div className='relative'>
              <button
                onClick={() => setShowConditionDropdown(!showConditionDropdown)}
                className='w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg bg-white hover:border-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-100'
              >
                <span className='text-sm'>
                  {conditionOptions.find(
                    (opt) => opt.value === productCondition,
                  )?.label || '모든 상태'}
                </span>
                <ChevronDown className='w-4 h-4 text-gray-500' />
              </button>

              {showConditionDropdown && (
                <div className='absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10'>
                  {conditionOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleConditionSelect(option.value)}
                      className='w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg'
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 태그 필터 */}
        <div className='flex gap-4'>
          {/* 태그 입력과 추가 버튼 */}
          <div className='flex gap-2 flex-1'>
            <Input
              label='태그 (최대 5개)'
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleTagInputKeyPress}
              maxLength={10}
              disabled={selectedTags.length >= 5}
              className='flex-1'
            />
            <button
              onClick={() => tagInput.trim() && addTag(tagInput.trim())}
              disabled={!tagInput.trim() || selectedTags.length >= 5}
              className='px-4 py-2 bg-primary-100 text-white rounded-lg text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-100/90 mt-6 h-fit min-w-[48px] flex-shrink-0'
            >
              추가
            </button>
          </div>

          {/* 선택된 태그들 */}
          <div className='flex flex-wrap gap-1 items-start flex-1 min-h-[32px]'>
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className='bg-primary-100/10 text-primary-100 px-2 py-1 rounded-full text-xs flex items-center gap-1'
              >
                #{tag}
                <button
                  onClick={() => removeTag(tag)}
                  className='ml-1 text-gray-400 hover:text-red-400 text-sm'
                  aria-label='태그 삭제'
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* 필터 초기화 버튼 */}
        {hasActiveFilters && (
          <div className='flex justify-end'>
            <button
              onClick={clearAllFilters}
              className='text-sm text-gray-500 hover:text-gray-700'
            >
              필터 초기화
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

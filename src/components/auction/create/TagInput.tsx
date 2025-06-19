import { useState } from 'react';
import { getTagId } from '@/actions/tag-service/get-tag-id';
import { Input } from '@/components/ui';
import { isErrorResponse } from '@/utils/type-guards';

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  tagIds: number[];
  setTagIds: (ids: number[]) => void;
}

export function TagInput({ tags, setTags, tagIds, setTagIds }: TagInputProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const addTag = async () => {
    const value = input.trim();
    if (!value || tags.includes(value) || tags.length >= 3) return;
    setLoading(true);
    try {
      const tagId = await getTagId(value);
      if (isErrorResponse(tagId)) {
        alert('태그 등록에 실패했습니다.');
      } else {
        setTags([...tags, value]);
        setTagIds([...tagIds, tagId]);
        setInput('');
      }
    } finally {
      setLoading(false);
    }
  };

  const removeTag = (idx: number) => {
    setTags(tags.filter((_, i) => i !== idx));
    setTagIds(tagIds.filter((_, i) => i !== idx));
  };

  return (
    <section className='space-y-1'>
      <div className='flex flex-wrap gap-2 h-8 mb-2'>
        {tags.map((tag, idx) => (
          <span
            key={tag}
            className='bg-primary-100/10  text-primary-100 px-3 h-8 rounded-full text-sm flex items-center gap-1'
          >
            # {tag}
            <button
              type='button'
              onClick={() => removeTag(idx)}
              className='ml-1 text-gray-400 hover:text-red-400'
              aria-label='태그 삭제'
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className='flex gap-2'>
        <Input
          label='태그(최대 3개)'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={10}
          disabled={tags.length >= 3 || loading}
        />
        <button
          type='button'
          onClick={addTag}
          disabled={!input.trim() || tags.length >= 3 || loading}
          className='px-3 mt-4 rounded-2xl bg-primary-100 text-white font-bold disabled:opacity-50'
        >
          추가
        </button>
        {/* <Button
          variant='primary'
          size='xl'
          onClick={addTag}
          disabled={!input.trim() || tags.length >= 3 || loading}
        >
          추가
        </Button> */}
      </div>
    </section>
  );
}

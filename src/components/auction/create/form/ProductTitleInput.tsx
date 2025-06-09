'use client';

import { useCreateAuctionStore } from '@/stores/use-create-auction-store';
import { Input } from '@/components/ui/input';

export function ProductTitleInput() {
  const { title, errors, setTitle } = useCreateAuctionStore();

  return (
    <section className='space-y-3 '>
      <Input
        label='제목'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={100}
        aria-describedby={errors.title ? 'title-error' : 'title-help'}
        aria-invalid={!!errors.title}
      />
      {errors.title && (
        <p id='title-error' className='text-sm text-red-500 px-1' role='alert'>
          {errors.title}
        </p>
      )}
      <p id='title-help' className='text-xs text-gray-500 px-1'>
        {title.length}/50
      </p>
    </section>
  );
}

'use client';

import { Label } from '@/components/ui/label';
import { useRegisterStore } from '@/store/use-register-store';
import { Checkbox } from '../ui/checkbox';

const CATEGORIES = [
  { id: 'tech', label: '기술' },
  { id: 'fashion', label: '패션' },
  { id: 'food', label: '음식' },
  { id: 'travel', label: '여행' },
  { id: 'sports', label: '스포츠' },
  { id: 'music', label: '음악' },
  { id: 'movies', label: '영화' },
  { id: 'books', label: '도서' },
];

export function StepFour() {
  const { interests, setInterests } = useRegisterStore();

  const handleToggleInterest = (id: string) => {
    if (interests.includes(id)) {
      setInterests(interests.filter((item) => item !== id));
    } else {
      setInterests([...interests, id]);
    }
  };

  return (
    <section className='flex flex-col h-full' aria-labelledby='interests-title'>
      <div className='flex-1'>
        <div className='space-y-6'>
          <div className='text-center mb-4'>
            <h2 id='interests-title' className='text-xl font-semibold'>
              관심 카테고리
            </h2>
            <p className='text-sm text-muted-foreground'>
              맞춤 콘텐츠를 위해 관심 있는 카테고리를 선택해주세요.
            </p>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            {CATEGORIES.map((category) => (
              <div
                key={category.id}
                className='flex items-center space-x-2 bg-white p-3 rounded-md border'
              >
                <Checkbox
                  id={category.id}
                  checked={interests.includes(category.id)}
                  onCheckedChange={() => handleToggleInterest(category.id)}
                />
                <Label htmlFor={category.id}>{category.label}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

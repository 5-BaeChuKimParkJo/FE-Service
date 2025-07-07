'use client';
import { useRouter } from 'next/navigation';
import Arrow from '@/assets/icons/common/arrow.svg';

interface SearchHeaderProps {
  title: string;
}

export function SearchHeader({ title }: SearchHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <header className='fixed top-0 left-0 right-0 w-full bg-white border-b border-gray-200 px-4 py-4 z-50'>
      <div className='flex items-center gap-4'>
        <button onClick={handleBack} aria-label='뒤로 가기'>
          <Arrow className='w-6 h-6 text-primary-100' />
        </button>
        <div className='flex-1'>
          <h1 className='text-lg font-semibold text-gray-800'>{title}</h1>
        </div>
      </div>
    </header>
  );
}

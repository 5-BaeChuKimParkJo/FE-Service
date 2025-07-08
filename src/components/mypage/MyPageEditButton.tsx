'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function MyPageEditButton() {
  const router = useRouter();

  const handleEditProfile = () => {
    router.push('/mypage/edit');
  };

  return (
    <Button
      variant='outline'
      size='sm'
      onClick={handleEditProfile}
      className='text-sm font-medium'
    >
      정보 수정
    </Button>
  );
}

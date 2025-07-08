'use client';

import { signOut } from '@/actions/auth-service/sign-out';
import { useRouter } from 'next/navigation';

export function MyPageLogoutSection() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/sign-in');
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  return (
    <section className=' py-2 px-4'>
      <button onClick={handleLogout}>
        <h1 className='text-lg font-bold text-gray-900'>로그아웃</h1>
      </button>
    </section>
  );
}

'use client';

import { useRouter } from 'next/navigation';

export function MyPageLogoutSection() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 로그아웃 API 호출
      // await signOut();

      // 로컬 스토리지 및 쿠키 정리
      localStorage.clear();

      // 로그인 페이지로 리다이렉트
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

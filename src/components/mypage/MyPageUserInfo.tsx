import Link from 'next/link';
import Image from 'next/image';

import { MemberInfo } from '@/types/member';
import { Grade } from '@/types/grade';

export async function MyPageUserInfo({
  myInfo,
  myGrade,
}: {
  myInfo: MemberInfo;
  myGrade: Grade;
}) {
  return (
    <section className='flex items-center justify-between'>
      <div className='flex items-center gap-4'>
        <div className='relative w-16 h-16 rounded-full overflow-hidden'>
          <Image
            src={myInfo.profileImageUrl || myGrade.imageUrl}
            alt='프로필'
            fill
            style={{ objectFit: 'cover' }}
            className='rounded-full'
          />
        </div>

        <div>
          <h2 className='text-xl font-bold text-gray-700 mb-1'>
            {myInfo.nickname || '사용자'}
          </h2>
          <div className='flex items-center gap-2'>
            <span className='text-xl font-medium text-gray-600'>
              {myInfo.point}P
            </span>
          </div>
        </div>
      </div>

      <Link
        href='/mypage/edit'
        className='flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 transition-colors'
      >
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 5l7 7-7 7'
          />
        </svg>
      </Link>
    </section>
  );
}

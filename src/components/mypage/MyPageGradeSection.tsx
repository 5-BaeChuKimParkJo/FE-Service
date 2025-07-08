import Image from 'next/image';

import { Grade } from '@/types/grade';
import { MemberInfo } from '@/types/member';

export async function MyPageGradeSection({
  myInfo,
  myGrade,
}: {
  myInfo: MemberInfo;
  myGrade: Grade;
}) {
  return (
    <div className='space-y-4 mt-6 border-t border-gray-400 pt-6'>
      <div className='flex items-center gap-4 bg-gray-50 rounded-lg'>
        <div className='w-16 h-16 bg-primary-200 rounded-full flex items-center justify-center'>
          <div className='w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden'>
            <Image
              src={myGrade.imageUrl}
              alt='등급'
              width={32}
              height={32}
              className='rounded-full'
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
        <div className='flex-1'>
          <h3 className='font-bold text-lg text-gray-900'>
            {myInfo.honor ? myInfo.honor : ''} {myGrade.gradeName}
          </h3>
          <p className='text-sm text-gray-600'>현재 포인트: {myInfo.point}점</p>
          <p className='text-xs text-gray-500'>
            다음 등급까지 {myGrade.maxPoint - myInfo.point}점 남음
          </p>
        </div>
      </div>
    </div>
  );
}

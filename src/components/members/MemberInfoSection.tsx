import { ErrorResponse } from '@/types/api';
import { MemberInfo } from '@/types/member';
import { isErrorResponse } from '@/utils/type-guards';
import { MemberInfoSectionSkeleton } from './MemberInfoSectionSkeleton';
import Image from 'next/image';
import { getGradeInfo } from '@/actions/grade-service';

export async function MemberInfoSection({
  memberInfo,
}: {
  memberInfo: MemberInfo | ErrorResponse;
}) {
  if (isErrorResponse(memberInfo)) {
    return <MemberInfoSectionSkeleton />;
  }
  const grade = await getGradeInfo(memberInfo.gradeUuid);

  return (
    <section className='flex flex-col gap-4 py-2'>
      <div className='flex items-center gap-4'>
        <div className='relative w-[50px] h-[50px] rounded-full overflow-hidden'>
          <Image
            src={memberInfo.profileImageUrl || grade.imageUrl}
            alt='profile'
            fill
            style={{ objectFit: 'cover' }}
            className='rounded-full'
          />
        </div>
        <div className='flex flex-col'>
          <p className='text-sm text-gray-500'>찰낙찰낙 쏟아지는 경매</p>
          <p className='text-lg font-bold'>
            {memberInfo.nickname || '유저 닉네임'}
          </p>
        </div>
        <div className='ml-auto mr-2 flex items-center '>
          <div className='flex items-center bg-primary-200 rounded-full  h-10 min-w-[80px] justify-center'>
            <div className='relative w-7 h-7 rounded-full bg-white flex items-center justify-center mr-4 overflow-hidden'>
              <Image
                src={grade.imageUrl}
                alt='grade'
                fill
                style={{ objectFit: 'cover' }}
                className='rounded-full'
              />
            </div>
            <span className='text-white text-base font-bold'>
              {memberInfo.point}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

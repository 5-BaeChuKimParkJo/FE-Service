import { getMyInfo } from '@/actions/member-service/get-my-info';
import { AuctionPreviewSection } from '@/components/auction';
import {
  MemberInfoSection,
  MemberInfoSectionSkeleton,
} from '@/components/members';
import { Suspense } from 'react';

export default async function Home() {
  const myInfo = await getMyInfo();
  return (
    <div className='flex flex-col gap-4'>
      <Suspense fallback={<MemberInfoSectionSkeleton />}>
        <MemberInfoSection memberInfo={myInfo} />
      </Suspense>

      <AuctionPreviewSection />
    </div>
  );
}

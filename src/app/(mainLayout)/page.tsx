import { getMyInfo } from '@/actions/member-service/get-my-info';
import { getCategories } from '@/actions/category-service/get-categories';
import { AuctionPreviewSection } from '@/components/auction';
import { CategorySlider } from '@/components/category';
import {
  MemberInfoSection,
  MemberInfoSectionSkeleton,
} from '@/components/members';
import { Suspense } from 'react';

export default async function Home() {
  const [myInfo, categories] = await Promise.all([
    getMyInfo(),
    getCategories(),
  ]);

  return (
    <div className='flex flex-col gap-4'>
      <Suspense fallback={<MemberInfoSectionSkeleton />}>
        <MemberInfoSection memberInfo={myInfo} />
      </Suspense>

      <CategorySlider categories={categories} />

      <AuctionPreviewSection />
    </div>
  );
}

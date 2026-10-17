import { getMyInfo } from '@/actions/member-service/get-my-info';
import { auth } from '@/actions/auth';
import { getCategories } from '@/actions/category-service/get-categories';
import { AuctionPreviewSection } from '@/components/auction';
import { CategorySlider } from '@/components/category';
import {
  MemberInfoSection,
  MemberInfoSectionSkeleton,
} from '@/components/members';
import { Suspense } from 'react';
import Link from 'next/link';
import { DemoSignInButton } from '@/components/sign-in/DemoSignInButton';

export default async function Home() {
  const session = await auth();
  const [myInfo, categories] = await Promise.all([
    session ? getMyInfo() : Promise.resolve(null),
    getCategories(),
  ]);

  return (
    <div className='flex flex-col gap-4'>
      {myInfo ? (
        <Suspense fallback={<MemberInfoSectionSkeleton />}>
          <MemberInfoSection memberInfo={myInfo} />
        </Suspense>
      ) : (
        <section className='border-b border-gray-200 pb-5' aria-label='체험 계정'>
          <h1 className='text-lg font-semibold text-gray-900'>찰낙찰낙</h1>
          <p className='mt-1 text-sm text-gray-600'>오늘의 경매를 둘러보세요.</p>
          <div className='mt-4'>
            {process.env.DEMO_MEMBER_ID && process.env.DEMO_MEMBER_PASSWORD ? (
              <DemoSignInButton />
            ) : (
              <Link href='/sign-in' className='text-sm font-semibold text-gray-900 underline'>
                로그인
              </Link>
            )}
          </div>
        </section>
      )}

      <CategorySlider categories={categories} />

      <AuctionPreviewSection />
    </div>
  );
}

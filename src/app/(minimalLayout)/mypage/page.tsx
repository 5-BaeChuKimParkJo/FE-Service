import {
  MyPageUserInfo,
  MyPageRecentSection,
  MyPageTransactionSection,
  MyPageLogoutSection,
} from '@/components/mypage';
import { getMyInfo } from '@/actions/member-service';

export default async function MyPage() {
  const myInfo = await getMyInfo();

  return (
    <main className='flex flex-col gap-2 mx-4'>
      <div className='bg-gray-50 p-6 rounded-xl'>
        <MyPageUserInfo myInfo={myInfo} />
      </div>

      <MyPageRecentSection />

      <MyPageTransactionSection />

      <MyPageLogoutSection />
    </main>
  );
}

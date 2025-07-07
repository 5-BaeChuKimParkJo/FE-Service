import {
  MyPageUserInfo,
  MyPageGradeSection,
  MyPageRecentSection,
  MyPageTransactionSection,
  MyPageLogoutSection,
} from '@/components/mypage';
import { getMyInfo } from '@/actions/member-service';
import { getGradeInfo } from '@/actions/grade-service';

export default async function MyPage() {
  const myInfo = await getMyInfo();
  const myGrade = await getGradeInfo(myInfo.gradeUuid);

  return (
    <main className='flex flex-col gap-2 mx-4'>
      <div className='bg-gray-50 p-6 rounded-xl'>
        <MyPageUserInfo myInfo={myInfo} myGrade={myGrade} />
        <MyPageGradeSection myInfo={myInfo} myGrade={myGrade} />
      </div>

      <MyPageRecentSection />

      <MyPageTransactionSection />

      <MyPageLogoutSection />
    </main>
  );
}

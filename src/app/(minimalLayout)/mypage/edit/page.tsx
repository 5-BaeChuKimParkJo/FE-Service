import { getMyInfo } from '@/actions/member-service/get-my-info';
import EditProfileForm from './EditProfileForm';

export default async function MyPageEditPage() {
  const myInfo = await getMyInfo();
  return <EditProfileForm myInfo={myInfo} />;
}

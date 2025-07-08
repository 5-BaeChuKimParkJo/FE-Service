'use server';

import { MemberInfo } from '@/types/member';
import { instance } from '@/actions/instance';

export async function getMyInfo(): Promise<MemberInfo> {
  return await instance.get<MemberInfo>('/member-service/api/v1/member', {
    next: {
      revalidate: 60 * 60,
    },
  });
}

'use server';

import { instance } from '@/actions/instance';
import { revalidatePath } from 'next/cache';

type MemberInfo = {
  nickname?: string;
  profileImageKey?: string;
  gradeUuid?: string;
  status?: string;
  point?: number;
  honor?: string;
};

export async function updateMemberInfo(memberInfo: MemberInfo) {
  const response = await instance.put(
    `/member-service/api/v1/member/update`,
    memberInfo,
  );
  revalidatePath('/', 'layout');
  return response;
}

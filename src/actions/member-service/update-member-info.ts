'use server';

import { instance } from '@/actions/instance';

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
  return response;
}

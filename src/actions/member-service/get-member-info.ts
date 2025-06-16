'use server';

import { ErrorResponse } from '@/types/api';
import { instance } from '../instance';

export interface MemberInfo {
  memberUuid: string;
  nickname: string;
  gradeUuid: string;
  honor: string;
  state: string;
  profileImageUrl: string;
  point: number;
}

export async function getMemberInfo(
  memberUuid: string,
): Promise<MemberInfo | ErrorResponse> {
  // const response = await instance.get<MemberInfo>(
  //   `/member-service/api/v1/members/${memberUuid}`,
  // );
  // return response;

  try {
    const response = await instance.get<MemberInfo>(
      `/member-service/api/v1/member/${memberUuid}`,
    );
    return response;
  } catch (error) {
    return error as ErrorResponse;
  }
}

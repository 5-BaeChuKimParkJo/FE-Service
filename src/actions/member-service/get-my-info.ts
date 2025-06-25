'use server';

import { cookies } from 'next/headers';
import { instance } from '../instance';
import { MemberInfo } from '@/types/member';
import { ErrorResponse } from '@/types/api';

export async function getMyInfo(): Promise<MemberInfo | ErrorResponse> {
  const cookieStore = await cookies();
  const memberUuid = cookieStore.get('memberUuid')?.value;
  if (!memberUuid) {
    return {
      code: '401',
      message: 'Member UUID is not found',
    } as ErrorResponse;
  }
  try {
    const response = await instance.get<MemberInfo>(
      `/member-service/api/v1/member/${memberUuid}`,
      {
        cache: 'no-cache',
      },
    );
    return response;
  } catch (error) {
    return error as ErrorResponse;
  }
}

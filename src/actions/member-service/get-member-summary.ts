'use server';

import { instance } from '@/actions';
import { MemberSummary } from '@/types/member';
import { ErrorResponse } from '@/types/api';

export async function getMemberSummary(
  memberUuid: string,
): Promise<MemberSummary> {
  try {
    const response = await instance.get<MemberSummary>(
      `/member-service/api/v1/member/${memberUuid}`,
    );
    return response as MemberSummary;
  } catch (error) {
    throw error as ErrorResponse;
  }
}

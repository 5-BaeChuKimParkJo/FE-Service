'use server';

import { instance } from '@/actions/instance';

type MemberProfilePresignedUrlResponse = {
  url: string;
  fields: Record<string, string>;
};

export async function getMemberProfileUrl(body: {
  contentType: string;
}): Promise<MemberProfilePresignedUrlResponse> {
  const response = await instance.post<MemberProfilePresignedUrlResponse>(
    `/member-service/api/v1/member/presigned-url`,
    body,
  );
  return response;
}

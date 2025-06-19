'use server';

import { ErrorResponse } from '@/types/api';
import { instance } from '../instance';

type TagIdResponse = {
  tagId: number;
  name: string;
};

export async function getTagId(name: string): Promise<number | ErrorResponse> {
  try {
    // const encodedName = encodeURIComponent(name);

    // const encodedName = encodeURI(name);
    const response = await instance.get<TagIdResponse>(
      `/tag-service/api/v1/tag/name/${name}`,
      {
        requireAuth: true,
        cache: 'force-cache',
      },
    );
    return response.tagId;
  } catch (error) {
    return error as ErrorResponse;
  }
}

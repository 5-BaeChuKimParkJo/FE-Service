'use server';

import { PresignedUrlRequest, PresignedUrlResponse } from '@/types/image';
import { instance } from '../instance';

export async function getPresignedUrls(requests: PresignedUrlRequest[]) {
  try {
    const promises = requests.map(async (req, index) => {
      const response = await instance.post<PresignedUrlResponse>(
        'auction-service/api/v1/auctions/presigned-url',
        req,
      );

      return {
        fileName: req.fileName,
        uploadUrl: response.url,
        fields: response.fields,
        key: response.fields.key,
        order: index, // 순서 정보 포함
      };
    });

    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error('Failed to get presigned URLs:', error);
    throw new Error('프리사인드 URL 요청에 실패했습니다.');
  }
}

// 단일 이미지용 (기존 호환성 유지)
export async function getPresignedUrl(request: PresignedUrlRequest) {
  const results = await getPresignedUrls([request]);
  return results[0];
}

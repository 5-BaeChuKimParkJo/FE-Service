'use server';

import { PresignedUrlRequest, PresignedUrlResponse } from '@/types/image';
import { instance } from '@/actions/instance';

export async function getProductPresignedUrls(requests: PresignedUrlRequest[]) {
  try {
    const promises = requests.map(async (req) => {
      const response = await instance.post<PresignedUrlResponse>(
        '/product-service/api/v1/product/presigned-url',
        req,
      );

      return {
        uploadUrl: response.url,
        fields: response.fields,
        key: response.fields.key,
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
export async function getProductPresignedUrl(request: PresignedUrlRequest) {
  const results = await getProductPresignedUrls([request]);
  return results[0];
}

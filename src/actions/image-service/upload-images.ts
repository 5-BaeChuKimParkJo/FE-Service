'use server';

import { instance } from '@/actions/instance';
import { API_PATHS } from '@/config/api';

type UploadedImage = {
  key: string;
  url: string;
};

/**
 * 여러 이미지를 병렬로 업로드합니다
 */
export async function uploadImages(files: File[]): Promise<string[]> {
  if (files.length === 0) {
    throw new Error('업로드할 이미지가 없습니다.');
  }

  const uploadPromises = files.map(async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file, file.name);
      const uploaded = await instance.post<UploadedImage>(
        API_PATHS.auctionImages,
        formData,
        { timeout: 30_000 },
      );
      return uploaded.key;
    } catch (error) {
      console.error(`파일 업로드 실패 (${file.name}):`, error);
      throw new Error(`이미지 업로드 실패: ${file.name}`);
    }
  });

  return Promise.all(uploadPromises);
}

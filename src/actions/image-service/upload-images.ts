'use server';

import { getPresignedUrls } from './get-presigned-urls';
import { uploadFileToS3 } from './upload-to-s3';
import { getFileContentType } from '@/utils/image-upload';

/**
 * 여러 이미지를 병렬로 업로드합니다
 */
export async function uploadImages(files: File[]): Promise<string[]> {
  if (files.length === 0) {
    throw new Error('업로드할 이미지가 없습니다.');
  }

  const presignedResults = await getPresignedUrls(
    files.map((file) => ({
      fileName: file.name,
      contentType: getFileContentType(file),
    })),
  );

  const uploadPromises = files.map(async (file, index) => {
    const presigned = presignedResults[index];
    try {
      await uploadFileToS3(file, presigned.uploadUrl, presigned.fields);
      return presigned.key;
    } catch (error) {
      console.error(`파일 업로드 실패 (${file.name}):`, error);
      throw new Error(`이미지 업로드 실패: ${file.name}`);
    }
  });

  return Promise.all(uploadPromises);
}

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

  // 1. 모든 파일에 대한 프리사인드 URL 요청
  const presignedRequests = files.map((file) => ({
    fileName: file.name,
    contentType: getFileContentType(file),
  }));

  const presignedResults = await getPresignedUrls(presignedRequests);

  // 2. 병렬로 모든 파일 업로드
  const uploadPromises = files.map(async (file, index) => {
    const presignedData = presignedResults[index];

    try {
      await uploadFileToS3(file, presignedData.uploadUrl, presignedData.fields);
      return presignedData.key; // S3 key 반환
    } catch (error) {
      console.error(`파일 업로드 실패 (${file.name}):`, error);
      throw new Error(`이미지 업로드 실패: ${file.name}`);
    }
  });

  // 모든 업로드 완료 대기
  const uploadedKeys = await Promise.all(uploadPromises);
  return uploadedKeys;
}

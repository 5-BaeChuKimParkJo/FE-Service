'use server';

import { createS3FormData } from '@/utils/image-upload';

export async function uploadFileToS3(
  file: File,
  uploadUrl: string,
  fields: Record<string, string>,
): Promise<void> {
  const formData = createS3FormData(file, fields);

  const response = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(
      `S3 업로드 실패: ${response.status} ${response.statusText}`,
    );
  }
}

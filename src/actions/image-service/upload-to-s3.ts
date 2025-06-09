'use server';

interface UploadData {
  uploadUrl: string;
  fields: Record<string, string>;
  key: string;
}

export async function uploadImageToS3(uploadData: UploadData, file: File) {
  try {
    const formData = new FormData();

    // fields의 모든 데이터를 formData에 추가
    Object.entries(uploadData.fields).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // 파일을 마지막에 추가 (중요: S3 정책에 따라 file이 마지막에 와야 함)
    formData.append('file', file);

    const response = await fetch(uploadData.uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(
        `Upload failed: ${response.status} ${response.statusText}`,
      );
    }

    return {
      success: true,
      key: uploadData.key,
    };
  } catch (error) {
    console.error('S3 upload failed:', error);
    throw new Error('이미지 업로드에 실패했습니다.');
  }
}

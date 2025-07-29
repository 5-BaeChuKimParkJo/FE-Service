/**
 * 파일의 MIME 타입을 가져옵니다
 */
export function getFileContentType(file: File): string {
  return file.type || 'image/jpeg';
}

/**
 * 파일 확장자에서 Content-Type을 추정합니다
 */
export function getContentTypeFromFileName(fileName: string): string {
  const extension = fileName.toLowerCase().split('.').pop();

  switch (extension) {
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'webp':
      return 'image/webp';
    case 'gif':
      return 'image/gif';
    default:
      return 'image/jpeg';
  }
}

/**
 * FormData에 S3 필드와 파일을 추가합니다
 */
export function createS3FormData(
  file: File,
  fields: Record<string, string>,
): FormData {
  const formData = new FormData();

  // 필드들을 FormData에 추가 (순서 중요!)
  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value);
  });

  // 파일은 마지막에 추가
  formData.append('file', file);

  return formData;
}

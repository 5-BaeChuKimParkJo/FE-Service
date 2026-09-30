export function getApiBaseUrl(): string {
  const url = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    throw new Error('API_URL 환경변수가 설정되지 않았습니다.');
  }
  return url.replace(/\/$/, '');
}

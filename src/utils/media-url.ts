export function isApplicationMediaUrl(url: string): boolean {
  return url.startsWith('/auction-service/api/v1/auction-images/');
}

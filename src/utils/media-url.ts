export function isApplicationMediaUrl(url: string): boolean {
  return url.startsWith('/auction-service/api/v1/auction-images/') ||
    url.startsWith('/member-service/api/v1/member/images?key=');
}

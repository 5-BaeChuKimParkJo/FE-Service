export const DEFAULT_PROFILE_IMAGE = '/images/penguins.svg';

export function getProfileImageUrl(url?: string | null): string {
  return url?.trim() ? url : DEFAULT_PROFILE_IMAGE;
}

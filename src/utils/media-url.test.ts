import { describe, expect, it } from 'vitest';
import { isApplicationMediaUrl } from './media-url';

describe('isApplicationMediaUrl', () => {
  it('recognizes profile images served by account-service through Kong', () => {
    expect(isApplicationMediaUrl('/member-service/api/v1/member/images?key=member/user/images/photo.png')).toBe(true);
    expect(isApplicationMediaUrl('/member-service/api/v1/member/images-invalid?key=private')).toBe(false);
  });
  it('recognizes media streamed through auction-service', () => {
    expect(
      isApplicationMediaUrl(
        '/auction-service/api/v1/auction-images/image-id.webp',
      ),
    ).toBe(true);
    expect(isApplicationMediaUrl('https://example.com/image.webp')).toBe(false);
  });
});

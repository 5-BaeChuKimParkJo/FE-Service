import { describe, expect, it } from 'vitest';
import { isApplicationMediaUrl } from './media-url';

describe('isApplicationMediaUrl', () => {
  it('recognizes media streamed through auction-service', () => {
    expect(
      isApplicationMediaUrl(
        '/auction-service/api/v1/auction-images/image-id.webp',
      ),
    ).toBe(true);
    expect(isApplicationMediaUrl('https://example.com/image.webp')).toBe(false);
  });
});

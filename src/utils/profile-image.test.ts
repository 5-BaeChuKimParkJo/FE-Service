import { describe, expect, it } from 'vitest';
import { getProfileImageUrl } from './profile-image';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

describe('getProfileImageUrl', () => {
  it.each([null, undefined, '', '   '])(
    'uses penguins for an unset image: %s',
    (value) => {
      expect(getProfileImageUrl(value)).toBe('/images/penguins.svg');
    },
  );

  it('preserves a custom profile photo', () => {
    const url =
      '/member-service/api/v1/member/images?key=member/user/images/photo.png';
    expect(getProfileImageUrl(url)).toBe(url);
  });

  it('provides the default image as a public asset', () => {
    expect(existsSync(resolve('public/images/penguins.svg'))).toBe(true);
  });
});
